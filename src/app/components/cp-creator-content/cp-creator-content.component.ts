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
  @Input() rootContent: any;
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
          let studyStorage = JSON.parse(localStorage.getItem('reading') || '[]')
          if (!studyStorage) {
            studyStorage = []
          }
          let foundItem = studyStorage.find((item: any) => item.key == this.rootContent.key)
          if (foundItem) {
            foundItem.stopAt = this.data.content[0].content[0]?.text
            foundItem.content = this.data.key
            foundItem.location = `${location.origin}${this.data?.attrs?.pathname}${this.data?.attrs?.hash}`
          } else {
            studyStorage.push({
              content: this.data.key,
              stopAt: this.data.content[0]?.text,
              key: this.rootContent.key,
              location: `${location.origin}${this.data?.attrs?.pathname}${this.data?.attrs?.hash}`,
            })
          }
          localStorage.setItem('reading', JSON.stringify(studyStorage))
        }
        this.contentToContent.emit(this.data)
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
                if (node.nodeName == `SPAN` && node.classList.contains('knoll')) {
                  const textContent = [...node.childNodes].find((n: any) => n.classList.contains('knoll-content'))?.textContent
                  find(this.data.content, item.id).content.push({
                    type: 'text',
                    text: textContent,
                    attrs: {
                      color: '#FF992B',
                      textDecoration: 'underline',
                      knoll: true
                    }
                  })
                }
              })
              item.innerHTML = find(this.data.content, item.id).content
              .map((text: any) => text?.attrs?.knoll ? `<span style="color: #FF992B; position: relative; text-decoration: underline" class="knoll"><span class="stading-bell-icon" style="position: absolute; height: 15px; right: 100%; bottom: 100%; transform: translate(5px, 5px);"><svg width="15px" height="15px" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10C3 8.89543 3.89543 8 5 8H51C52.1046 8 53 8.89543 53 10V23C53 36.8071 41.8071 48 28 48V48C14.1929 48 3 36.8071 3 23V10Z" fill="#FF992B"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1182 8H14.8819L46.5937 39.7118C46.0001 40.3719 45.3719 41.0001 44.7119 41.5937L11.1182 8ZM9.37695 8H10.1485L44.1947 42.0462C44.0556 42.1645 43.9153 42.2814 43.7737 42.3967L9.37695 8ZM47.0462 39.1947L15.8516 8H28.3848L51.614 31.2292C50.5879 34.1741 49.0264 36.8681 47.0462 39.1947Z" fill="#B87333"></path>
              <rect x="27" y="53" width="2" height="16" rx="1" transform="rotate(-90 27 53)" fill="#A82300"></rect>
              <rect x="26" y="55" width="6" height="6" rx="3" transform="rotate(-90 26 55)" fill="#A82300"></rect>
              <rect x="13" y="56" width="8" height="16" rx="1" transform="rotate(-90 13 56)" fill="#FFD700"></rect>
              <rect x="41" y="54" width="4" height="2" rx="1" transform="rotate(-90 41 54)" fill="#A82300"></rect>
              </svg></span><span class="knoll-content">${text.text}</span></span>` : text?.attrs?.fontWeight === 'bold' ? `<b>${text.text}</b>` : text.text).join('')
              this.updated = false
            }
          }
        }
      })
    }
  }
}
