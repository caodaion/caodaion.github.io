import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cp-markdown',
  templateUrl: './cp-markdown.component.html',
  styleUrls: ['./cp-markdown.component.scss']
})
export class CpMarkdownComponent {
  @Input() data?: any;
  @Input() classes?: any;
  @Input() id?: any = '';
}
