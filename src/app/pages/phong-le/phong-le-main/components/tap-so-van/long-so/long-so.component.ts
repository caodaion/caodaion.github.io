import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-long-so',
  templateUrl: './long-so.component.html',
  styleUrls: ['./long-so.component.scss']
})
export class LongSoComponent {

  @Input() longSo: any;
}
