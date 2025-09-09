import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  host: {
    '[style.width]': 'size',
    '[style.height]': 'size',
    '[style.display]': "'inline-block'"
  }
})
export class IconComponent implements AfterViewInit {
  @Input() name: string = '';
  @Input() size: string = '24px';
  @ViewChild('showingIcon') showingIcon: any;
  constructor() {}
  ngAfterViewInit() {
    if (this.showingIcon) {
      this.showingIcon.nativeElement.style.height = this.size;
      this.showingIcon.nativeElement.style.width = this.size;
    }
  }
}
