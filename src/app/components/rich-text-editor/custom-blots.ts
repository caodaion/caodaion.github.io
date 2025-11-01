import Quill from 'quill';
import { FormField } from './models/delta.model';
import { FieldType } from '../../shared/services/custom-field-dialog/custom-field-dialog.service';

// Flag to enable print mode (to be controlled by the component)
let isPrintMode = false;

// Function to set print mode
export function setPrintMode(mode: boolean): void {
  isPrintMode = mode;
}

// This function should be called after Quill is fully loaded
export function registerCustomBlots(): void {
  // Only register if Quill is available and in browser environment
  if (typeof window === 'undefined' || !Quill) {
    return;
  }

  // Import required Quill classes with any type to bypass TypeScript errors
  const BlockEmbed: any = Quill.import('blots/block/embed');
  const Inline: any = Quill.import('blots/inline');
  const Embed: any = Quill.import('blots/embed');
  class MergeBlot extends BlockEmbed {
    static create(value: { key: string; title: string, description: string }) {
      const node = super.create();
      
      // Set data attributes for serialization
      node.setAttribute('data-merge-key', value.key || '');
      node.setAttribute('data-merge-title', value.title || '');
      node.setAttribute('data-merge-description', value.description || '');
      
      // Store the mergeTarget object as a JSON string in a data attribute
      const mergeTarget = {
        key: value.key || '',
        title: value.title || '',
        description: value.description || ''
      };
      node.setAttribute('data-merge-target', JSON.stringify(mergeTarget));
      node.setAttribute('contenteditable', 'false'); // Important for embed behavior
      
      // Create visual representation of merge target
      const container = document.createElement('div');
      container.className = 'merge-target-container';
      
      // Add header with key and title
      const header = document.createElement('div');
      header.className = 'merge-target-header';
      
      // Create badge for the key
      const keyBadge = document.createElement('span');
      keyBadge.className = 'merge-key-badge';
      keyBadge.textContent = value.key || '';
      header.appendChild(keyBadge);
      
      // Create title element
      const titleElement = document.createElement('h3');
      titleElement.className = 'merge-target-title';
      titleElement.textContent = value.title || 'Merge Target';
      header.appendChild(titleElement);
      
      container.appendChild(header);
      
      // Add description if available
      if (value.description) {
        const description = document.createElement('div');
        description.className = 'merge-target-description';
        description.textContent = value.description;
        container.appendChild(description);
      }
      
      node.appendChild(container);
      return node;
    }
    
    static value(node: HTMLElement) {
      // Parse the mergeTarget object from the data attribute if available
      const mergeTargetAttr = node.getAttribute('data-merge-target');
      if (mergeTargetAttr) {
        try {
          return JSON.parse(mergeTargetAttr);
        } catch (e) {
          console.error('Failed to parse mergeTarget:', e);
        }
      }
      
      // Fall back to individual attributes if needed
      return {
        key: node.getAttribute('data-merge-key') || '',
        title: node.getAttribute('data-merge-title') || '',
        description: node.getAttribute('data-merge-description') || '',
      };
    }
    
    static formats(node: HTMLElement) {
      // For formats, use the same approach as value()
      const mergeTargetAttr = node.getAttribute('data-merge-target');
      if (mergeTargetAttr) {
        try {
          return {
            mergeTarget: JSON.parse(mergeTargetAttr)
          };
        } catch (e) {
          console.error('Failed to parse mergeTarget for formats:', e);
        }
      }
      
      return {
        key: node.getAttribute('data-merge-key') || '',
        title: node.getAttribute('data-merge-title') || '',
        description: node.getAttribute('data-merge-description') || '',
      };
    }
  }

  // Define properties for Block Merge Blot using square bracket notation
  MergeBlot['blotName'] = 'blockMerge';
  MergeBlot['tagName'] = 'div';
  MergeBlot['className'] = 'ql-block-merge-blot';

  // Define Block Input Blot in a way that's more TypeScript friendly
  class BlockInputBlot extends BlockEmbed {
    static create(value: {
      id: string;
      label: string;
      placeholder: string;
      value?: string;
      fieldType?: FieldType;
      options?: string[];
      labelPosition?: 'before' | 'after';
      checked?: boolean;
      placeholderDots?: {
        length: number;
        autoFill: boolean;
      };
    }) {
      const node = super.create();

      // Create the input container
      const inputContainer = document.createElement('div');
      inputContainer.setAttribute('class', 'ql-block-input-container');

      // Get field type with default fallback
      const fieldType = value.fieldType || 'text';

      // Store data attributes on the node for serialization
      node.setAttribute('data-field-id', value.id || '');
      node.setAttribute('data-field-label', value.label || '');
      node.setAttribute('data-field-placeholder', value.placeholder || '');
      node.setAttribute('data-field-type', fieldType);

      if (value.options && value.options.length > 0) {
        node.setAttribute('data-field-options', JSON.stringify(value.options));
      }

      if (value.labelPosition) {
        node.setAttribute('data-label-position', value.labelPosition);
      }

      // Store placeholder dots settings if provided
      if (value.placeholderDots) {
        node.setAttribute(
          'data-placeholder-dots-length',
          value.placeholderDots.length.toString()
        );
        node.setAttribute(
          'data-placeholder-dots-autofill',
          value.placeholderDots.autoFill.toString()
        );
      }

      // Create label
      const label = document.createElement('label');
      label.textContent = value.label || 'Field';      // Print mode: just show the value instead of input field
      if (isPrintMode) {
        if (fieldType === 'checkbox') {
          // Store the checkbox state so it's preserved when toggling print mode
          const isChecked = value.value === 'true' || value.checked === true;
          node.setAttribute('data-value', isChecked.toString());
          node.setAttribute('data-checked', isChecked.toString()); // Important for proper state preservation
          const checkStatus = isChecked ? '☑' : '☐';
          inputContainer.innerHTML = `<div>${checkStatus} ${value.label}</div>`;
        } else if (fieldType === 'select') {
          // Get placeholder dots if specified
          let displayValue = value.value || '';
          if (!displayValue && value.placeholderDots) {
            displayValue = createPlaceholderDots(
              value.placeholderDots.length,
              value.placeholderDots.autoFill
            );
          }
          inputContainer.innerHTML = `<div><strong>${value.label}:</strong> ${displayValue}</div>`;
        } else {
          // Text field
          // Get placeholder dots if specified
          let displayValue = value.value || '';
          if (!displayValue && value.placeholderDots) {
            displayValue = createPlaceholderDots(
              value.placeholderDots.length,
              value.placeholderDots.autoFill
            );
          }
          inputContainer.innerHTML = `<div><strong>${value.label}:</strong> ${displayValue}</div>`;
        }
      } else {        // Create appropriate input based on field type
        if (fieldType === 'checkbox') {
          const labelPosition = value.labelPosition || 'before';
          const checkboxContainer = document.createElement('div');
          checkboxContainer.className = 'ql-checkbox-container';

          const input = document.createElement('input');
          input.setAttribute('type', 'checkbox');
          input.setAttribute('data-field-id', value.id || '');
          input.setAttribute('class', 'ql-block-checkbox');

          // First check if there's stored state in the node attributes
          const dataChecked = node.getAttribute('data-checked');
          if (dataChecked !== null) {
            input.checked = dataChecked === 'true';
          } else {
            // Fall back to the passed value
            input.checked = value.checked === true || value.value === 'true';
          }
          
          // Set the attribute for future reference
          node.setAttribute('data-checked', input.checked.toString());
          node.setAttribute('data-value', input.checked.toString());
          
          // Add an event listener to update the data attributes when checked state changes
          input.addEventListener('change', () => {
            node.setAttribute('data-checked', input.checked.toString());
            node.setAttribute('data-value', input.checked.toString());
          });

          // Arrange label and checkbox based on position preference
          if (labelPosition === 'before') {
            checkboxContainer.appendChild(label);
            checkboxContainer.appendChild(input);
          } else {
            checkboxContainer.appendChild(input);
            checkboxContainer.appendChild(label);
          }

          inputContainer.appendChild(checkboxContainer);
        } else if (fieldType === 'select') {
          const select = document.createElement('select');
          select.setAttribute('data-field-id', value.id || '');
          select.setAttribute('class', 'ql-block-select');

          // Add placeholder option
          const placeholderOption = document.createElement('option');
          placeholderOption.value = '';
          placeholderOption.textContent =
            value.placeholder || 'Select an option';
          placeholderOption.disabled = true;
          if (!value.value) {
            placeholderOption.selected = true;
          }
          select.appendChild(placeholderOption);

          // Add options from array
          if (value.options && value.options.length > 0) {
            value.options.forEach((option) => {
              const optionEl = document.createElement('option');
              optionEl.value = option;
              optionEl.textContent = option;
              if (value.value === option) {
                optionEl.selected = true;
              }
              select.appendChild(optionEl);
            });
          }

          inputContainer.appendChild(label);
          inputContainer.appendChild(select);
        } else {
          // Default text input
          const input = document.createElement('input');
          input.setAttribute('type', 'text');
          input.setAttribute(
            'placeholder',
            value.placeholder || 'Enter value...'
          );
          input.setAttribute('data-field-id', value.id || '');
          input.setAttribute('class', 'ql-block-input');

          if (value.value) {
            input.value = value.value;
          }

          // Assemble the elements
          inputContainer.appendChild(label);
          inputContainer.appendChild(input);
        }
      }

      node.appendChild(inputContainer);
      return node;
    }

    static value(node: HTMLElement): FormField {
      const fieldType =
        (node.getAttribute('data-field-type') as FieldType) || 'text';
      const label = node.getAttribute('data-field-label') || '';
      const labelPosition =
        (node.getAttribute('data-label-position') as 'before' | 'after') ||
        'before';

      let value = '';
      let checked = false;
      let options: string[] = [];

      // Get options if they exist
      const optionsAttr = node.getAttribute('data-field-options');
      if (optionsAttr) {
        try {
          options = JSON.parse(optionsAttr);
        } catch (e) {
          console.error('Failed to parse options:', e);
        }
      }

      // Get value based on field type
      if (fieldType === 'checkbox') {
        const checkbox = node.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;
        checked = checkbox?.checked || false;
        value = checked.toString();
      } else if (fieldType === 'select') {
        const select = node.querySelector('select') as HTMLSelectElement;
        value = select?.value || '';
      } else {
        const input = node.querySelector('input') as HTMLInputElement;
        value = input?.value || '';
      }

      // Base result that's common to all field types
      const result: FormField = {
        id: node.getAttribute('data-field-id') || '',
        type: 'block',
        label: label,
        placeholder: node.getAttribute('data-field-placeholder') || '',
        value: value,
        fieldType: fieldType,
      };

      // Add type-specific properties
      if (fieldType === 'checkbox') {
        result.labelPosition = labelPosition;
        result.checked = checked;
      } else if (fieldType === 'select') {
        result.options = options;
      }

      // Add placeholderDots if they exist
      const dotsLengthAttr = node.getAttribute('data-placeholder-dots-length');
      const dotsAutoFillAttr = node.getAttribute(
        'data-placeholder-dots-autofill'
      );
      if (dotsLengthAttr) {
        result.placeholderDots = {
          length: parseInt(dotsLengthAttr, 10) || 30,
          autoFill: dotsAutoFillAttr === 'true',
        };
      }

      return result;
    }
  }

  // Define properties for Block Input Blot using square bracket notation
  BlockInputBlot['blotName'] = 'blockInput';
  BlockInputBlot['tagName'] = 'div';
  BlockInputBlot['className'] = 'ql-block-input-blot';

  // Create a new AudioLinkBlot for connecting text to audio timestamps
  class AudioLinkBlot extends Inline {
    static create(value: { start: string; end: string; src?: string }) {
      const node = super.create();

      // Add data attributes for start and end times
      node.setAttribute('data-audio-start', value.start || '0');
      node.setAttribute('data-audio-end', value.end || '0');

      // Only set src attribute if provided - otherwise it will be applied externally
      if (value.src) {
        node.setAttribute('data-audio-src', value.src);
      }

      return node;
    }

    static value(node: HTMLElement) {
      return {
        start: node.getAttribute('data-audio-start') || '0',
        end: node.getAttribute('data-audio-end') || '0',
        src: node.getAttribute('data-audio-src') || '',
      };
    }

    static formats(node: HTMLElement) {
      // Use standard format to include in delta.ops
      return {
        start: node.getAttribute('data-audio-start') || '0',
        end: node.getAttribute('data-audio-end') || '0',
      };
    }
  }

  // Define properties for AudioLink Blot using square bracket notation
  AudioLinkBlot['blotName'] = 'audioLink';
  AudioLinkBlot['tagName'] = 'span';
  AudioLinkBlot['className'] = 'ql-audio-link-blot';

  // Create a new InlineInputBlot using Embed instead of Inline for better compatibility
  class InlineInputBlot extends Embed {
    static create(value: {
      id: string;
      placeholder?: string;
      value?: string;
      label?: string;
      fieldType?: FieldType;
      options?: string[];
      labelPosition?: 'before' | 'after';
      checked?: boolean;
      placeholderDots?: {
        length: number;
        autoFill: boolean;
      };
    }) {
      const node = super.create();

      // Set attributes
      node.setAttribute('data-field-id', value.id || '');
      node.setAttribute('contenteditable', 'false'); // Important for embed behavior
      node.setAttribute(
        'data-placeholder',
        value.placeholder || 'Enter value...'
      );

      // Add label and field type
      node.setAttribute('data-field-label', value.label || '');

      // Get field type with default fallback
      const fieldType = value.fieldType || 'text';
      node.setAttribute('data-field-type', fieldType);

      // Store options if provided
      if (value.options && value.options.length > 0) {
        node.setAttribute('data-field-options', JSON.stringify(value.options));
      }

      // Store label position if provided
      if (value.labelPosition) {
        node.setAttribute('data-label-position', value.labelPosition);
      }

      // Store placeholder dots settings if provided
      if (value.placeholderDots) {
        node.setAttribute(
          'data-placeholder-dots-length',
          value.placeholderDots.length.toString()
        );
        node.setAttribute(
          'data-placeholder-dots-autofill',
          value.placeholderDots.autoFill.toString()
        );
      }      // Store the value as a data attribute for ::after pseudo-element in print mode
      node.setAttribute('data-value', value.value || '');
      
      // For checkbox, always store the checked state explicitly in another data attribute
      // This ensures proper state preservation when toggling print mode
      if (fieldType === 'checkbox') {
        const isChecked = value.value === 'true' || value.checked === true;
        node.setAttribute('data-checked', isChecked.toString());
        node.setAttribute('data-value', isChecked.toString());
      }
      
      // Print mode: just show the value in appropriate format
      if (isPrintMode) {
        if (fieldType === 'checkbox') {
          const strongEl = document.createElement('strong');
          // Get checkbox state from data-checked attribute
          const isChecked = node.getAttribute('data-checked') === 'true';
          strongEl.textContent = isChecked ? `${value.label}` : '';
          node.appendChild(strongEl);
        } else {
          const strongEl = document.createElement('strong');
          // If value is empty and we have placeholder dots config, use dots instead
          let displayValue = value.value || '';
          if (!displayValue && value.placeholderDots) {
            displayValue = createPlaceholderDots(
              value.placeholderDots.length,
              value.placeholderDots.autoFill,
              node
            );
          }
          strongEl.innerHTML = displayValue;
          node.appendChild(strongEl);
        }
      } else {
        // Create appropriate input based on field type
        if (fieldType === 'checkbox') {
          const checkboxContainer = document.createElement('span');
          checkboxContainer.className = 'ql-inline-checkbox-container';          const input = document.createElement('input');
          input.type = 'checkbox';
          input.className = 'ql-inline-checkbox';
          
          // First check if there's stored state in the node attributes
          const dataChecked = node.getAttribute('data-checked');
          if (dataChecked !== null) {
            input.checked = dataChecked === 'true';
          } else {
            // Fall back to the passed value
            input.checked = value.checked === true || value.value === 'true';
          }
          
          // Set the attribute for future reference
          node.setAttribute('data-checked', input.checked.toString());
          node.setAttribute('data-value', input.checked.toString());

          // Create label if provided
          let labelEl = null;
          if (value.label) {
            labelEl = document.createElement('span');
            labelEl.className = 'ql-inline-checkbox-label';
            labelEl.textContent = value.label;
          }

          // Arrange label and checkbox based on position preference
          const labelPosition = value.labelPosition || 'after';
          if (labelPosition === 'before' && labelEl) {
            checkboxContainer.appendChild(labelEl);
            checkboxContainer.appendChild(input);
          } else {
            checkboxContainer.appendChild(input);
            if (labelEl) {
              checkboxContainer.appendChild(labelEl);
            }
          }

          // Set event handlers
          input.addEventListener('change', (e) => {
            e.stopPropagation();
            // Update both data attributes when checkbox state changes
            node.setAttribute('data-checked', input.checked.toString());
            node.setAttribute('data-value', input.checked.toString());
          });

          input.addEventListener('click', (e) => {
            e.stopPropagation();
          });

          node.appendChild(checkboxContainer);
        } else if (fieldType === 'select') {
          const selectContainer = document.createElement('span');
          selectContainer.className = 'ql-inline-select-container';

          // Add label if provided
          if (value.label) {
            const labelEl = document.createElement('span');
            labelEl.className = 'ql-inline-select-label';
            labelEl.textContent = value.label + ': ';
            selectContainer.appendChild(labelEl);
          }

          // Create select element
          const select = document.createElement('select');
          select.className = 'ql-inline-select';

          // Add placeholder option
          const placeholderOption = document.createElement('option');
          placeholderOption.value = '';
          placeholderOption.textContent = value.placeholder || 'Select';
          placeholderOption.disabled = true;
          if (!value.value) {
            placeholderOption.selected = true;
          }
          select.appendChild(placeholderOption);

          // Add options from array
          if (value.options && value.options.length > 0) {
            value.options.forEach((option) => {
              const optionEl = document.createElement('option');
              optionEl.value = option;
              optionEl.textContent = option;
              if (value.value === option) {
                optionEl.selected = true;
              }
              select.appendChild(optionEl);
            });
          }

          // Set event handlers
          select.addEventListener('change', (e) => {
            e.stopPropagation();
            // Update the data attribute when selection changes
            node.setAttribute('data-value', select.value);
          });

          selectContainer.appendChild(select);
          node.appendChild(selectContainer);
        } else {
          // Default text input
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = value.placeholder || 'Enter value...';
          input.value = value.value || '';
          input.className = 'ql-inline-input-field';

          node.appendChild(input);

          // Set styles directly to ensure proper rendering
          input.style.minWidth = '80px';
          input.style.border = '1px dashed #4285f4';
          input.style.borderRadius = '3px';
          input.style.padding = '2px 5px';
          input.style.margin = '0 2px';
          input.style.backgroundColor = '#e8f0fe';
          input.style.color = '#1a73e8';
          input.style.outline = 'none';
          input.style.fontSize = 'inherit';
          input.style.fontFamily = 'inherit';

          // Add event listeners to prevent propagation in editor
          input.addEventListener('click', (e) => {
            e.stopPropagation();
          });

          input.addEventListener('keydown', (e) => {
            e.stopPropagation();
          });

          input.addEventListener('focus', (e) => {
            input.style.backgroundColor = 'white';
            input.style.border = '1px solid #4285f4';
          });

          input.addEventListener('blur', (e) => {
            input.style.backgroundColor = '#e8f0fe';
            input.style.border = '1px dashed #4285f4';

            // Update the data-value attribute when input value changes
            node.setAttribute('data-value', input.value || '');
          });
        }
      }

      return node;
    }

    static value(node: HTMLElement): FormField {
      const fieldType =
        (node.getAttribute('data-field-type') as FieldType) || 'text';
      const label = node.getAttribute('data-field-label') || '';
      const labelPosition =
        (node.getAttribute('data-label-position') as 'before' | 'after') ||
        'after';

      let value = node.getAttribute('data-value') || '';
      let checked = false;
      let options: string[] = [];

      // Get options if they exist
      const optionsAttr = node.getAttribute('data-field-options');
      if (optionsAttr) {
        try {
          options = JSON.parse(optionsAttr);
        } catch (e) {
          console.error('Failed to parse options:', e);
        }
      }

      // Get value based on field type
      if (fieldType === 'checkbox') {
        // First check if we have a data-checked attribute (more reliable across mode switches)
        const dataChecked = node.getAttribute('data-checked');
        if (dataChecked !== null) {
          checked = dataChecked === 'true';
          value = checked.toString();
        } else {
          // Fall back to the actual checkbox element if data attribute not available
          const checkbox = node.querySelector(
            'input[type="checkbox"]'
          ) as HTMLInputElement;
          checked = checkbox?.checked || false;
          value = checked.toString();
        }
      } else if (fieldType === 'select') {
        const select = node.querySelector('select') as HTMLSelectElement;
        if (select) {
          value = select.value;
        }
      } else {
        const input = node.querySelector('input') as HTMLInputElement;
        if (input) {
          value = input.value;
        }
      }

      // Base result that's common to all field types
      const result: FormField = {
        id: node.getAttribute('data-field-id') || '',
        type: 'inline',
        label: label,
        placeholder: node.getAttribute('data-placeholder') || 'Enter value...',
        value: value,
        fieldType: fieldType,
      };

      // Add type-specific properties
      if (fieldType === 'checkbox') {
        result.labelPosition = labelPosition;
        result.checked = checked;
      } else if (fieldType === 'select') {
        result.options = options;
      }

      // Add placeholderDots if they exist
      const dotsLengthAttr = node.getAttribute('data-placeholder-dots-length');
      const dotsAutoFillAttr = node.getAttribute(
        'data-placeholder-dots-autofill'
      );
      if (dotsLengthAttr) {
        result.placeholderDots = {
          length: parseInt(dotsLengthAttr, 10) || 20, // Default to 20 for inline fields
          autoFill: dotsAutoFillAttr === 'true',
        };
      }

      return result;
    }
  }

  // Define properties for Inline Input Blot using square bracket notation
  InlineInputBlot['blotName'] = 'inlineInput';
  InlineInputBlot['tagName'] = 'span';
  InlineInputBlot['className'] = 'ql-inline-input-blot';
  // Register custom blots using the string-based format to avoid TypeScript errors
  Quill.register({
    'formats/blockInput': BlockInputBlot,
    'formats/inlineInput': InlineInputBlot,
    'formats/audioLink': AudioLinkBlot,
    'formats/blockMerge': MergeBlot
  });
}

// Helper function to create placeholder dots
function createPlaceholderDots(
  length: number,
  autoFill: boolean,
  node?: HTMLElement
): string {
  if (autoFill && node) {
    setTimeout(() => {
      // If autoFill is true and we have a node, try to calculate the space available
      // and adjust the dots accordingly to fill until the end of the line
      try {
        // Only run this in browser environments
        if (typeof window !== 'undefined' && document) {
          // Get the parent element that determines the width constraints
          const parentElement =
            node.parentElement || document.querySelector('.ql-editor');

          if (parentElement) {
            // Get parent's width information
            const parentRect = parentElement.getBoundingClientRect();
            const parentWidth = parentRect.width;

            // Get the node's current position
            const nodeRect = node.getBoundingClientRect();
            const nodeLeft = nodeRect.left - parentRect.left;
            node.style.width = parentWidth - nodeLeft + 'px';
            node.style.minWidth = parentWidth - nodeLeft + 'px';
            node.style.maxWidth = parentWidth - nodeLeft + 'px';
            node.style.display = 'inline-block';
            node.style.position = 'relative';
            node.style.overflow = 'hidden';
            node.classList.add('ql-inline-dots');
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
