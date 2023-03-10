import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cp-creator-block-toolbar',
  templateUrl: './cp-creator-block-toolbar.component.html',
  styleUrls: ['./cp-creator-block-toolbar.component.scss']
})
export class CpCreatorBlockToolbarComponent implements OnInit {
  @Input() data: any;
  isShowSetting: boolean = false;
  isShowAudioTimeStamp: boolean = false
  textAlign: any = 'justify'

  ngOnInit() {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
      return result;
    }
    // console.log(this.data)
    const sel = document.getSelection();
    if (this.data.type == 'contentBlock' && sel) {
      // @ts-ignore
      const initStyle = find(this.data.content, sel?.focusNode?.parentNode?.id)
      if (initStyle?.attrs) {
        this.textAlign = initStyle.attrs.textAlign || 'justify'
      }
    }
  }

  formatContent(attrs: any) {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
      return result;
    }
    // const sel = document.getSelection();
    // const range = sel?.getRangeAt(0);
    // let nodeValue = ''
    // if (attrs.fontWeight == 'bold') {
    //   nodeValue = 'STRONG'
    // }
    // const find = (array: any, key: any) => {
    //   let result: any;
    //   array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
    //   return result;
    // }
    // let updatedNode = document.createElement(nodeValue);
    // // @ts-ignore
    // updatedNode.innerText = sel.toString();
    // range?.deleteContents();
    // range?.insertNode(updatedNode);
    //
    // // @ts-ignore
    // [...sel.focusNode.parentElement.childNodes]?.forEach((item: any) => {
    //   const find = (array: any, key: any) => {
    //     let result: any;
    //     array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
    //     return result;
    //   }
    //   if (find(this.data.content, item.id)) {
    //     find(this.data.content, item.id).content = []
    //     if (!item.children || item.children.length == 0) {
    //       find(this.data.content, item.id).content.push({
    //         type: 'text',
    //         text: item.innerText
    //       })
    //       item.innerHTML = item.innerText
    //     } else {
    //       if (item.childNodes && item.childNodes.length > 0) {
    //         [...item.childNodes]?.filter((node: any) => node?.nodeName !== '#comment')?.forEach((node: any) => {
    //           if (node.nodeName == `#text`) {
    //             find(this.data.content, item.id).content.push({
    //               type: 'text',
    //               text: node.data
    //             })
    //           }
    //           if (node.nodeName == `B` || node.nodeName == `STRONG`) {
    //             find(this.data.content, item.id).content.push({
    //               type: 'text',
    //               text: node.innerHTML,
    //               attrs: {
    //                 fontWeight: 'bold'
    //               }
    //             })
    //           }
    //         })
    //         item.innerHTML = find(this.data.content, item.id).content.map((text: any) => text?.attrs?.fontWeight === 'bold' ? `<b>${text.text}</b>` : text.text).join('')
    //       }
    //     }
    //   }
    // })
    if (attrs.fontWeight == 'bold') {
      document.execCommand('bold')
    }
    if (attrs.textAlign) {
      const sel = document.getSelection();
      if (this.data.type == 'contentBlock' && sel) {
        // @ts-ignore
        if (sel.focusNode?.parentNode && find(this.data.content, sel?.focusNode?.parentNode?.id)) {
          // @ts-ignore
          if (!find(this.data.content, sel?.focusNode?.parentNode?.id).attrs) {
            // @ts-ignore
            find(this.data.content, sel?.focusNode?.parentNode?.id).attrs = {}
          }
          // @ts-ignore
          find(this.data.content, sel?.focusNode?.parentNode?.id).attrs.textAlign = attrs.textAlign
          // @ts-ignore
          const targetedContent = document.getElementById(sel?.focusNode?.parentNode?.id)
          // @ts-ignore
          targetedContent.style.textAlign = attrs.textAlign || 'justify'
        }
      }
    }
  }

  addKnollContent() {
    const sel = document.getSelection();
    const range = sel?.getRangeAt(0);
    let nodeValue = 'SPAN'
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
      return result;
    }
    let updatedNode = document.createElement(nodeValue);
    let stadingBellIcon = document.createElement('SPAN');
    stadingBellIcon.innerHTML = `<svg width="15px" height="15px" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10C3 8.89543 3.89543 8 5 8H51C52.1046 8 53 8.89543 53 10V23C53 36.8071 41.8071 48 28 48V48C14.1929 48 3 36.8071 3 23V10Z" fill="#FF992B"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1182 8H14.8819L46.5937 39.7118C46.0001 40.3719 45.3719 41.0001 44.7119 41.5937L11.1182 8ZM9.37695 8H10.1485L44.1947 42.0462C44.0556 42.1645 43.9153 42.2814 43.7737 42.3967L9.37695 8ZM47.0462 39.1947L15.8516 8H28.3848L51.614 31.2292C50.5879 34.1741 49.0264 36.8681 47.0462 39.1947Z" fill="#B87333"/>
    <rect x="27" y="53" width="2" height="16" rx="1" transform="rotate(-90 27 53)" fill="#A82300"/>
    <rect x="26" y="55" width="6" height="6" rx="3" transform="rotate(-90 26 55)" fill="#A82300"/>
    <rect x="13" y="56" width="8" height="16" rx="1" transform="rotate(-90 13 56)" fill="#FFD700"/>
    <rect x="41" y="54" width="4" height="2" rx="1" transform="rotate(-90 41 54)" fill="#A82300"/>
    </svg>`
    stadingBellIcon.classList.add('stading-bell-icon');
    stadingBellIcon.style.position = 'absolute'
    stadingBellIcon.style.height = '15px'
    stadingBellIcon.style.right = '100%'
    stadingBellIcon.style.bottom = '100%'
    stadingBellIcon.style.transform = 'translate(5px, 5px)'
    updatedNode.innerHTML = `${stadingBellIcon.outerHTML}<span class="knoll-content">${sel?.toString()}</span>`;
    updatedNode.classList.add('knoll')
    updatedNode.style.color = '#FF992B'
    updatedNode.style.position = 'relative'
    updatedNode.style.textDecoration = 'underline'
    range?.deleteContents();
    range?.insertNode(updatedNode);
    document.body.focus()
  }

  changeKey(event: any) {
    this.data.key = event.target.value
  }

  changeHash(event: any) {
    this.data.attrs.hash = event.target.value
  }

  showAudioTimeStamp() {
    if (!this.data.audio) {
      this.data.audio = {
        start: '',
        end: ''
      }
    }
    this.isShowAudioTimeStamp = !this.isShowAudioTimeStamp
  }

  changetime(event: any, field: any) {
    console.log(event);
    console.log(field);

    console.log(this.data.audio);

  }
}
