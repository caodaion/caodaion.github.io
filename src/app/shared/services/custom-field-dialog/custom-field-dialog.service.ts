import { Injectable } from '@angular/core';

export type FieldType = 'text' | 'checkbox' | 'select';

export interface FieldOptions {
  id: string;
  label: string;
  placeholder: string;
  fieldType: FieldType;
  options?: string[]; // For select boxes
  labelPosition?: 'before' | 'after'; // Position of label for checkboxes
  defaultValue?: string; // Default value for the field
  defaultChecked?: boolean; // Default checked state for checkbox
  placeholderDots?: {
    length: number;
    autoFill: boolean;
  }; // Placeholder dots settings for print mode
}

@Injectable({
  providedIn: 'root'
})
export class CustomFieldDialogService {
  constructor() {}

  /**
   * Shows a dialog to configure custom field properties
   * @param defaultId Default ID for the field
   * @param defaultLabel Default label for the field
   * @param defaultPlaceholder Default placeholder for the field
   * @param defaultFieldType Default field type ('text', 'checkbox', 'select')
   * @param defaultOptions Default options for select field type
   * @param defaultLabelPosition Default label position for checkbox ('before', 'after')
   * @param defaultValue Default value for the field
   * @param defaultChecked Default checked state for checkbox
   * @param defaultPlaceholderDots Default placeholder dots settings for print mode
   * @returns A Promise that resolves to a FieldOptions object or null if cancelled
   */
  showCustomFieldDialog(
    defaultId: string, 
    defaultLabel: string = '', 
    defaultPlaceholder: string = 'Enter value',
    defaultFieldType: FieldType = 'text',
    defaultOptions: string[] = [],
    defaultLabelPosition: 'before' | 'after' = 'before',
    defaultValue: string = '',
    defaultChecked: boolean = false,
    defaultPlaceholderDots?: {
      length: number;
      autoFill: boolean;
    }
  ): Promise<FieldOptions | null> {
    // Create a dialog element
    const dialog = document.createElement('dialog');
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    dialog.style.maxWidth = '400px';
    dialog.style.width = '100%';
    dialog.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    // Convert options array to string for the textarea
    const optionsText = defaultOptions.join('\n');

    // Create dialog content
    dialog.innerHTML = `
      <div style="position: relative;">
        <h2 style="margin-top: 0; color: var(--primary-color, #4285f4); font-weight: 500;">Custom Field Properties</h2>
        <div style="margin-bottom: 16px;">
          <label for="field-id" style="display: block; margin-bottom: 4px; font-weight: 500;">Field ID:</label>
          <input type="text" id="field-id" value="${defaultId}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label for="field-type" style="display: block; margin-bottom: 4px; font-weight: 500;">Field Type:</label>
          <select id="field-type" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">
            <option value="text" ${defaultFieldType === 'text' ? 'selected' : ''}>Text</option>
            <option value="checkbox" ${defaultFieldType === 'checkbox' ? 'selected' : ''}>Checkbox</option>
            <option value="select" ${defaultFieldType === 'select' ? 'selected' : ''}>Select</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label for="field-label" style="display: block; margin-bottom: 4px; font-weight: 500;">Field Label:</label>
          <input type="text" id="field-label" value="${defaultLabel}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;" />
        </div>
        <div id="placeholder-container" style="margin-bottom: 16px; ${defaultFieldType === 'checkbox' ? 'display: none;' : ''}">
          <label for="field-placeholder" style="display: block; margin-bottom: 4px; font-weight: 500;">Placeholder:</label>
          <input type="text" id="field-placeholder" value="${defaultPlaceholder}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;" />
        </div>
        <div id="default-value-container" style="margin-bottom: 16px; ${defaultFieldType === 'checkbox' ? 'display: none;' : ''}">
          <label for="field-default-value" style="display: block; margin-bottom: 4px; font-weight: 500;">Default Value:</label>
          <input type="text" id="field-default-value" value="${defaultValue}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;" />
        </div>
        <div id="default-checked-container" style="margin-bottom: 16px; ${defaultFieldType !== 'checkbox' ? 'display: none;' : ''}">
          <label style="display: flex; align-items: center; cursor: pointer;">
            <input type="checkbox" id="field-default-checked" ${defaultChecked ? 'checked' : ''} style="margin-right: 8px;">
            Checked by default
          </label>
        </div>
        <div id="label-position-container" style="margin-bottom: 16px; ${defaultFieldType !== 'checkbox' ? 'display: none;' : ''}">
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">Label Position:</label>
          <div style="display: flex; gap: 16px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="radio" name="label-position" value="before" ${defaultLabelPosition === 'before' ? 'checked' : ''} style="margin-right: 6px;">
              Before checkbox
            </label>
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="radio" name="label-position" value="after" ${defaultLabelPosition === 'after' ? 'checked' : ''} style="margin-right: 6px;">
              After checkbox
            </label>
          </div>
        </div>
        <div id="options-container" style="margin-bottom: 16px; ${defaultFieldType !== 'select' ? 'display: none;' : ''}">
          <label for="field-options" style="display: block; margin-bottom: 4px; font-weight: 500;">Options (one per line):</label>
          <textarea id="field-options" style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">${optionsText}</textarea>
        </div>
        <div id="placeholder-dots-container" style="margin-bottom: 16px; ${defaultFieldType !== 'text' ? 'display: none;' : ''}">
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">Placeholder Dots:</label>
          <div style="display: flex; gap: 16px;">
            <div>
              <label for="placeholder-dots-length" style="display: block; margin-bottom: 4px;">Length:</label>
              <input type="number" id="placeholder-dots-length" value="${defaultPlaceholderDots?.length || ''}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="placeholder-dots-auto-fill" ${defaultPlaceholderDots?.autoFill ? 'checked' : ''} style="margin-right: 8px;">
                Auto Fill
              </label>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button id="cancel-btn" style="padding: 8px 16px; background: none; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Cancel</button>
          <button id="save-btn" style="padding: 8px 16px; background-color: var(--primary-color, #4285f4); color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
        </div>
      </div>
    `;

    // Add dialog to body
    document.body.appendChild(dialog);

    return new Promise<FieldOptions | null>((resolve) => {
      // Get references to elements
      const idInput = dialog.querySelector('#field-id') as HTMLInputElement;
      const labelInput = dialog.querySelector('#field-label') as HTMLInputElement;
      const placeholderInput = dialog.querySelector('#field-placeholder') as HTMLInputElement;
      const fieldTypeSelect = dialog.querySelector('#field-type') as HTMLSelectElement;
      const optionsTextarea = dialog.querySelector('#field-options') as HTMLTextAreaElement;
      const saveButton = dialog.querySelector('#save-btn') as HTMLButtonElement;
      const cancelButton = dialog.querySelector('#cancel-btn') as HTMLButtonElement;
      const optionsContainer = dialog.querySelector('#options-container') as HTMLDivElement;
      const placeholderContainer = dialog.querySelector('#placeholder-container') as HTMLDivElement;
      const labelPositionContainer = dialog.querySelector('#label-position-container') as HTMLDivElement;
      const defaultValueInput = dialog.querySelector('#field-default-value') as HTMLInputElement;
      const defaultCheckedInput = dialog.querySelector('#field-default-checked') as HTMLInputElement;
      const placeholderDotsContainer = dialog.querySelector('#placeholder-dots-container') as HTMLDivElement;
      const placeholderDotsLengthInput = dialog.querySelector('#placeholder-dots-length') as HTMLInputElement;
      const placeholderDotsAutoFillInput = dialog.querySelector('#placeholder-dots-auto-fill') as HTMLInputElement;

      // Add event listener for field type changes
      fieldTypeSelect.addEventListener('change', () => {
        const selectedType = fieldTypeSelect.value as FieldType;
        
        // Show/hide options textarea based on field type
        optionsContainer.style.display = selectedType === 'select' ? 'block' : 'none';
        
        // Show/hide placeholder input based on field type
        placeholderContainer.style.display = selectedType === 'checkbox' ? 'none' : 'block';
        
        // Show/hide default value input based on field type
        const defaultValueContainer = dialog.querySelector('#default-value-container') as HTMLDivElement;
        defaultValueContainer.style.display = selectedType === 'checkbox' ? 'none' : 'block';
        
        // Show/hide default checked input based on field type
        const defaultCheckedContainer = dialog.querySelector('#default-checked-container') as HTMLDivElement;
        defaultCheckedContainer.style.display = selectedType === 'checkbox' ? 'block' : 'none';
        
        // Show/hide label position options based on field type
        labelPositionContainer.style.display = selectedType === 'checkbox' ? 'block' : 'none';

        // Show/hide placeholder dots configuration based on field type
        placeholderDotsContainer.style.display = selectedType === 'text' ? 'block' : 'none';
      });

      // Handle save button click
      saveButton.addEventListener('click', () => {
        const fieldType = fieldTypeSelect.value as FieldType;
        const labelPositionRadios = dialog.querySelectorAll('input[name="label-position"]') as NodeListOf<HTMLInputElement>;
        let labelPosition: 'before' | 'after' = 'before';
        
        // Get selected label position
        labelPositionRadios.forEach((radio) => {
          if (radio.checked) {
            labelPosition = radio.value as 'before' | 'after';
          }
        });

        // Process options for select type
        let options: string[] = [];
        if (fieldType === 'select' && optionsTextarea.value.trim()) {
          options = optionsTextarea.value.split('\n')
            .map(option => option.trim())
            .filter(option => option !== '');
        }

        // Process placeholder dots configuration
        let placeholderDots: { length: number; autoFill: boolean } | undefined;
        if (fieldType === 'text') {
          const length = parseInt(placeholderDotsLengthInput.value, 10);
          const autoFill = placeholderDotsAutoFillInput.checked;
          if (!isNaN(length)) {
            placeholderDots = { length, autoFill };
          }
        }

        const result: FieldOptions = {
          id: idInput.value || defaultId,
          label: labelInput.value || defaultLabel,
          placeholder: placeholderInput.value || defaultPlaceholder,
          fieldType: fieldType,
          options: options,
          labelPosition: labelPosition,
          defaultValue: defaultValueInput.value || defaultValue,
          defaultChecked: defaultCheckedInput.checked || defaultChecked,
          placeholderDots: placeholderDots
        };
        
        dialog.close();
        document.body.removeChild(dialog);
        resolve(result);
      });

      // Handle cancel button click
      cancelButton.addEventListener('click', () => {
        dialog.close();
        document.body.removeChild(dialog);
        resolve(null);
      });

      // Show the dialog
      dialog.showModal();
    });
  }
}

