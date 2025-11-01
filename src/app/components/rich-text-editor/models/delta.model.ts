/**
 * Models for Quill Delta format with custom extensions
 */
import { FieldType } from '../../../shared/services/custom-field-dialog/custom-field-dialog.service';

/**
 * Represents a single operation in a Quill Delta
 */
export interface DeltaOperation {
  insert?: string | object;
  delete?: number;
  retain?: number;
  attributes?: {
    [key: string]: any;
    audioLink?: {
      start: string;
      end: string;
    };
    mergeTarget?: {
      key: string;
      title: string;
      description?: string;
    };
    blockInput?: {
      id: string;
      label: string;
      placeholder: string;
      value: string;
      fieldType?: FieldType;
      options?: string[];
      labelPosition?: 'before' | 'after';
      checked?: boolean;
      placeholderDots?: {
        length: number;
        autoFill: boolean;
      };
    };
    inlineInput?: {
      id: string;
      placeholder: string;
      value: string;
      label?: string;
      fieldType?: FieldType;
      options?: string[];
      labelPosition?: 'before' | 'after';
      checked?: boolean;
      placeholderDots?: {
        length: number;
        autoFill: boolean;
      };
    };
  };
}

/**
 * Represents an audio timestamp range
 */
export interface AudioRange {
  text: string;
  start: string;
  end: string;
}

/**
 * Represents a form field (block or inline)
 */
export interface FormField {
  id: string;
  type: 'block' | 'inline';
  label?: string;
  placeholder?: string;
  value: string;
  fieldType?: FieldType;
  options?: string[];
  labelPosition?: 'before' | 'after';
  checked?: boolean;
  placeholderDots?: {
    length: number;
    autoFill: boolean;
  };
}

/**
 * Extended Quill Delta with custom properties
 */
export interface ExtendedDelta {
  ops: DeltaOperation[];
  audioSrc?: string;
  data?: ExtendedDeltaData;
  mergeSource?: MergeSource;
}

export interface ExtendedDeltaData {
  title?: string;
  key?: string;
  formData?: any;
}

/**
 * Represents a merge target block
 */
export interface MergeTarget {
  key: string;
  title: string;
  description?: string;
}

/**
 * Represents a merge source reference
 */
export interface MergeSource {
  documentId: string;
  mergeTargetKey: string;
}

/**
 * Rich text editor content with structured data
 */
export interface RichTextContent {
  delta: ExtendedDelta;
  content: string | null; // Updated to allow null values
  fields: FormField[];
  audioLinks: AudioRange[];
}
