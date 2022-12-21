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
