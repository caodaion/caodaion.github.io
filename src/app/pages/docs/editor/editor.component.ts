import {
  AfterViewInit,
  Component,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RichTextEditorComponent } from '../../../components/rich-text-editor/rich-text-editor.component';
import { DocsService } from '../../../shared/services/docs.service';
import { ActivatedRoute } from '@angular/router';
import { ChildHeaderComponent } from '../../../components/child-header/child-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../shared/services/common/common.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TnhtSheetService } from '../../../shared/services/tnht-sheet/tnht-sheet.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SharedModule } from "../../../shared/shared.module";
import { IconComponent } from "src/app/components/icon/icon.component";

@Component({
  selector: 'app-editor',
  imports: [
    MatSidenavModule,
    MatListModule,
    RichTextEditorComponent,
    ChildHeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    SharedModule
],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editorComponent') editorComponent!: RichTextEditorComponent;
  editorContent: string = '';
  extractedFields: any[] = [];
  deltaJson: string = '';
  title: string = '';
  key: string = '';
  path: string = '';

  constructor(
    private docsService: DocsService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private tnhtSheetService: TnhtSheetService,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // Use setTimeout to ensure change detection doesn't throw an error
    this.route.params.subscribe((params) => {
      this.key = params['id'];
      if (this.key !== 'new') {
        if (this.key) {
          this.path = `/assets/${this.key.replace(/__/g, '/')}.json`;
        } else {
          console.error('No path provided in route parameters.');
        }
      }
    });
    this.fetchTnht();
    this.cd.detectChanges(); // Trigger change detection manually
  }

  /**
   * Check if the document has a mergeSource and fetch the source document if needed
   */
  checkForMergeSource(deltaContent: any): void {
    // Check if there is a mergeSource defined in the delta data
    if (deltaContent?.data?.mergeSource) {
      const mergeSource = deltaContent.data.mergeSource;
      console.log('Found mergeSource reference:', mergeSource);
      
      if (mergeSource.documentId && mergeSource.mergeTargetKey) {
        // Construct the path to the source document
        const sourcePath = `/assets/${mergeSource.documentId.replace(/__/g, '/')}.json`;
        
        // Fetch the source document
        this.fetchMergeSourceDocument(sourcePath, mergeSource.mergeTargetKey, deltaContent);
      } else {
        console.error('Invalid mergeSource reference:', mergeSource);
      }
    }
  }

  /**
   * Fetch a document referenced by mergeSource and merge its content
   */
  fetchMergeSourceDocument(sourcePath: string, targetKey: string, currentDelta: any): void {
    console.log(`Fetching merge source document: ${sourcePath} with target key: ${targetKey}`);
    
    this.docsService.getDocsContent(sourcePath).subscribe({
      next: (sourceDoc: any) => {
        console.log('Retrieved merge source document:', sourceDoc);
        
        // Find the merge target content in the source document
        this.mergeDeltaContent(sourceDoc, targetKey, currentDelta);
      },
      error: (err: any) => {
        console.error(`Error fetching merge source document: ${sourcePath}`, err);
      }
    });
  }
  /**
   * Merge content from source document into current document
   */
  mergeDeltaContent(sourceDoc: any, targetKey: string, currentDelta: any): void {
    try {
      if (!sourceDoc || !sourceDoc.ops) {
        console.warn('Source document is missing or has no ops');
        return;
      }

      // Get the source document ID for marking content origin
      const sourceDocId = sourceDoc.data?.key || 'merge-source';
      
      // First, add source-id to all source document ops for identification
      const sourceOpsWithId = sourceDoc.ops.map((op: any) => {
        // Create a deep copy to avoid modifying the original
        const opCopy = JSON.parse(JSON.stringify(op));
        
        // Add source-id to attributes to mark this as coming from the source document
        if (!opCopy.attributes) opCopy.attributes = {};
        opCopy.attributes['source-id'] = sourceDocId;
        opCopy.attributes['merge-source'] = true;
        
        return opCopy;
      });
      
      // Find the merge target block in the source document
      const sourceIndex = sourceOpsWithId.findIndex(
        (op: any) => op?.attributes?.mergeTarget && 
                     op?.attributes?.mergeTarget?.key === targetKey
      );
      
      if (sourceIndex !== -1) {
        console.log(`Found merge target with key ${targetKey} at index ${sourceIndex}`);
        
        // Split the source document into sections (before target, target, after target)
        const beforeTarget = sourceOpsWithId.slice(0, sourceIndex);
        const targetBlock = sourceOpsWithId[sourceIndex];
        
        // Find the next merge target or end of document
        let nextTargetIndex = sourceDoc.ops.length;
        for (let i = sourceIndex + 1; i < sourceOpsWithId.length; i++) {
          if (sourceOpsWithId[i]?.attributes?.mergeTarget) {
            nextTargetIndex = i;
            break;
          }
        }
        
        // Get content after the target block up to the next target or end
        const afterTarget = sourceOpsWithId.slice(sourceIndex + 1, nextTargetIndex);
        
        // Mark the current document ops as belonging to the target document
        const targetOpsWithId = currentDelta.ops.map((op: any) => {
          const opCopy = JSON.parse(JSON.stringify(op));
          if (!opCopy.attributes) opCopy.attributes = {};
          opCopy.attributes['target-id'] = currentDelta.data?.key || 'target-doc';
          return opCopy;
        });
        
        // Create the properly merged document:
        // 1. First part of source document (up to merge target)
        // 2. The merge target block itself (for visual identification)
        // 3. The target document content (replacing the merge target content)
        // 4. Rest of source document after the replaced section
        const combinedOps = [
          ...beforeTarget,
          // targetBlock,  // Target block for reference
          ...targetOpsWithId,
          ...afterTarget
        ];
        
        // Update the editor with the merged content
        this.updateEditorWithMergedContent(currentDelta, combinedOps, sourceDocId);
      } else {
        console.warn(`No merge target found with key ${targetKey} in source document`);
      }
    } catch (e) {
      console.error('Error merging delta content:', e);
    }
  }

  /**
   * Update the editor with merged content
   */
  updateEditorWithMergedContent(currentDelta: any, combinedOps: any[], sourceDocId?: string): void {
    if (!this.editorComponent?.quillEditorRef) {
      console.error('Editor reference not available');
      return;
    }
    
    try {
      // Create an updated delta with the combined operations
      const updatedDelta = {
        ...currentDelta,
        ops: combinedOps
      };

      // Store sourceDocId if available
      if (sourceDocId) {
        if (!updatedDelta.data) updatedDelta.data = {};
        updatedDelta.data.mergeSourceId = sourceDocId;
      }
      
      console.log('Updated delta with merged content:', updatedDelta);
      
      // Update the editor with the new delta
      this.editorComponent.quillEditorRef.setContents(updatedDelta);
      
      // Update the deltaJson to reflect the changes
      this.deltaJson = JSON.stringify(updatedDelta, null, 2);
      
      // Notify the rich text editor component that content has merge source
      if (this.editorComponent) {
        this.editorComponent.hasMergeSource = true;
      }
      
      console.log('Editor updated with merged content');
    } catch (e) {
      console.error('Error updating editor with merged content:', e);
    }
  }

  /**
   * Check if the document has a mergeSource and fetch the source document if needed
   */
  handleMergeSource(delta: any): void {
    // Check if there is a mergeSource defined in the delta data
    if (delta?.data?.mergeSource) {
      const mergeSource = delta.data.mergeSource;
      console.log('Found mergeSource reference:', mergeSource);
      
      if (mergeSource.documentId && mergeSource.mergeTargetKey) {
        // Construct the path to the source document
        const sourcePath = `/assets/${mergeSource.documentId.replace(/__/g, '/')}.json`;
        
        // Fetch the source document
        this.docsService.getDocsContent(sourcePath).subscribe({
          next: (sourceDoc: any) => {
            console.log('Retrieved merge source document:', sourceDoc);
            
            // Find the merge target in the source document
            if (sourceDoc && sourceDoc.ops) {
              // Find the merge target blocks in the source document
              const mergeTargetOp = sourceDoc.ops.find(
                (op: any) => op?.attributes?.mergeTarget && 
                op?.attributes?.mergeTarget?.key === mergeSource.mergeTargetKey
              );
              
              if (mergeTargetOp) {
                console.log(`Found merge target with key ${mergeSource.mergeTargetKey}:`, mergeTargetOp);
                
                // Get the index of the merge target block
                const sourceIndex = sourceDoc.ops.findIndex(
                  (op: any) => op?.attributes?.mergeTarget && 
                  op?.attributes?.mergeTarget?.key === mergeSource.mergeTargetKey
                );
                
                if (sourceIndex !== -1 && sourceIndex < sourceDoc.ops.length - 1) {
                  // Find where to end extraction - either at next merge target or end of document
                  let endIndex = sourceDoc.ops.length;
                  for (let i = sourceIndex + 1; i < sourceDoc.ops.length; i++) {
                    if (sourceDoc.ops[i]?.attributes?.mergeTarget) {
                      endIndex = i;
                      break;
                    }
                  }
                  
                  // Extract the content to merge
                  const contentToMerge = sourceDoc.ops.slice(sourceIndex + 1, endIndex);
                  console.log('Content to merge:', contentToMerge);
                  
                  // Create a new delta that includes both the original content and the merged content
                  const updatedDelta = {
                    ...delta,
                    ops: [...delta.ops, ...contentToMerge]
                  };
                  
                  console.log('Updated delta with merged content:', updatedDelta);
                  
                  // Update the deltaJson to reflect the merged content
                  this.deltaJson = JSON.stringify(updatedDelta, null, 2);
                  
                  // Initialize the editor with the merged delta
                  if (this.editorComponent?.quillEditorRef) {
                    try {
                      this.editorComponent.quillEditorRef.setContents(updatedDelta);
                      console.log('Editor updated with merged content');
                    } catch (e) {
                      console.error('Error setting editor contents with merged content:', e);
                    }
                  }
                }
              } else {
                console.warn(`No merge target found with key ${mergeSource.mergeTargetKey} in source document`);
              }
            }
          },
          error: (err: any) => {
            console.error(`Error fetching merge source document: ${sourcePath}`, err);
          }
        });
      } else {
        console.warn('Invalid mergeSource reference:', mergeSource);
      }
    }
  }

  getContentPath() {
    if (this.key !== 'new') {
      const foundContent = this.data.filter(
        (item: any) => item.key === this.key
      )[this.data.filter((item: any) => item.key === this.key)?.length - 1];
      if (foundContent) {
        this.deltaJson = foundContent?.delta;

        // Initialize the editor with the delta data directly
        setTimeout(() => {
          if (this.editorComponent?.quillEditorRef) {
            try {
              if (typeof JSON.parse(foundContent?.delta) !== 'string') {
                const parsedDelta = JSON.parse(foundContent?.delta);

                // Extract title from data if it exists
                if (parsedDelta?.data?.title) {
                  this.title = parsedDelta.data.title;
                }

                this.editorComponent.quillEditorRef.setContents(parsedDelta);
                console.log('Online data', parsedDelta);
                this.checkForMergeSource(parsedDelta);
              } else {
                console.log('Fetching offline data');
                this.getDocsContent(this.path);
              }
            } catch (e) {
              console.error('Error setting editor contents:', e);
            }
          }
        }, 100);
      } else {
        this.getDocsContent(this.path);
      }
    } else {
      this.docsService.getDocsContent(this.path).subscribe((res: any) => {
        this.deltaJson = JSON.stringify(res, null, 2);

        // Extract title from data if it exists
        if (res?.data?.title) {
          this.title = res.data.title;
        }

        setTimeout(() => {
          if (this.editorComponent?.quillEditorRef) {
            try {
              this.editorComponent.quillEditorRef.setContents(res);
              this.checkForMergeSource(res);
            } catch (e) {
              console.error('Error setting editor contents:', e);
            }
          }
        }, 100);
      });
    }
  }
  getDocsContent(path: string) {
    this.docsService.getDocsContent(path).subscribe({
      next: (res: any) => {
        // Store the raw delta data
        this.deltaJson = JSON.stringify(res, null, 2);

        // Extract title from data if it exists
        if (res?.data?.title) {
          this.title = res.data.title;
        }

        // Initialize the editor with the delta data directly
        setTimeout(() => {
          if (this.editorComponent?.quillEditorRef) {
            try {
              this.editorComponent.quillEditorRef.setContents(res);
              console.log('Offline data', res);
              this.checkForMergeSource(res);
            } catch (e) {
              console.error('Error setting editor contents:', e);
            }
          }
        }, 100);
      },
      error: (err: any) => {
        console.error('Error fetching document content:', err);
      },
    });
  }
  onContentChanged(content: string, editorRef?: RichTextEditorComponent): void {
    // Update the live preview content whenever the editor content changes
    this.editorContent = content;

    // Update the Delta JSON representation if we have a reference to the editor
    if (editorRef?.quillEditorRef) {
      // Get standard delta contents
      const delta = editorRef.quillEditorRef.getContents();

      // Get complete content with values including the audioSrc at root level
      const completeContent = editorRef.getContentWithValues();

      // Add title to the data object within the delta
      if (!completeContent.delta.data) {
        completeContent.delta.data = {};
      }
      completeContent.delta.data.title = this.title;
      completeContent.delta.data.key = this.commonService.generatedSlug(
        this.title
      );

      // Make sure we preserve any existing mergeSource that might not be in completeContent but is in the delta
      try {
        const currentDelta = JSON.parse(this.deltaJson || '{}');
        
        // Preserve mergeSource in data object
        if (
          currentDelta.data?.mergeSource &&
          !(completeContent.delta.data as any).mergeSource
        ) {
          (completeContent.delta.data as any).mergeSource =
            currentDelta.data.mergeSource;
        }
        
        // Preserve merge-source attributes in operations
        if (currentDelta.ops && completeContent.delta.ops) {
          // Create lookup map for ops with merge-source attribute in current delta
          const mergeSourceMap = new Map();
          currentDelta.ops.forEach((op: any, index: number) => {
            if (op.attributes && op.attributes['merge-source'] === true) {
              // Use the insert value as key since position might change
              const key = op.insert ? JSON.stringify(op.insert) : `index-${index}`;
              mergeSourceMap.set(key, {
                'source-id': op.attributes['source-id'],
                'merge-source': true
              });
            }
          });
          
          // Apply merge-source attributes to matching ops in the new delta
          completeContent.delta.ops.forEach((op: any) => {
            const key = op.insert ? JSON.stringify(op.insert) : '';
            const mergeAttrs = mergeSourceMap.get(key);
            
            if (mergeAttrs) {
              // Ensure attributes object exists
              if (!op.attributes) op.attributes = {};
              
              // Apply the merge-source attributes
              op.attributes['merge-source'] = mergeAttrs['merge-source'];
              if (mergeAttrs['source-id']) {
                op.attributes['source-id'] = mergeAttrs['source-id'];
              }
            }
          });
        }
      } catch (e) {
        console.error('Error preserving mergeSource in onContentChanged:', e);
      } 
      
      // Log both to compare
      console.log('Standard Quill Delta:', delta);
      console.log(
        'Extended Delta with audioSrc, title, and mergeSource:',
        completeContent.delta
      );

      this.deltaJson = JSON.stringify(completeContent.delta, null, 2);
    }
  }
  onTitleChanged(newTitle: string): void {
    // When title changes, we need to update the deltaJson if possible
    try {
      if (this.deltaJson && this.editorComponent?.quillEditorRef) {
        // Get complete content with values including the audioSrc at root level
        // This ensures we get the most current editor state
        const completeContent = this.editorComponent.getContentWithValues();

        // Ensure data object exists
        if (!completeContent.delta.data) {
          completeContent.delta.data = {};
        }

        // Update just the title in the data object
        completeContent.delta.data.title = newTitle;

        // Update deltaJson without resetting the editor
        this.deltaJson = JSON.stringify(completeContent.delta, null, 2);

        // Log the update
        console.log('Updated title in deltaJson:', newTitle);
      }
    } catch (e) {
      console.error('Error updating title in deltaJson:', e);
    }
  }

  fetchTnht() {
    this.tnhtSheetService.fetchTnht().subscribe((res: any) => {
      if (res.status === 200) {
        this.setting = res.setting;
        this.data = res.data;
        this.getContentPath();
      }
    });
  }

  googleFormsPath: any;
  data: any;
  setting = <any>{};
  @ViewChild('saveContent') saveContent!: any;
  onSave() {
    try {
      // Try to parse the current delta JSON to check if we need to generate a key
      const parsedDelta = JSON.parse(this.deltaJson);

      // Auto-generate a key if one doesn't exist
      if (!parsedDelta.data.key && this.title) {
        // Generate a unique key based on the title
        parsedDelta.data.key = `${this.commonService.generatedSlug(
          this.title
        )}`;
        console.log(
          'Auto-generated key for new document:',
          parsedDelta.data.key
        );

        // Update the deltaJson with the new key
        this.deltaJson = JSON.stringify(parsedDelta, null, 2);
      }
    } catch (e) {
      console.error('Error processing delta JSON before save:', e);
    }

    // Continue with the normal save process
    this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`;
    this.googleFormsPath += `?${this.setting?.key}=${encodeURIComponent(
      `tnht__quyen1__${this.commonService.generatedSlug(this.title)}`
    )}`;
    this.googleFormsPath += `&${this.setting?.title}=${encodeURIComponent(
      this.title
    )}`;
    const dialogRef = this.matDialog.open(this.saveContent, {
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.googleFormsPath = '';
    });
  }

  shareBottomSheetRef: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  copyToClipboard(deltaJson: any) {
    navigator.clipboard.writeText(deltaJson);
    this._snackBar.open('Đã sao chép', 'Đóng', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
