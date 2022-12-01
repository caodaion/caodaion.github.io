import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {AuthService} from "../../shared/services/auth/auth.service";

@Component({
  selector: 'cp-content-creator',
  templateUrl: './cp-content-creator.component.html',
  styleUrls: ['./cp-content-creator.component.scss']
})
export class CpContentCreatorComponent implements OnChanges {
  @Input() data: any;
  @Output() save = new EventEmitter();
  isShowController: boolean = false;
  focusedBlock: any;

  constructor(
    private breakpointObserver: BreakpointObserver, private authService: AuthService) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.isShowController = !state.matches && this.authService.contentEditable;
      });
  }


  ngOnChanges() {
    if (!this.data.content || this.data.content.length == 0) {
      if (this.data.type == 'block') {
        this.data.content = [
          {
            // @ts-ignore
            key: `${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${(this.data.content.length - 1) || 0}`,
            attrs: {
              pathname: location.pathname,
              hash: `#${this.data.content.length - 1}`
            },
            type: 'contentBlock'
          }
        ]
      }
    }
    if (!this.data.key) {
      this.data.content = [
        {
          // @ts-ignore
          key: `${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${(this.data.content?.length - 1) || 0}`,
          attrs: {
            pathname: location.pathname,
            hash: `#${(this.data.content?.length - 1) || 0}`
          },
          type: 'contentBlock'
        }
      ]
    }
  }

  getId(block: any) {
    return block.key.replaceAll('-', '')
  }

  saveData() {
    this.save.emit()
  }
}
