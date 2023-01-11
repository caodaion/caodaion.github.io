import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition,
  MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition
} from "@angular/material/legacy-snack-bar";
import { AuthService } from "../../shared/services/auth/auth.service";

@Component({
  selector: 'cp-creator-content',
  templateUrl: './cp-creator-content.component.html',
  styleUrls: ['./cp-creator-content.component.scss']
})
export class CpCreatorContentComponent implements OnChanges {
  @Input() data: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @Output() focusedBlock = new EventEmitter()
  @Output() contentToContent = new EventEmitter()
  updated: boolean = false

  @HostListener('document:click', ['$event'])
  click(event: any) {
    if (this.eRef.nativeElement.contains(event.target)) {
      if (this.authService.contentEditable) {
        this.data.focused = true
      } else {
        if (this.data.attrs.pathname && this.data.attrs.hash) {
          this.eRef.nativeElement.style.color = '#4285f4';
          this.contentToContent.emit(this.data)
        }
      }
    } else {
      this.eRef.nativeElement.style.color = 'unset';
      this.data.focused = false
      this.focusedBlock.emit(this.data)
    }
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onKeyControlS(event: any) {
    event.preventDefault()
    this.onBlur(event)
  }

  @HostListener('document:keydown.control.enter')
  onKeyControlEnterDown() {
    this.data.focused = false
  }

  constructor(private _snackBar: MatSnackBar, private eRef: ElementRef, public authService: AuthService) {
  }

  ngOnChanges() {
    if (!this.data.content || this.data.content.length == 0) {
      if (this.data.type == 'contentBlock') {
        this.data.content = [
          {
            key: `${this.data.key}p0`,
            type: 'paragraph',
            content: [
              {
                "type": "text",
                "text": "\n"
              }
            ]
          }
        ]
      }
    }
  }

  getLink(data: any) {
    if (data?.attrs?.pathname && data?.attrs?.hash) {
      navigator.clipboard.writeText(`${location.origin}${data?.attrs?.pathname}${data?.attrs?.hash}`)
      this._snackBar.open('Đã sao chép liên kết đến đoạn kinh này', 'Đóng', {
        duration: this.durationInSeconds * 200,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onTab(event: any) {
    event.preventDefault(); // prevent default behaviour, which is "blur"
    const sel = document.getSelection();
    const range = sel?.getRangeAt(0);
    const tabNodeValue = '\u0009'; // with 4 spaces: Array(4).join('\u00a0')
    const tabNode = document.createTextNode(tabNodeValue);
    range?.insertNode(tabNode);
    range?.setStartAfter(tabNode);
    range?.setEndAfter(tabNode);
  }

  onEnter(event: any) {
    document.execCommand('insertLineBreak')
    event.preventDefault()
    // event.preventDefault(); // prevent default behaviour, which is "blur"
    // const sel = document.getSelection();
    // const range = sel?.getRangeAt(0);
    // const enterNodeValue = '\n'; // with 4 spaces: Array(4).join('\u00a0')
    // const enterNode = document.createTextNode(enterNodeValue);
    // range?.insertNode(enterNode);
    // range?.setStartAfter(enterNode);
    // range?.setEndAfter(enterNode);
  }

  onBlur(event: any) {
    if (this.updated) {
      [...event?.target?.children]?.forEach((item: any) => {
        const find = (array: any, key: any) => {
          let result: any;
          array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
          return result;
        }
        if (find(this.data.content, item.id)) {
          find(this.data.content, item.id).content = []
          if (!item.children || item.children.length == 0) {
            find(this.data.content, item.id).content.push({
              type: 'text',
              text: item.innerText
            })
            item.innerHTML = item.innerText
            this.updated = false
          } else {
            if (item.childNodes && item.childNodes.length > 0) {
              [...item.childNodes]?.filter((node: any) => node?.nodeName !== '#comment')?.forEach((node: any) => {
                if (node.nodeName == `#text`) {
                  find(this.data.content, item.id).content.push({
                    type: 'text',
                    text: node.data
                  })
                }
                if (node.nodeName == `B` || node.nodeName == `STRONG`) {
                  find(this.data.content, item.id).content.push({
                    type: 'text',
                    text: node.innerHTML,
                    attrs: {
                      fontWeight: 'bold'
                    }
                  })
                }
              })
              item.innerHTML = find(this.data.content, item.id).content.map((text: any) => text?.attrs?.fontWeight === 'bold' ? `<b>${text.text}</b>` : text.text).join('')
              this.updated = false
            }
          }
        }
      })
    }
  }
}
