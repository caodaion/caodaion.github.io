
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from "src/app/components/icon/icon.component";
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import html2canvas from 'html2canvas-pro';

@Component({
  selector: 'app-lesson',
  imports: [CommonModule, IconComponent, MatButtonModule, MatTabsModule, MatDialogModule],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss'
})
export class Lesson implements OnInit {
  currentQuizIndex = 0;
  showResult = false;
  correctCount = 0;

  dialog = inject(MatDialog)

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
  }

  // Optionally reset quiz for replay
  resetQuiz() {
    this.currentQuizIndex = 0;
    this.showResult = false;
    this.correctCount = 0;
    this.quizzes.forEach(q => delete q.selected);
  }

  selectChoice(quizIndex: number, choice: string) {
    this.quizzes[quizIndex].selected = choice;
  }
  @Input() lessonPost: any;
  flashcards: [string, string][] = [];
  flipped: boolean[] = [];
  currentCardIndex = 0;
  noAnim = false;
  quizzes: any[] = [];

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

  ngOnDestroy() {
    this.removeKeyboardEvents();
  }

  ngOnInit() {
    this.getPostFlashcard();
    this.getPostQuiz();
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
    } catch {
      this.quizzes = [];
    }
    console.log(this.quizzes);

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
  shareResult(shareResultDialog: any) {
    this.dialogRef = this.dialog.open(shareResultDialog, {
      panelClass: 'custom-dialog-container',
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
}

