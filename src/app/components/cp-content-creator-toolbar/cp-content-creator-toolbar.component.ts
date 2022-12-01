import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'cp-content-creator-toolbar',
  templateUrl: './cp-content-creator-toolbar.component.html',
  styleUrls: ['./cp-content-creator-toolbar.component.scss']
})
export class CpContentCreatorToolbarComponent implements OnInit {
  @Input() data: any;
  @Input() focusedBlock: any;
  @Output() save = new EventEmitter();

  ngOnInit(): void {
    console.log(this.data)
    // @ts-ignore
    if (this.data == {}) {
      this.data = {
        name: '',
        key: ''
      }
    }
  }

  saveData() {
    this.save.emit()
  }

  addNewContentBlock() {
    if (this.focusedBlock?.type == 'contentBlock') {
      const find = (array: any, key: any) => {
        let result: any;
        array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
        return result;
      }
      this.data.content.push({
          // @ts-ignore
          key: `${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${this.data.content.length || 0}`,
          attrs: {
            pathname: location.pathname,
            hash: `#${this.data.content.length}`
          },
          type: 'contentBlock'
        })
    }
    if (this.focusedBlock?.type == 'block') {
      this.focusedBlock.content.push({
        // @ts-ignore
        key: `${(location.pathname + this.focusedBlock.attrs.hash).slice(1, (location.pathname + this.focusedBlock.attrs.hash).length).split('/').slice(1).join('-').replaceAll('-', '')}${this.focusedBlock.content.length || 0}`,
        attrs: {
          pathname: location.pathname + this.focusedBlock.attrs.hash,
          hash: `#${this.focusedBlock.content.length || 0}`
        },
        type: 'contentBlock'
      })
    }
  }

  addNewBlock() {
    if (!this.data.content || this.data.content.length == 0) {
      this.data.content = []
    }
    if (this.focusedBlock.type == 'block') {

      this.data.content.push({
        // @ts-ignore
        key: `${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}b${this.data.content.length || 0}`,
        attrs: {
          pathname: location.pathname,
          hash: `/b${this.data.content.length}`
        },
        content: [
          {
            // @ts-ignore
            key: `${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}b${this.data.content.length || 0}`,
            attrs: {
              pathname: `${location.pathname}/b${this.data.content.length}`,
              hash: `#0`
            },
            type: 'contentBlock'
          }
        ],
        type: 'block'
      })
    }
  }
}
