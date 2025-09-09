import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {Component, OnInit, Input, EventEmitter, Output, OnChanges, AfterViewChecked} from '@angular/core';
import { CaodaionEditorService } from 'src/app/shared/services/caodaion-editor/caodaion-editor.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'caodaion-editor',
    templateUrl: './caodaion-editor.component.html',
    styleUrls: ['./caodaion-editor.component.scss'],
    standalone: false
})
export class CaodaionEditorComponent implements OnInit {
  @Input() renderDocument: any;
  @Input() formControlLabel: any;
  @Input() pageSize: any;
  @Input() contentEditable: boolean = true;
  @Output() onSaveContent = new EventEmitter();
  @Output() changeTrigerFormArray = new EventEmitter();
  isShowContronller: boolean = false;
  editorControllerBottomSheetRef: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private _bottomSheet: MatBottomSheet,
    private editorService: CaodaionEditorService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.renderDocument);
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.isShowContronller = !state.matches;
      });
  }

  onSave() {
    this.onSaveContent.emit(
      this.editorService.onSaveDocument(this.renderDocument)
    );
  }

  openBottomSheet(bottomSheet: any): void {
    this.editorControllerBottomSheetRef = this._bottomSheet.open(bottomSheet);
  }

  onPrint() {
    let printTab = window.open(
      '',
      'PRINT',
      `width=${window.innerWidth},height=${window.innerHeight}`
    );
    printTab?.document.write(
      '<html><head><title>' + document.title.toUpperCase() + ' PRINTER</title>'
    );
    printTab?.document.write('</head><body >');
    const printContent = document.getElementById(
      `${this.renderDocument?.key}-CONTENT`
    );
    const writeContent = document.createElement('DIV');
    if (writeContent) {
      // @ts-ignore
      writeContent.innerHTML = printContent?.outerHTML;
      // @ts-ignore
      writeContent.childNodes[0].style.padding = 0;
    }
    printTab?.document.write(writeContent?.outerHTML);
    printTab?.document.write('</body></html>');
    printTab?.document.close(); // necessary for IE >= 10
    printTab?.focus(); // necessary for IE >= 10*/
    printTab?.print();
  }
  onChangeTrigerFormArray(event: any) {
    this.changeTrigerFormArray.emit(event);
  }

  onBack() {
    this.location.back()
  }
}
