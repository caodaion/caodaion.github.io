import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CaodaionEditorService } from 'src/app/shared/services/caodaion-editor/caodaion-editor.service';
import {MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition} from "@angular/material/legacy-snack-bar";
import {OfflineSnackbarComponent} from "../../layouts/offline-snackbar/offline-snackbar.component";

@Component({
  selector: 'cp-content-editor',
  templateUrl: './cp-content-editor.component.html',
  styleUrls: ['./cp-content-editor.component.scss'],
})
export class CaoDaiONPWAContentEditorComponent implements OnChanges, OnInit {
  @Input() renderDocument?: any;
  @Input() nestedId?: any;
  @Input() contentEditable?: boolean = true;
  @Input() nested?: boolean = false;
  @Input() isSourceContent?: boolean = false;
  pagePadding: any;
  @Input() pageSize: any;
  sourceContent: any;
  renderedDocument: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private editorService: CaodaionEditorService,
    private _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.pagePadding = {
            paddingTop: '1rem',
            paddingRight: '1rem',
            paddingBottom: '1rem',
            paddingLeft: '1rem',
          };
          this.pageSize = {
            width: 'fit-content',
            height: 'auto',
          };
        } else {
          this.pagePadding = {
            paddingTop: '2cm',
            paddingRight: '2cm',
            paddingBottom: '2cm',
            paddingLeft: '2cm',
          };
          this.pageSize = {
            width: this.pageSize?.width ? this.pageSize?.width : '210mm',
            height: this.pageSize?.height ? this.pageSize?.height : '',
          };
        }
      });
  }

  ngOnChanges(): void {
    this.renderedDocument = this.renderDocument;
    if (
      this.renderDocument?.type === 'sourceContent' &&
      !this.isSourceContent
    ) {
      this.sourceContent = this.renderDocument;
      this.onGetDocument(this.sourceContent.targetDocumentKey);
    }
  }

  insertFormControlValue(insert: any): any {
    let targetFormGroup = this.renderedDocument?.formGroup?.find(
      (group: any) => group?.key === insert?.targetFormGroupKey
    );
    let targetFormControl = targetFormGroup?.control?.find(
      (control: any) => control?.key === insert?.targetFormControlKey
    );
    let returnFormControl = {
      value: targetFormControl?.value,
      type: targetFormControl?.type,
    };

    if (insert.type === 'triggerFormControl') {
      if (targetFormControl?.type === 'formArray') {
        returnFormControl.value = targetFormControl?.value?.length;
      }
    }
    return returnFormControl;
  }

  getObjectArray(object: any): Array<any> {
    return Object.entries(object);
  }

  onGetDocument(documentKey: any): void {
    this.editorService.getJSON(documentKey).subscribe((res) => {
      this.renderedDocument = res.data;
    });
  }

  onChangeContent(event: any) {
    this.editorService.onChangeContent(event);
  }

  onTab(event: any) {
    event.preventDefault(); // prevent default behaviour, which is "blur"
    var sel = document.getSelection();
    var range = sel?.getRangeAt(0);
    var tabNodeValue = '\u0009'; // with 4 spaces: Array(4).join('\u00a0')
    var tabNode = document.createTextNode(tabNodeValue);
    range?.insertNode(tabNode);
    range?.setStartAfter(tabNode);
    range?.setEndAfter(tabNode);
  }

  // @ts-ignore
  onDeleteContent(event: any) {
    let paragraph = [
      ...new Set(event?.target?.childNodes[0]?.childNodes),
    ]?.filter((node: any) => node?.nodeName === 'P');
    if (paragraph.length === 1) {
      let lastParagraph = paragraph[0];
      // @ts-ignore
      if (lastParagraph.childNodes.length === 1) {
        // @ts-ignore
        if (lastParagraph.childNodes[0].nodeName === 'BR') {
          return false;
        }
      }
    }
  }

  clickTargetLink(item: any, copy?: boolean) {
    if (item?.attrs?.hash && item?.attrs?.pathname) {
      const unTargetContent = new Array(document.getElementsByClassName('targetLink'))[0]
      for (let i = 0; i <= unTargetContent.length; i++) {
        unTargetContent[i]?.setAttribute('style', 'color: unset')
      }
      const targetContent = document.getElementById(`${item?.attrs?.pathname.replaceAll('/','').replaceAll('-','')}${item?.attrs?.hash}`)
      // @ts-ignore
      targetContent.style.color = '#4285f4';
      location.hash = item?.attrs?.hash
      if (copy) {
        navigator.clipboard.writeText(`${location.origin}${item?.attrs?.pathname}${item?.attrs?.hash}`)
        this._snackBar.open('Đã sao chép liên kết đến đoạn kinh này', 'Đóng', {
          duration: this.durationInSeconds * 200,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }
  }
}
