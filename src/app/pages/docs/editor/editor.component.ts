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
    SharedModule
],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editorComponent') editorComponent!: RichTextEditorComponent;
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


  getContentPath() {
    if (this.key !== 'new') {
      const foundContent = this.data.filter(
        (item: any) => item.key === this.key
      )[this.data.filter((item: any) => item.key === this.key)?.length - 1];
      if (foundContent) {
        this.deltaJson = foundContent?.delta;

        // Let rich-text-editor handle the merge via deltaJson input binding
        // Don't call setContents directly as it bypasses merge logic
        try {
          const parsedDelta = JSON.parse(foundContent?.delta);
          
          // Extract title from data if it exists
          if (parsedDelta?.data?.title) {
            this.title = parsedDelta.data.title;
          }
        } catch (e) {
          console.log('Fetching offline data');
          this.getDocsContent(this.path);
        }
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

        // Let rich-text-editor handle the merge via deltaJson input binding
        // Don't call setContents directly as it bypasses merge logic
        console.log('Document loaded, rich-text-editor will handle merge:', res);
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
      },
      error: (err: any) => {
        console.error('Error fetching document content:', err);
      },
    });
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

  data: any;
  setting = <any>{};
  
  onSave() {
    // Save is now handled entirely in rich-text-editor component
    // This method can be kept for backward compatibility or removed if not needed
  }
}
