import { Component, OnInit } from '@angular/core';
import { CaodaionEditorService } from 'src/app/shared/services/caodaion-editor/caodaion-editor.service';

interface Food {
  value: string;
  viewValue: string;
}
@Component({
    selector: 'cp-toolbar-editor',
    templateUrl: './cp-toolbar-editor.component.html',
    styleUrls: ['./cp-toolbar-editor.component.scss'],
    standalone: false
})
export class CpToolbarEditorComponent implements OnInit {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  colors: any[] = [
    { name: 'đen', value: 'black' },
    { name: 'trắng', value: 'white' },
    { name: 'đỏ', value: 'red' },
    { name: 'xanh dương', value: 'blue' },
    { name: 'vàng', value: 'yellow' },
    { name: 'xanh lá', value: 'green' },
    { name: 'tím', value: 'purple' },
    { name: 'xám', value: 'gray' },
    { name: 'cam', value: 'orange' },
  ];

  constructor(private editorService: CaodaionEditorService) {}

  ngOnInit(): void {}

  onChangeStyle(attrs: any) {
    this.editorService.onChangeStyle(attrs);
  }
}
