import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  inject,
  TemplateRef,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { registerCustomBlots } from './custom-blots';
import {
  ExtendedDelta,
  RichTextContent,
  AudioRange,
  FormField,
  DeltaOperation,
} from './models/delta.model';
import { CustomFieldDialogService } from '../../shared/services/custom-field-dialog/custom-field-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DocsService } from '../../shared/services/docs.service';
import { IconComponent } from "../icon/icon.component";
import { MatTooltip } from "@angular/material/tooltip";
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar, MatSnackBarModule, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [
    CommonModule,
    QuillModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    IconComponent,
    MatTooltip,
    MatMenuModule,
    MatSnackBarModule
],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
})
export class RichTextEditorComponent
  implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {
  @Input() placeholder: string = 'Enter text here...';
  @Input() minHeight: string = '200px';
  @Input() isReadOnly: boolean = false;
  @Input() isShowBackButton: boolean = false;
  @Input() content: string = '';
  @Input() deltaJson: string = '';
  @Input() showToolbar: boolean = true;
  @Input() audioSrc: string = ''; // Input for audio source
  @Input() printMode: boolean = false; // Enable print mode to show values instead of input fields
  @Input() title: string = ''; // Document title
  @Input() showTitleInput: boolean = false; // Show title input field
  @Input() showSaveButton: boolean = false; // Show save button
  @Input() saveButtonDisabled: boolean = false; // Disable save button
  @Output() contentChanged = new EventEmitter<string>();
  @Output() titleChanged = new EventEmitter<string>(); // Event when title changes
  @Output() saveRequested = new EventEmitter<void>(); // Event when save button is clicked
  @Output() audioLinkAdded = new EventEmitter<{ range: any; audioInfo: any }>(); // Event for audio links
  @Output() audioLinkClicked = new EventEmitter<{
    start: number;
    end: number;
    src: string;
  }>(); // Event for audio link clicks

  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('saveContent') saveContent!: any;

  editorForm = new FormControl('');
  quillEditorRef: any;
  isDisabled: boolean = false;
  blotsRegistered = false;
  isMobile = false;
  // Audio state
  currentAudioStart: number = 0;
  currentAudioEnd: number = 5;
  currentAudioTime: number = 0;
  showAudioLinkModal: boolean = false;
  tempSelectedRange: any = null;
  activeAudioLinks: HTMLElement[] = []; // Track currently active audio segments

  editorModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video'],
        ['block-input', 'inline-input', 'audio-link'],
      ],
      handlers: {
        'block-input': () => this.insertBlockInput(),
        'inline-input': () => this.insertInlineInput(),
        'audio-link': () => this.showAudioLinkDialog(),
      },
    },
  };

  // Snackbar properties for copy notification
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;

  constructor(
    private matDialog: MatDialog,
    private docsService: DocsService,
    private location: Location,
    private breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar
  ) {
    // Register custom blots as early as possible
    if (typeof window !== 'undefined') {
      registerCustomBlots();
      this.blotsRegistered = true;
    }
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(
        map((result) => result.matches),
        shareReplay()
      )
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    // Make sure custom blots are registered
    if (!this.blotsRegistered && typeof window !== 'undefined') {
      registerCustomBlots();
      this.blotsRegistered = true;

      // Double check that blots are registered - important for avoiding ParchmentError
      console.log('Custom blots registration status:', this.blotsRegistered);
    }

    if (this.isReadOnly) {
      // If in read-only mode, disable the toolbar
      this.editorModules = {
        toolbar: false as any,
      };
    }

    // Try to extract audioSrc from deltaJson if not explicitly provided
    this.extractAudioSrcFromDelta();

    this.editorForm.valueChanges.subscribe((content: any) => {
      if (!this.isReadOnly) {
        this.onChange(content);
        this.contentChanged.emit(content);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When deltaJson changes, check for audioSrc
    if (changes['deltaJson']) {
      this.extractAudioSrcFromDelta();

      // If in read-only mode and quill editor is ready, set the contents
      if (this.deltaJson && this.isReadOnly && this.quillEditorRef) {
        try {
          const delta = JSON.parse(this.deltaJson);
          this.quillEditorRef.setContents(delta);
          return; // Skip other content updates if delta was applied
        } catch (e) {
          console.error('Error parsing Delta JSON in ngOnChanges:', e);
        }
      }
    }

    // Fall back to HTML content if Delta JSON isn't available or failed
    if (changes['content'] && this.content && this.isReadOnly) {
      if (this.quillEditorRef) {
        this.quillEditorRef.clipboard.dangerouslyPasteHTML(this.content);
      } else {
        this.editorForm.setValue(this.content, { emitEvent: false });
      }
    }

    // Update read-only state if it changes
    if (changes['isReadOnly'] && this.quillEditorRef) {
      this.quillEditorRef.enable(!this.isReadOnly);
    }

    // Update print mode if it changes
    if (changes['printMode']) {
      this.updatePrintMode();
    }
  }

  ngAfterViewInit(): void {
    // Add custom buttons to the toolbar if not in read-only mode
    if (!this.isReadOnly && this.showToolbar) {
      this.addCustomButtonsToToolbar();
    }

    // Set initial content if provided
    if (this.content && this.isReadOnly && this.quillEditorRef) {
      this.quillEditorRef.clipboard.dangerouslyPasteHTML(this.content);
    }

    // Add event listener for audio links after a short delay to ensure the DOM is ready
    setTimeout(() => this.setupAudioLinkClickHandlers(), 100);
  }

  // Handle click events for audio links
  setupAudioLinkClickHandlers(): void {
    const container = document.querySelector('.rich-text-editor-container');
    if (!container) return;

    // Use event delegation for better performance
    container.addEventListener('click', (e: Event) => {
      // Find if we clicked on an audio link or its descendants
      const target = e.target as HTMLElement;
      const audioLink = target.closest('.ql-audio-link-blot');

      // If an audio link was clicked, add the 'clicked' class
      if (audioLink) {
        // Get the start time from the link
        const start = audioLink.getAttribute('data-audio-start');
        const end = audioLink.getAttribute('data-audio-end');
        const src = audioLink.getAttribute('data-audio-src');

        // Update the currentAudioStart and currentAudioEnd values to match the link's timestamps
        if (start) {
          this.currentAudioStart = parseFloat(start);
        }

        if (end) {
          this.currentAudioEnd = parseFloat(end);
        }

        // Set the audio player's current time to the start time if available
        if (start && this.audioPlayerRef?.nativeElement) {
          let startTime = parseFloat(start);

          // Check if this link's start time is the same as the previous segment's end time
          // by finding the previous audio link element in the document
          const allAudioLinks = Array.from(
            document.querySelectorAll('.ql-audio-link-blot')
          );
          const currentIndex = allAudioLinks.indexOf(audioLink);

          if (currentIndex > 0) {
            const previousLink = allAudioLinks[currentIndex - 1];
            const prevEnd = previousLink.getAttribute('data-audio-end');

            // If the current start time equals the previous end time, add a small buffer
            if (prevEnd && Math.abs(parseFloat(prevEnd) - startTime) < 0.001) {
              // Add 50ms (0.05s) to avoid exact boundary issues
              startTime += 0.05;
            }
          }

          // Always update the current time of the audio player
          this.audioPlayerRef.nativeElement.currentTime = startTime;

          // Only play audio if in read-only mode
          if (this.isReadOnly) {
            this.audioPlayerRef.nativeElement.play().catch((err) => {
              console.error('Error playing audio:', err);
            });
          }
        }

        // Emit event for audio link click
        if (start && end && src) {
          this.audioLinkClicked.emit({
            start: parseFloat(start),
            end: parseFloat(end),
            src,
          });
        }
      }
    });
  }

  // ControlValueAccessor methods
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(content: any): void {
    this.editorForm.setValue(content || '', { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.editorForm.disable();
    } else {
      this.editorForm.enable();
    }
  }

  // Custom methods for editor functionality
  onEditorCreated(editor: any): void {
    this.quillEditorRef = editor;

    // Apply read-only state if needed
    if (this.isReadOnly && this.quillEditorRef) {
      this.quillEditorRef.enable(false);

      // If Delta JSON is provided, use it (priority over HTML content)
      if (this.deltaJson) {
        try {
          const delta = JSON.parse(this.deltaJson);

          // Extract audio source from delta root level
          if (delta.audioSrc) {
            this.audioSrc = delta.audioSrc;
          }

          this.quillEditorRef.setContents(delta);

          // Apply audio source to all audio links after a short delay
          if (this.audioSrc) {
            setTimeout(() => this.applyAudioSourceToLinks(this.audioSrc), 100);
          }
        } catch (e) {
          console.error('Error parsing Delta JSON:', e);
        }
      }
      // Fall back to HTML content if Delta JSON isn't available
      else if (this.content) {
        this.quillEditorRef.clipboard.dangerouslyPasteHTML(this.content);

        // Apply audio source to all audio links after a short delay
        if (this.audioSrc) {
          setTimeout(() => this.applyAudioSourceToLinks(this.audioSrc), 100);
        }
      }
    }
  }

  // Insert a block input field
  async insertBlockInput(): Promise<void> {
    if (!this.quillEditorRef || this.isReadOnly) return;

    const range = this.quillEditorRef.getSelection(true);
    const defaultId = this.generateUniqueId();

    // Show dialog to let user configure field properties
    const fieldConfig = await this.fieldDialogService.showCustomFieldDialog(
      defaultId,
      'Field Label',
      'Enter your value here',
      'text', // default to text field
      [], // no default options
      'before', // default label position
      '', // default value
      false, // default checked state
      {
        length: 30,
        autoFill: false,
      } // default placeholder dots settings
    );

    // If user cancelled, don't insert anything
    if (!fieldConfig) return;

    // Get default value and checked state from field config
    let defaultValue = fieldConfig.defaultValue || '';
    let isChecked = fieldConfig.defaultChecked || false;

    // If no default value was set but we have options for a select, use the first option
    if (
      fieldConfig.fieldType === 'select' &&
      !defaultValue &&
      fieldConfig.options &&
      fieldConfig.options.length > 0
    ) {
      defaultValue = fieldConfig.options[0];
    }

    // Insert the block input field with custom properties
    this.quillEditorRef.insertEmbed(
      range.index,
      'blockInput',
      {
        id: fieldConfig.id,
        label: fieldConfig.label,
        placeholder: fieldConfig.placeholder,
        fieldType: fieldConfig.fieldType,
        options: fieldConfig.options,
        labelPosition: fieldConfig.labelPosition,
        value: defaultValue, // Set default value
        checked: isChecked, // Set default checked state
        placeholderDots: fieldConfig.placeholderDots, // Set placeholder dots settings
      },
      Quill.sources.USER
    );

    // Insert a line break after block input for better formatting
    this.quillEditorRef.insertText(range.index + 1, '\n', Quill.sources.USER);
    this.quillEditorRef.setSelection(range.index + 2, 0, Quill.sources.SILENT);
  }

  // Service for custom field dialog
  private fieldDialogService = inject(CustomFieldDialogService);

  // Insert an inline input field
  async insertInlineInput(): Promise<void> {
    if (!this.quillEditorRef || this.isReadOnly) return;

    const range = this.quillEditorRef.getSelection(true);
    const defaultId = this.generateUniqueId();

    // Show custom field dialog to let user configure field properties
    const fieldConfig = await this.fieldDialogService.showCustomFieldDialog(
      defaultId,
      'Field Label',
      'Enter value',
      'text', // default to text field
      [], // no default options
      'after', // default label position for inline elements
      '', // default value
      false, // default checked state
      {
        length: 20,
        autoFill: false,
      } // default placeholder dots settings
    );

    // If user cancelled, don't insert anything
    if (!fieldConfig) return;

    // Get default value and checked state from field config
    let defaultValue = fieldConfig.defaultValue || '';
    let isChecked = fieldConfig.defaultChecked || false;

    // If no default value was set but we have options for a select, use the first option
    if (
      fieldConfig.fieldType === 'select' &&
      !defaultValue &&
      fieldConfig.options &&
      fieldConfig.options.length > 0
    ) {
      defaultValue = fieldConfig.options[0];
    }

    // Insert the inline input field with custom properties
    this.quillEditorRef.insertEmbed(
      range.index,
      'inlineInput',
      {
        id: fieldConfig.id,
        label: fieldConfig.label,
        placeholder: fieldConfig.placeholder,
        fieldType: fieldConfig.fieldType,
        options: fieldConfig.options,
        labelPosition: fieldConfig.labelPosition,
        value: defaultValue,
        checked: isChecked,
        placeholderDots: fieldConfig.placeholderDots,
      },
      Quill.sources.USER
    );

    // Move cursor after the inline input to maintain typing flow
    this.quillEditorRef.setSelection(range.index + 1, 0, Quill.sources.SILENT);

    // Focus the newly created input element
    setTimeout(() => {
      const fields = document.querySelectorAll('.ql-inline-input-blot');
      const newField = fields[fields.length - 1] as HTMLElement;

      if (newField) {
        // Find the appropriate input element based on field type
        let inputElement: HTMLElement | null = null;
        if (fieldConfig.fieldType === 'checkbox') {
          inputElement = newField.querySelector('input[type="checkbox"]');
        } else if (fieldConfig.fieldType === 'select') {
          inputElement = newField.querySelector('select');
        } else {
          inputElement = newField.querySelector('input');
        }

        if (inputElement) {
          inputElement.focus();
        }
      }
    }, 10);
  }

  // Audio timeupdate event handler
  onAudioTimeUpdate(event: Event): void {
    const audioElement = event.target as HTMLAudioElement;
    this.currentAudioTime = audioElement.currentTime;

    // Highlight text segments that match the current audio time
    this.updateActiveAudioLinks(audioElement.currentTime);
  }

  // Update the highlighted text segments based on current audio time
  updateActiveAudioLinks(currentTime: number): void {
    // First, remove highlight from previously active segments
    this.activeAudioLinks.forEach((element) => {
      element.classList.remove('ql-active-audio-segment');
    });
    this.activeAudioLinks = [];

    // Find all audio link segments
    const audioLinkElements = document.querySelectorAll('.ql-audio-link-blot');

    // Check each segment to see if the current time falls within its range
    audioLinkElements.forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        const start = parseFloat(
          element.getAttribute('data-audio-start') || '0'
        );
        const end = parseFloat(element.getAttribute('data-audio-end') || '0');

        // If current time is within this segment's range
        if (currentTime >= start && currentTime <= end) {
          // Add highlight class
          element.classList.add('ql-active-audio-segment');
          // Add to active links array
          this.activeAudioLinks.push(element);
        }
      }
    });
  }

  // Audio pause event handler
  onAudioPause(event: Event): void {
    const audioElement = event.target as HTMLAudioElement;
    // Update the end time to the current position when audio is paused
    this.currentAudioEnd = audioElement.currentTime;

    // Make sure start time is less than end time
    if (this.currentAudioEnd <= this.currentAudioStart) {
      this.currentAudioStart = Math.max(0, this.currentAudioEnd - 5);
    }
  }

  // Set the current audio time as the start time
  setAudioStartTime(): void {
    this.currentAudioStart = this.currentAudioTime;
    // If end time is less than start time, adjust it
    if (this.currentAudioEnd <= this.currentAudioStart) {
      this.currentAudioEnd = this.currentAudioStart + 5;
    }
  }

  // Set the current audio time as the end time
  setAudioEndTime(): void {
    this.currentAudioEnd = this.currentAudioTime;
    // If end time is less than start time, adjust start time
    if (this.currentAudioEnd <= this.currentAudioStart) {
      this.currentAudioStart = Math.max(0, this.currentAudioEnd - 5);
    }
  }

  // Audio linking functionality - improved with audio player controls
  showAudioLinkDialog(): void {
    if (!this.quillEditorRef || this.isReadOnly) return;

    const range = this.quillEditorRef.getSelection(true);
    if (range.length === 0) {
      alert('Please select some text to link with audio.');
      return;
    }

    // Store the selection range temporarily
    this.tempSelectedRange = range;

    // If we don't have an audio source yet, ask for one
    if (!this.audioSrc) {
      const newAudioSrc = prompt('Enter audio source URL:', '');
      if (!newAudioSrc) return; // User cancelled

      this.audioSrc = newAudioSrc;

      // Wait for audio element to initialize
      setTimeout(() => {
        if (this.audioPlayerRef?.nativeElement) {
          const confirmPrompt = confirm(
            'Audio source added. Use the audio player controls below to set timestamps. Click OK to apply with current values, or Cancel to adjust timing first.'
          );
          if (confirmPrompt) {
            this.applyAudioLink();
          }
        }
      }, 500);
    } else {
      // We already have audio source, just ask for confirmation to use current timing values
      const confirmPrompt = confirm(
        `Apply audio link with start: ${this.currentAudioStart.toFixed(
          2
        )}s and end: ${this.currentAudioEnd.toFixed(2)}s?`
      );
      if (confirmPrompt) {
        this.applyAudioLink();
      }
    }
  }

  // Apply the audio link with current values
  applyAudioLink(): void {
    if (!this.tempSelectedRange) return;

    this.formatAudioLink(this.tempSelectedRange, {
      start: this.currentAudioStart.toString(),
      end: this.currentAudioEnd.toString(),
      src: this.audioSrc,
    });

    // Clear the temp selection
    this.tempSelectedRange = null;
  }

  formatAudioLink(range: any, audioInfo: any): void {
    if (!this.quillEditorRef || !range || range.length === 0) return;

    // Update current values for next usage
    this.currentAudioStart = parseFloat(audioInfo.end);
    this.currentAudioEnd = this.currentAudioStart + 5;

    // Store the audio source URL if provided
    if (audioInfo.src && audioInfo.src.trim() !== '') {
      this.audioSrc = audioInfo.src;
    }

    // Format the selected text as an audio link - only pass time ranges to delta
    this.quillEditorRef.formatText(
      range.index,
      range.length,
      'audioLink',
      {
        start: audioInfo.start,
        end: audioInfo.end,
        // Include src here for DOM element initialization, but it won't be saved in delta
        src: this.audioSrc,
      },
      Quill.sources.USER
    );

    // Update the delta to include audioSrc at root level
    this.updateDeltaWithAudioSource();

    // Emit event about the new audio link
    this.audioLinkAdded.emit({
      range,
      audioInfo: {
        start: audioInfo.start,
        end: audioInfo.end,
        src: this.audioSrc,
      },
    });
  }

  // Apply the audio source URL to all audio link elements
  applyAudioSourceToLinks(src: string): void {
    if (!src || !this.quillEditorRef) return;

    this.audioSrc = src;

    // Wait for DOM to be updated
    setTimeout(() => {
      // Find all audio link blots and update their src attribute
      const audioLinks = document.querySelectorAll('.ql-audio-link-blot');
      audioLinks.forEach((link) => {
        link.setAttribute('data-audio-src', src);
      });
    }, 50);
  }

  // Handle audio source in delta root
  updateDeltaWithAudioSource(): void {
    if (!this.quillEditorRef) return;

    // Get current delta (contents)
    const delta = this.quillEditorRef.getContents();

    // Add audio source at root level
    if (this.audioSrc) {
      delta.audioSrc = this.audioSrc;
    }

    // Set the updated delta back
    this.quillEditorRef.setContents(delta);
  }

  // Add custom buttons to the Quill toolbar
  private addCustomButtonsToToolbar(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      const toolbar = document.querySelector('.ql-toolbar');
      if (toolbar) {
        // Create container for custom buttons if it doesn't exist
        let customButtonsContainer = document.querySelector(
          '.ql-formats:last-child'
        );
        if (!customButtonsContainer) {
          customButtonsContainer = document.createElement('span');
          customButtonsContainer.className = 'ql-formats';
          toolbar.appendChild(customButtonsContainer);
        }

        // Block input button
        if (!document.querySelector('.ql-block-input')) {
          const blockInputButton = document.createElement('button');
          blockInputButton.className = 'ql-block-input';
          blockInputButton.title = 'Insert block input field';

          // Add a data attribute for CSS to add the icon via background image
          blockInputButton.setAttribute('data-icon', 'block-input');

          customButtonsContainer.appendChild(blockInputButton);
        }

        // Inline input button
        if (!document.querySelector('.ql-inline-input')) {
          const inlineInputButton = document.createElement('button');
          inlineInputButton.className = 'ql-inline-input';
          inlineInputButton.title = 'Insert inline input field';

          // Add a data attribute for CSS to add the icon via background image
          inlineInputButton.setAttribute('data-icon', 'inline-input');

          customButtonsContainer.appendChild(inlineInputButton);
        }

        // Audio link button
        if (!document.querySelector('.ql-audio-link')) {
          const audioLinkButton = document.createElement('button');
          audioLinkButton.className = 'ql-audio-link';
          audioLinkButton.title = 'Link text to audio timestamp';

          // Add a data attribute for CSS to add the icon via background image
          audioLinkButton.setAttribute('data-icon', 'audio-link');

          customButtonsContainer.appendChild(audioLinkButton);

          // Add click event listener
          audioLinkButton.addEventListener('click', () => {
            this.showAudioLinkDialog();
          });
        }
      }
    }, 0);
  }

  // Helper method to generate unique IDs for fields
  private generateUniqueId(): string {
    return 'field-' + Math.random().toString(36).substring(2, 11);
  }
  // Extract content with input field and audio link values
  getContentWithValues(): RichTextContent {
    if (!this.quillEditorRef)
      return {
        delta: { ops: [] },
        content: '',
        fields: [],
        audioLinks: [],
      };

    // Get the delta content directly
    const delta = this.quillEditorRef.getContents();

    // Add the audio source to the delta object at root level
    if (this.audioSrc) {
      delta.audioSrc = this.audioSrc;
    }

    const content = this.editorForm.value;
    const fields: FormField[] = [];
    const audioLinks: AudioRange[] = [];
    const addedIds = new Set<string>(); // Track added IDs to prevent duplicates

    // Extract block input fields (all types)
    const blockInputs = document.querySelectorAll('.ql-block-input-blot');
    blockInputs.forEach((container: Element) => {
      const fieldId = container.getAttribute('data-field-id') || '';
      const fieldType = container.getAttribute('data-field-type') || 'text';

      // Only add if ID exists and hasn't been added yet
      if (fieldId && !addedIds.has(fieldId)) {
        let value = '';
        let checked = false;

        // Extract value based on field type
        if (fieldType === 'checkbox') {
          const checkbox = container.querySelector(
            'input[type="checkbox"]'
          ) as HTMLInputElement;
          checked = checkbox?.checked || false;
          value = checked.toString();
        } else if (fieldType === 'select') {
          const select = container.querySelector('select') as HTMLSelectElement;
          value = select?.value || '';
        } else {
          const input = container.querySelector('input') as HTMLInputElement;
          value = input?.value || '';
        }

        // Prepare field object
        const field: FormField = {
          id: fieldId,
          type: 'block',
          fieldType: fieldType as any, // Cast to any to satisfy TypeScript
          label: container.getAttribute('data-field-label') || '',
          placeholder: container.getAttribute('data-field-placeholder') || '',
          value: value,
          checked: checked,
          labelPosition:
            (container.getAttribute('data-label-position') as any) || 'before',
        };

        // Extract placeholderDots if they exist
        const dotsLengthAttr = container.getAttribute(
          'data-placeholder-dots-length'
        );
        const dotsAutofillAttr = container.getAttribute(
          'data-placeholder-dots-autofill'
        );

        if (dotsLengthAttr) {
          field.placeholderDots = {
            length: parseInt(dotsLengthAttr, 10) || 30,
            autoFill: dotsAutofillAttr === 'true',
          };
        }

        fields.push(field);
        addedIds.add(fieldId);
      }
    });

    // Extract inline input fields (all types)
    const inlineInputs = document.querySelectorAll('.ql-inline-input-blot');
    inlineInputs.forEach((container: Element) => {
      const fieldId = container.getAttribute('data-field-id') || '';
      const fieldType = container.getAttribute('data-field-type') || 'text';

      // Only add if ID exists and hasn't been added yet
      if (fieldId && !addedIds.has(fieldId)) {
        let value = '';
        let checked = false;

        // Extract value based on field type
        if (fieldType === 'checkbox') {
          const checkbox = container.querySelector(
            'input[type="checkbox"]'
          ) as HTMLInputElement;
          checked = checkbox?.checked || false;
          value = checked.toString();
        } else if (fieldType === 'select') {
          const select = container.querySelector('select') as HTMLSelectElement;
          value = select?.value || '';
        } else {
          const input = container.querySelector('input') as HTMLInputElement;
          value = input?.value || '';
        }

        // Prepare field object
        const field: FormField = {
          id: fieldId,
          type: 'inline',
          fieldType: fieldType as any, // Cast to any to satisfy TypeScript
          label: container.getAttribute('data-field-label') || '',
          placeholder: container.getAttribute('data-placeholder') || '',
          value: value,
          checked: checked,
          labelPosition:
            (container.getAttribute('data-label-position') as any) || 'after',
        };

        // Extract placeholderDots if they exist
        const dotsLengthAttr = container.getAttribute(
          'data-placeholder-dots-length'
        );
        const dotsAutofillAttr = container.getAttribute(
          'data-placeholder-dots-autofill'
        );

        if (dotsLengthAttr) {
          field.placeholderDots = {
            length: parseInt(dotsLengthAttr, 10) || 20, // Default to 20 for inline fields
            autoFill: dotsAutofillAttr === 'true',
          };
        }

        fields.push(field);
        addedIds.add(fieldId);
      }
    }); // Extract audio links - we only need time ranges since src is stored at delta root
    const audioLinkElements = document.querySelectorAll('.ql-audio-link-blot');
    audioLinkElements.forEach((element: Element) => {
      audioLinks.push({
        text: element.textContent || '',
        start: element.getAttribute('data-audio-start') || '0',
        end: element.getAttribute('data-audio-end') || '0',
      });
    });

    return {
      delta, // Return the complete delta with audioSrc at root level
      content,
      fields,
      audioLinks,
    };
  }
  // Helper method to extract audioSrc from deltaJson
  private extractAudioSrcFromDelta(): void {
    if (this.deltaJson) {
      try {
        const delta = JSON.parse(this.deltaJson);
        if (delta.audioSrc) {
          this.audioSrc = delta.audioSrc;
        }
      } catch (e) {
        console.error('Error parsing Delta JSON when extracting data:', e);
      }
    }
  }// Update print mode functionality
  private updatePrintMode(): void {
    import('./custom-blots').then((module) => {
      // First, gather all current form values to preserve them through the refresh
      const formValues = this.captureAllFormValues();

      // Call the setPrintMode function from custom-blots
      module.setPrintMode(this.printMode);

      // If we have a Quill editor instance, refresh the content to apply the print mode
      if (this.quillEditorRef) {
        const currentContents = this.quillEditorRef.getContents();

        // Store the current selection
        const selection = this.quillEditorRef.getSelection();

        // Reapply the contents to trigger redrawing of all blots with print mode
        this.quillEditorRef.setContents(currentContents);

        // Restore the form values after the refresh - use a longer timeout to ensure DOM is ready
        setTimeout(() => {
          this.restoreFormValues(formValues);

          // Additional step for checkboxes - force update any that might have been missed
          formValues.forEach((value, id) => {
            if (value.hasOwnProperty('checked')) {
              const blots = document.querySelectorAll(
                `.ql-inline-input-blot[data-field-id="${id}"], .ql-block-input-blot[data-field-id="${id}"]`
              );

              blots.forEach((blot) => {
                if (blot instanceof HTMLElement) {
                  blot.setAttribute('data-checked', value.checked.toString());
                  blot.setAttribute('data-value', value.checked.toString());
                }
              });
            }
          });
        }, 100); // Increased timeout for reliability

        // Restore selection if it existed
        if (selection) {
          this.quillEditorRef.setSelection(selection);
        }
      }
    });
  }
  // Helper method to capture all form values before toggling print mode
  private captureAllFormValues(): Map<string, any> {
    const values = new Map<string, any>();
    if (!this.quillEditorRef) return values;

    // Capture all checkbox states
    const checkboxes = document.querySelectorAll(
      '.ql-inline-checkbox, .ql-block-checkbox'
    );
    checkboxes.forEach((element: Element) => {
      const checkbox = element as HTMLInputElement;
      const id = checkbox.getAttribute('data-field-id') || '';
      if (id) {
        // Get the containing blot to store data on
        const blot = checkbox.closest(
          '.ql-inline-input-blot, .ql-block-input-blot'
        );
        if (blot instanceof HTMLElement) {
          // Store checked state in data-checked attribute for better preservation
          blot.setAttribute('data-checked', checkbox.checked.toString());
          blot.setAttribute('data-value', checkbox.checked.toString());
        }

        values.set(id, {
          checked: checkbox.checked,
          value: checkbox.checked.toString(),
        });
      }
    });

    // Capture all text input values
    const textInputs = document.querySelectorAll(
      '.ql-inline-input-field, .ql-block-input'
    );
    textInputs.forEach((element: Element) => {
      const input = element as HTMLInputElement;
      const id = input.getAttribute('data-field-id') || '';
      if (id) {
        values.set(id, { value: input.value });
      }
    });

    // Capture all select values
    const selects = document.querySelectorAll(
      '.ql-inline-select, .ql-block-select'
    );
    selects.forEach((element: Element) => {
      const select = element as HTMLSelectElement;
      const id = select.getAttribute('data-field-id') || '';
      if (id) {
        values.set(id, { value: select.value });
      }
    });

    return values;
  }
  // Helper method to restore form values after toggling print mode
  private restoreFormValues(values: Map<string, any>): void {
    // For each stored value, find the corresponding element and update it
    values.forEach((value, id) => {
      // Find all elements with the matching data-field-id
      const elements = document.querySelectorAll(`[data-field-id="${id}"]`);

      // If no elements found by data-field-id, check for blots with this ID
      if (elements.length === 0) {
        const blots = document.querySelectorAll(
          `.ql-inline-input-blot[data-field-id="${id}"], .ql-block-input-blot[data-field-id="${id}"]`
        );
        blots.forEach((blot) => {
          // For blots, update data attributes directly
          if (blot instanceof HTMLElement) {
            if (value.hasOwnProperty('checked')) {
              blot.setAttribute('data-checked', value.checked.toString());
              blot.setAttribute('data-value', value.checked.toString());
            } else if (value.hasOwnProperty('value')) {
              blot.setAttribute('data-value', value.value);
            }
          }
        });
      }

      // Update input elements if found
      elements.forEach((element: Element) => {
        if (element instanceof HTMLElement) {
          if (
            element.tagName === 'INPUT' &&
            element.getAttribute('type') === 'checkbox'
          ) {
            // For checkboxes, use the stored checked state
            if (value.hasOwnProperty('checked')) {
              (element as HTMLInputElement).checked = value.checked;

              // Also update both data attributes on the parent blot for consistency
              const blot = element.closest(
                '.ql-inline-input-blot, .ql-block-input-blot'
              );
              if (blot) {
                blot.setAttribute('data-value', value.value);
                blot.setAttribute('data-checked', value.checked.toString());
              }
            }
          } else if (
            element.tagName === 'INPUT' ||
            element.tagName === 'SELECT'
          ) {
            if (value.hasOwnProperty('value')) {
              (element as HTMLInputElement | HTMLSelectElement).value =
                value.value;
            }
          }
        }
      });
    });
  }
  // Toggle print mode on button click
  togglePrintMode(): void {
    this.printMode = !this.printMode;
    this.updatePrintMode();
  }

  // Handle title change
  onTitleChange(newTitle: string): void {
    this.title = newTitle;
    this.titleChanged.emit(newTitle);
  }

  // Handle save button click
  onSaveClick(): void {
    const dialogRef = this.matDialog.open(this.saveContent, {
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });
    
    // Emit the event in case parent component needs to know
    this.saveRequested.emit();
  }

  // Copy delta JSON to clipboard
  copyToClipboard(deltaJson: any): void {
    navigator.clipboard.writeText(deltaJson);
    this._snackBar.open('Đã sao chép', 'Đóng', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


  // Print content with print mode enabled
  printContent(): void {
    // First enable print mode if not already enabled
    if (!this.printMode) {
      this.printMode = true;
      this.updatePrintMode();
    }

    // Create a new window for printing only the editor content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the content');
      return;
    }

    // Give time for print mode to be applied
    setTimeout(() => {
      // Get the editor's content
      const editorContent = this.quillEditorRef
        ? document.querySelector('.ql-editor')?.innerHTML || ''
        : '';

      // Get all stylesheets from the current document
      const styles = Array.from(document.styleSheets)
        .filter((styleSheet) => {
          try {
            // Filter out stylesheets from different origins that can't be accessed due to CORS
            return styleSheet.cssRules; // This will throw an error if the stylesheet is from a different origin
          } catch (e) {
            return false;
          }
        })
        .map((styleSheet) => {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        })
        .join('\n');

      // Extract Quill-specific styles
      const quillStyles = styles.match(/\.ql-[^{]*\{[^}]*\}/g) || [];
      const customStyles =
        styles.match(/\.rich-text-editor-container[^{]*\{[^}]*\}/g) || [];
      const allStyles = [...quillStyles, ...customStyles].join('\n');

      // Create a styled document for printing
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              color: #000000;
              background-color: white;
              margin: 0;
            }
            .print-content {
              background-color: white;
              margin: 0;
              max-width: 210mm;
              padding: 11mm;
            }
            .print-content-editor {
              white-space: pre-wrap;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1em;
              margin-bottom: 0.5em;
            }
            p {
              margin: 0;
            }
            
            /* Important Quill specific styles */
            .ql-align-center {
              text-align: center;
            }
            .ql-align-right {
              text-align: right;
            }
            .ql-align-justify {
              text-align: justify;
            }
            .ql-indent-1 {
              padding-left: 3em;
            }
            .ql-indent-2 {
              padding-left: 6em;
            }
            .ql-indent-3 {
              padding-left: 9em;
            }
            .ql-indent-4 {
              padding-left: 12em;
            }
            .ql-indent-5 {
              padding-left: 15em;
            }
            .ql-indent-6 {
              padding-left: 18em;
            }
            .ql-indent-7 {
              padding-left: 21em;
            }
            .ql-indent-8 {
              padding-left: 24em;
            }
            .ql-size-small {
              font-size: 0.75em;
            }
            .ql-size-large {
              font-size: 1.5em;
            }
            .ql-size-huge {
              font-size: 2.5em;
            }
            blockquote {
              border-left: 4px solid #ccc;
              margin-bottom: 5px;
              margin-top: 5px;
              padding-left: 16px;
            }
            code, pre {
              background-color: #f0f0f0;
              border-radius: 3px;
            }
            pre {
              white-space: pre-wrap;
              margin-bottom: 5px;
              margin-top: 5px;
              padding: 5px 10px;
            }
            
            /* Custom styles for inputs */
            .ql-block-input-blot {
              margin: 1rem 0;
              padding: 0.75rem;
              border-radius: 0 4px 4px 0;
            }
            .ql-inline-input-blot span {
              padding: 0;
              border-radius: 3px;
            }
            .ql-inline-input-blot.ql-inline-dots-block::after {
              content: "________________________________________________________________________________________________________________________________________________________________________________________________________________";
              position: absolute;
              left: 0;
              bottom: 0;
              overflow: hidden;
              font-weight: bold;
            }
            .ql-audio-link-blot {
              background-color: rgba(255, 213, 79, 0.2);
              border-radius: 2px;
              padding: 0 3px;
            }
            
            /* List styles */
            ol {
              padding-left: 1.5em;
            }
            ul {
              padding-left: 1.5em;
            }
            
            /* Table styles */
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1em;
            }
            td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            
            /* Image styles */
            img {
              max-width: 100%;
              height: auto;
            }
            
            /* Font styles */
            .ql-font-serif {
              font-family: Georgia, Times New Roman, serif;
            }
            .ql-font-monospace {
              font-family: Monaco, Courier New, monospace;
            }
            
            /* Link styles */
            a {
              color: #06c;
              text-decoration: underline;
            }
            
            /* Print specific styles */
            @media print {
              @page {
                size: A4;
                margin: 0;
                scale: 100%;
              }
              body {
                font-family: 'Roboto', sans-serif;
                color: #000000;
                background-color: white;
                margin: 0;
                zoom: 90%;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-content {
                background-color: white;
                margin: 0;
                max-width: 100%;
                width: 100%;
                padding: 10mm;
                box-sizing: border-box;
              }
              .print-content-editor {
                white-space: pre-wrap;
                font-size: 12pt;
                line-height: 1.5;
              }              
              /* Print specific styles */
            }
            
            /* Dynamic extracted styles from the document */
            ${allStyles}
          </style>
        </head>
        <body>
          <div class="print-content"><div class="print-content-editor">${editorContent}</div></div>
          <script>
            // Auto print when loaded
            window.onload = function() {
              function createPlaceholderDots(
                length,
                autoFill,
                node
              ) {
                if (autoFill && node) {
                  setTimeout(function() {
                    // If autoFill is true and we have a node, try to calculate the space available
                    // and adjust the dots accordingly to fill until the end of the line
                    try {
                      // Only run this in browser environments
                      if (typeof window !== 'undefined' && document) {
                        // Get the parent element that determines the width constraints
                        const parentElement =
                          node.parentElement || document.querySelector('.print-content-editor');
                        console.log('Parent element:', parentElement);
                        if (parentElement) {
                          // Get parent's width information
                          const parentRect = parentElement.getBoundingClientRect();
                          const parentWidth = parentRect.width;
                          console.log(parentWidth);
                          

                          // Get the node's current position
                          const nodeRect = node.getBoundingClientRect();
                          const nodeLeft = nodeRect.left - parentRect.left;
                          console.log('Node left:', node);
                          console.log('Node left:', nodeLeft);
                          node.style.width = parentWidth - nodeLeft + 'px';
                          node.style.minWidth = parentWidth - nodeLeft + 'px';
                          node.style.maxWidth = parentWidth - nodeLeft + 'px';
                          node.style.display = 'inline-block';
                          node.style.position = 'relative';
                          node.style.overflow = 'hidden';
                          node.style.height = '1rem';
                          node.classList.add('ql-inline-dots-block');
                          return '';
                        }
                      }
                      return '';
                    } catch (e) {
                      console.error('Error calculating dots width:', e);
                    }
                    return '';
                  });
                  return '';
                }

                // Standard behavior when autoFill is false or calculation fails
                return '_'.repeat(length);
              }
              
              // Function to create a delay using Promise
              function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
              
              // Process input elements with placeholder dots
              const inputs = document.querySelectorAll('.ql-block-input-blot, .ql-inline-input-blot.ql-inline-dots');
              
              // Using Promise chain instead of nested setTimeout calls
              delay(500)
                .then(() => {
                  inputs.forEach(function(input) {
                    const dotsLength = parseInt(
                      input.getAttribute('data-placeholder-dots-length') || '0',
                      10
                    );
                    const autoFill = input.getAttribute('data-placeholder-dots-autofill') === 'true';
                    if (autoFill) {
                      input.style.width = '0';
                      input.style.minWidth = '0';
                      input.style.maxWidth = '0';
                      input.classList.remove('ql-inline-dots');
                    }
                    const placeholderDots = createPlaceholderDots(dotsLength, autoFill, input);
                    
                    // Set the placeholder dots
                    if (input instanceof HTMLElement) {
                      input.innerHTML = placeholderDots;
                    }
                  });
                  return delay(1000);
                })
                .then(() => {
                  // Print the window content
                  window.print();
                  return delay(0);
                })
                .then(() => {
                  // Uncomment the below line if you want to close the window after printing
                  window.close();
                })
                .catch(error => {
                  console.error('Error during print process:', error);
                });
            };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
    }, 300);
  }

  onBackClick(): void {
    this.location.back();
  }
}
