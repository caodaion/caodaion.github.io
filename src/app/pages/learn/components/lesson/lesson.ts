

import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from "src/app/components/icon/icon.component";
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChildHeaderComponent } from 'src/app/components/child-header/child-header.component';
import { LearnDataService } from '../../services/learn-data.service';
import { LearnResultsService, LearnResult, QuizAnswer } from '../../services/learn-results.service';
import html2canvas from 'html2canvas-pro';
import { SeoService } from 'src/app/shared/services/seo.service';
import { ButtonShareModule } from "src/app/components/button-share/button-share.module";
import { MatTooltipModule } from '@angular/material/tooltip';
import * as QRCode from 'qrcode'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lesson',
  imports: [
    CommonModule,
    IconComponent,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    ChildHeaderComponent,
    ButtonShareModule,
    MatTooltipModule
  ],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss'
})
export class Lesson implements OnInit {
  currentQuizIndex = 0;
  showResult = false;
  checkAnswer(quizIndex: number) {
    if (!this.quizzes[quizIndex].selected) return;
    this.quizzes[quizIndex].showImmediateFeedback = true;
  }
  correctCount = 0;

  dialog = inject(MatDialog);

  lessonPost: any;
  flashcards: [string, string][] = [];
  flipped: boolean[] = [];
  currentCardIndex = 0;
  noAnim = false;
  quizzes: any[] = [];
  currentTitle: string = '';
  lessonSlug: string = '';
  quizStartTime: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private learnDataService: LearnDataService,
    private learnResultsService: LearnResultsService,
    private seoService: SeoService
  ) { }

  onGoBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  setupKeyboardEvents() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  removeKeyboardEvents() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (event: KeyboardEvent) => {
    if (this.flashcards.length === 0) return;
    if (event.code === 'Space') {
      event.preventDefault();
      this.toggleFlip(this.currentCardIndex);
    } else if (event.code === 'ArrowLeft') {
      event.preventDefault();
      this.showPrevCard();
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      this.showNextCard();
    }
  }

  goToNextQuiz(skip: boolean = false) {
    if (skip && !this.quizzes[this.currentQuizIndex].selected) {
      this.quizzes[this.currentQuizIndex].selected = null;
    }
    if (this.currentQuizIndex < this.quizzes.length - 1) {
      this.currentQuizIndex++;
    } else {
      this.calculateResult();
      this.showResult = true;
    }
  }

  calculateResult() {
    this.correctCount = this.quizzes.filter(q => q.selected === q.dap_an).length;

    // Save result to IndexedDB
    this.saveLearnResult();
  }

  // Optionally reset quiz for replay
  resetQuiz() {
    this.currentQuizIndex = 0;
    this.showResult = false;
    this.correctCount = 0;
    this.quizStartTime = new Date(); // Reset timer for new attempt
    this.quizzes.forEach(q => delete q.selected);
  }

  selectChoice(quizIndex: number, choice: string) {
    if (this.quizzes[quizIndex].selected) return; // Không cho chọn lại
    this.quizzes[quizIndex].selected = choice;
    this.quizzes[quizIndex].showImmediateFeedback = false;
  }
  ngOnDestroy() {
    this.removeKeyboardEvents();
  }

  ngOnInit() {
    // Get lesson data from router state or route params
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['lessonData']) {
      this.lessonPost = navigation.extras.state['lessonData'];
      this.currentTitle = this.lessonPost.title || 'Bài học';
      this.extractLessonSlug();
      this.initializeLessonContent();
    } else {
      // Fallback: get lesson slug from route params and find data
      this.route.params.subscribe(params => {
        const slug = params['slug'];
        if (slug) {
          this.lessonSlug = slug;
          console.log('Lesson slug:', slug);
          this.lessonPost = this.learnDataService.findLessonBySlug(slug);
          if (this.lessonPost) {
            this.currentTitle = this.lessonPost.title || 'Bài học';
            this.initializeLessonContent();
          } else {
            // If lesson not found in service, wait for data to load
            this.learnDataService.hocPosts$.subscribe(posts => {
              if (posts.length > 0) {
                this.lessonPost = this.learnDataService.findLessonBySlug(slug);
                if (this.lessonPost) {
                  this.currentTitle = this.lessonPost.title || 'Bài học';
                  this.initializeLessonContent();
                }
              }
            });
          }
        }
      });
    }
  }

  /**
   * Set SEO metadata for the calendar page
   */
  private setSeoMetadata(): void {
    this.seoService.updateMetadata({
      title: `Học ${this.currentTitle || ''}`,
      description: `Bài học về đạo Cao Đài: ${this.currentTitle || ''}`,
      url: 'hoc',
      keywords: 'Học, đạo Cao Đài, bài học, giáo lý, tín đồ Cao Đài, tôn giáo, triết lý, tâm linh, CaoDaiON',
    });
  }

  private initializeLessonContent() {
    this.setSeoMetadata();
    this.getPostFlashcard();
    this.getPostQuiz();
  }

  private extractLessonSlug() {
    if (this.lessonPost?.url) {
      const urlMatch = this.lessonPost.url.match(/\/(\d{4})\/(\d{2})\/([^/]+)\.html$/);
      if (urlMatch && urlMatch[3]) {
        this.lessonSlug = urlMatch[3];
      }
    }
  }

  private async saveLearnResult() {
    if (!this.lessonPost || !this.lessonSlug) {
      console.warn('Cannot save result: missing lesson data or slug');
      return;
    }

    const answers: QuizAnswer[] = this.quizzes.map((quiz, index) => ({
      questionIndex: index,
      question: quiz.cau_hoi,
      selectedAnswer: quiz.selected || null,
      correctAnswer: quiz.dap_an,
      isCorrect: quiz.selected === quiz.dap_an
    }));

    const timeSpent = this.quizStartTime
      ? Math.round((new Date().getTime() - this.quizStartTime.getTime()) / 1000)
      : undefined;

    const result: Omit<LearnResult, 'id'> = {
      lessonSlug: this.lessonSlug,
      lessonTitle: this.lessonPost.title || 'Bài học',
      lessonUrl: this.lessonPost.url || '',
      totalQuestions: this.quizzes.length,
      correctAnswers: this.correctCount,
      percentage: Math.round((this.correctCount / this.quizzes.length) * 100),
      answers,
      completedAt: new Date(),
      timeSpent
    };

    try {
      const savedId = await this.learnResultsService.saveLearnResult(result);
      console.log('Learn result saved with ID:', savedId);
    } catch (error) {
      console.error('Error saving learn result:', error);
    }
  }

  onTabChange(event: any) {
    // event.index === 1 is the flashcard tab
    if (event.index === 1) {
      this.setupKeyboardEvents();
    } else {
      this.removeKeyboardEvents();
    }
  }

  getPostFlashcard() {
    const content = this.lessonPost?.content;
    const match = content?.match(/<script[^>]*data=["']flashcard["'][^>]*>([\s\S]*?)<\/script>/);
    if (!match) return;
    try {
      const arrayText = match[1].trim();
      try {
        this.flashcards = JSON.parse(arrayText);
      } catch {
        // Fallback for legacy data if not valid JSON
        this.flashcards = (new Function('return ' + arrayText))();
      }
      this.flipped = Array(this.flashcards.length).fill(false);
      this.currentCardIndex = 0;
    } catch {
      this.flashcards = [];
      this.flipped = [];
    }
  }

  getPostQuiz() {
    const content = this.lessonPost?.content;
    const match = content?.match(/<script[^>]*data=["']quiz["'][^>]*>([\s\S]*?)<\/script>/);
    if (!match) return;
    try {
      const arrayText = match[1].trim();
      this.quizzes = JSON.parse(arrayText);


      // Start timer when quiz is loaded and available
      if (this.quizzes.length > 0 && !this.quizStartTime) {
        this.quizStartTime = new Date();
      }
    } catch {
      this.quizzes = [];
    }
    this.quizzes.forEach(q => {
      q.questionType = typeof q.cau_hoi;
      if (q?.questionType === 'object') {
        console.log(q?.cau_hoi);

        q?.cau_hoi?.forEach((part: any, index: any) => {
          const partObject = <any>{}
          const typeMatchers: { type: string, match: (part: any) => boolean }[] = [
            { type: 'image', match: (p) => typeof p === 'string' && p.includes('img') },
            { type: 'text', match: (p) => typeof p === 'string' }
            // Add more types here as needed
          ];
          const matched = typeMatchers.find(m => m.match(part));
          partObject.type = matched ? matched.type : 'unknown';
          partObject.content = part;
          q.cau_hoi[index] = partObject;
        });
      }
    });
  }

  toggleFlip(i: number) {
    this.flipped[i] = !this.flipped[i];
  }
  showNextCard() {
    if (this.currentCardIndex < this.flashcards.length - 1) {
      this.noAnim = true;
      this.flipped[this.currentCardIndex + 1] = false;
      this.currentCardIndex++;
      setTimeout(() => this.noAnim = false, 0);
    }
  }
  showPrevCard() {
    if (this.currentCardIndex > 0) {
      this.noAnim = true;
      this.flipped[this.currentCardIndex - 1] = false;
      this.currentCardIndex--;
      setTimeout(() => this.noAnim = false, 0);
    }
  }

  dialogRef: any;
  qrUrl: any;
  shareResult(shareResultDialog: any) {
    this.qrUrl = this.generateQRCodeDataUrl(window.location.href)
      .subscribe(url => {
        this.qrUrl = url;
        this.dialogRef = this.dialog.open(shareResultDialog, {
          panelClass: 'custom-dialog-container',
          height: '90vh',
        });
      });
  }

  @ViewChild('sharedResultContent') sharedResultContent!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef<HTMLImageElement>;
  isGenerating = false;
  imagePreviewUrl: string | null = null;
  async generateImage(isDownload: boolean = false): Promise<void> {
    if (!this.sharedResultContent) return;

    this.isGenerating = true;

    try {
      const canvas = await html2canvas(this.sharedResultContent.nativeElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true
      });

      this.imagePreviewUrl = canvas.toDataURL('image/png');
      setTimeout(() => {
        // Scroll mat-dialog-content to preview image
        const dialogContent = document.querySelector('mat-dialog-content');
        const imgEl = this.previewImage?.nativeElement;
        if (dialogContent && imgEl) {
          const imgRect = imgEl.getBoundingClientRect();
          const dialogRect = dialogContent.getBoundingClientRect();
          dialogContent.scrollTop += (imgRect.top - dialogRect.top) - 24;
        }
      }, 100);

      if (!isDownload) {
        this.isGenerating = false;
        return;
      }
      const link = document.createElement('a');
      const filename = `hoc-${this.lessonPost?.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().getTime()}.png`;

      link.href = this.imagePreviewUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Wait for the image to load
      setTimeout(() => {
        this.isGenerating = false;
      }, 300);
    } catch (error) {
      console.error('Error generating image:', error);
      this.isGenerating = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  generateQRCodeDataUrl(input: any): Observable<any> {
    return new Observable((observable: any) => {
      QRCode.toDataURL(input)
        .then(url => {
          observable.next(url)
        })
        .catch(err => {
          console.error(err);
        });
    })
  }
}

