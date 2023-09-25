import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import { AuthService } from "../../shared/services/auth/auth.service";
import { CommonService } from 'src/app/shared/services/common/common.service';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'cp-creator-content',
  templateUrl: './cp-creator-content.component.html',
  styleUrls: ['./cp-creator-content.component.scss']
})
export class CpCreatorContentComponent implements OnChanges {
  @Input() data: any;
  @Input() rootContent: any;
  @Input() contentEditable: boolean = false;
  @Input() isShowFontSizeSelect: boolean = true;
  @Input() contentFormat = <any>{};
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  provinces = <any>[];
  districts = <any>[];
  filteredDistricts = <any>[];
  calculatedTuanCuu = <any>[];
  wards = <any>[];
  filteredWards = <any>[];
  @Output() focusedBlock = new EventEmitter()
  @Output() contentToContent = new EventEmitter()
  updated: boolean = false
  @ViewChild('contentDiv') contentDiv!: ElementRef<any>;
  @ViewChild('contentMenu') contentMenu!: any;
  shareBottomSheetRef: any;
  shareInformation: any;

  @HostListener('document:click', ['$event'])
  click(event: any) {
    if (this.eRef.nativeElement.contains(event.target)) {
      const sel = document.getSelection();
      if ((this.data.type == 'contentBlock') && sel) {
        // @ts-ignore
        const focusContentId = sel?.focusNode?.parentNode?.id
        // @ts-ignore
        const focusContentClass = [...sel?.focusNode?.parentNode?.classList]
        if (this.contentEditable) {
          this.data.focused = true
        } else {
          this.data.focused = false
          if (focusContentId && focusContentClass?.includes('split')) {
            const splits = new Array(document.getElementsByClassName('split'))[0]
            const focusedSplit = document.getElementById(focusContentId)
            for (let i = 0; i <= splits.length; i++) {
              splits[i]?.setAttribute('style', 'color: unset')
            }
            if (focusedSplit) {
              focusedSplit.style.color = '#4285f4'
              let studyStorage = JSON.parse(localStorage.getItem('reading') || '[]')
              if (!studyStorage) {
                studyStorage = []
              }
              this.contentToContent.emit(focusContentId)
            }
          } else {
          }
        }
      }
    } else {
      this.data.focused = false
      this.focusedBlock.emit(this.data)
    }
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onKeyControlS(event: any) {
    event.preventDefault()
    this.onBlur()
  }

  @HostListener('document:keydown.control.enter')
  onKeyControlEnterDown() {
    this.data.focused = false
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    if (!this.contentEditable) {
      if (event?.button === 2) {
        event.preventDefault()
        this.showContentMenu(event)
      }
    }
  }

  constructor(
    private _snackBar: MatSnackBar,
    private eRef: ElementRef,
    public authService: AuthService,
    private commonService: CommonService,
    private matBottomSheet: MatBottomSheet,
    private locationService: LocationService
  ) {
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
    this.getAllDivisions()
    this.getDistricts()
    this.getWards()
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

  public onBlur() {
    if (this.updated) {
      [...this.contentDiv.nativeElement.children]?.forEach((item: any) => {
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
                  if (node.data?.length > 0) {
                    find(this.data.content, item.id).content.push({
                      type: 'text',
                      text: node.data
                    })
                  }
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
                if (node.nodeName == `SPAN` && node.classList.contains('split')) {
                  const textContent = node.textContent
                  if (textContent.toString()?.length > 0) {
                    find(this.data.content, item.id).content.push({
                      type: 'text',
                      text: textContent,
                      attrs: {
                        split: true
                      },
                      key: `${item.id}t${find(this.data.content, item.id).content?.length}`
                    })
                  }
                }
                if (node.nodeName == `INPUT` && node.classList.contains('form-control') && node.classList.contains('text')) {
                  find(this.data.content, item.id).content.push({
                    type: 'form-control',
                    formType: 'text',
                    value: node.value,
                    label: node.placeholder,
                    key: node.id
                  })
                  console.log(node);
                }
                if (node.nodeName == `TEXTAREA` && node.classList.contains('form-control') && node.classList.contains('textarea')) {
                  find(this.data.content, item.id).content.push({
                    type: 'form-control',
                    formType: 'textarea',
                    value: node.value,
                    label: node.placeholder,
                    key: node.id
                  })
                  console.log(node);
                }
                if (node.nodeName == `LABEL` && node.classList.contains('form-control') && node.classList.contains('checkbox')) {
                  const licb = {
                    type: 'form-control',
                    formType: 'checkbox',
                    value: false,
                    label: '',
                    key: node.id
                  };
                  [...node.childNodes]?.filter((node: any) => node?.nodeName !== '#comment')?.forEach((labelCheckBox: any) => {
                    if (labelCheckBox.nodeName == `#text`) {
                      licb.label = labelCheckBox.textContent
                    }
                    if (labelCheckBox.nodeName == `INPUT`) {
                      licb.value = labelCheckBox.checked
                      licb.key = labelCheckBox.id
                    }
                  })
                  console.log(licb);
                  find(this.data.content, item.id).content.push(licb)
                }
                if (node.nodeName == `BUTTON` && node.classList.contains('form-control') && node.classList.contains('comboLocation')) {
                  const licb = {
                    type: 'form-control',
                    formType: 'comboLocation',
                    text: node.getAttribute('aria-label') !== node.textContent ? node.textContent : '',
                    value: node.getAttribute('value') ? (node.getAttribute('value') || '{}') : '',
                    label: node.getAttribute('aria-label'),
                    mode: node.classList.contains('PpDdWwA') ? 'PpDdWwA' : node.classList.contains('pPdDwWA') ? 'pPdDwWA' : '',
                    key: node.id
                  };
                  console.log(licb);
                  find(this.data.content, item.id).content.push(licb)
                }
              })
              item.innerHTML = find(this.data.content, item.id).content
                .map((text: any) => text?.type === 'form-control' ?
                  text?.formType === 'comboLocation' ? `<button id="${text?.key}" class="form-control font-bold comboLocation ${text?.mode}" aria-label="${text?.label}" value="${text?.value}" contentEditable="false">${text?.text || text?.label}</button>` :
                    text?.formType === 'text' ? `<input type="text" id="${text?.key}" placeholder="${text?.label}" class="font-bold form-control text" value="${text?.value}" />` :
                      text?.formType === 'checkbox' ? `<label class="form-control checkbox" for="${text.key}">${text?.label}<input type="checkbox" class="form-control checkbox" id="${text.key}" ${text?.value == true ? 'checked' : ''} /></label>` :
                        text?.formType === 'textarea' ? `<textarea  id="${text?.key}" placeholder="${text?.label}" class="font-bold form-control textarea">${text?.value}</textarea>` : ''
                  : text?.attrs?.knoll ? `<span style="color: #FF992B; position: relative; text-decoration: underline" class="knoll"><span class="stading-bell-icon" style="position: absolute; height: 15px; right: 100%; bottom: 100%; transform: translate(5px, 5px);"><svg width="15" height="15" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10C7 8.89543 7.89543 8 9 8H55C56.1046 8 57 8.89543 57 10V23C57 36.8071 45.8071 48 32 48C18.1929 48 7 36.8071 7 23V10Z" fill="#FF992B"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1182 8H18.8819L50.5937 39.7118C50.0001 40.3719 49.3719 41.0001 48.7119 41.5937L15.1182 8ZM13.377 8H14.1485L48.1947 42.0462C48.0556 42.1645 47.9153 42.2814 47.7737 42.3967L13.377 8ZM51.0462 39.1947L19.8516 8H32.3848L55.614 31.2292C54.5879 34.1741 53.0264 36.8681 51.0462 39.1947Z" fill="#B87333"/>
              <rect x="31" y="53" width="2" height="16" rx="1" transform="rotate(-90 31 53)" fill="#A82300"/>
              <rect x="30" y="55" width="6" height="6" rx="3" transform="rotate(-90 30 55)" fill="#A82300"/>
              <rect x="17" y="56" width="8" height="16" rx="1" transform="rotate(-90 17 56)" fill="#FFD700"/>
              <rect x="45" y="54" width="4" height="2" rx="1" transform="rotate(-90 45 54)" fill="#A82300"/>
              </svg></span><span class="knoll-content">${text.text}</span></span>` : text?.attrs?.split ? `<span class="split" id="${text.key}">${text.text}</span>` : text?.attrs?.fontWeight === 'bold' ? `<strong>${text.text}</strong>` : `${text.text}`).join('')
              this.updated = false
            }
          }
        }
      })
    }
  }

  getComboLocationText(text: any) {
    let value = <any>{}
    value = this.rootContent.formGroup.find((item: any) => item.key === text?.key)?.value || {}
    const country = value?.country
    const province = this.provinces.find((item: any) => item.code == parseInt(value.province))
    const district = this.districts.find((item: any) => item.code == parseInt(value.district))
    const ward = this.wards.find((item: any) => item.code == parseInt(value.ward))
    const wardName = this.wards.find((item: any) => item.code == parseInt(value.ward))?.name?.replace('Phường', '')?.replace('Thị trấn', '')?.replace('Xã', '')
    value.mode = text?.mode
    switch (value.mode) {
      case 'PpDdWwA':
        value.text = `${country ? country + ' quốc,' : ''} ${province ? province?.name?.replace('Thành phố', '')?.replace('Tỉnh', '') + ' ' +
          province?.division_type : ''
          }${district ? ', ' + district?.name?.replace('Huyện', '')?.replace('Quận', '')?.replace('Thị xã', '')?.replace('Thành phố', '') + ' ' +
            district?.division_type : ''
          }${ward ? ', ' + (parseInt(wardName) ? 'đệ ' + this.commonService.convertNumberToText(wardName) : wardName) + ' ' +
            ward?.division_type : ''
          }${value.village ? ', ' + value.village : ''}`.trim()
        break;
      case 'pPdDwWA':
        value.text = value.title
        break;
      default:
        break;
    }
    return value.text
  }

  getAllDivisions() {
    this.provinces = this.locationService.provinces
    try {
      this.locationService.getAllDivisions()
        .subscribe((res: any) => {
          if (res?.length > 0) {
            this.provinces = res
            this.locationService.provinces = res
          }
        })
    } catch (e) {
      console.log(e);
    }
  }

  getDistricts() {
    this.districts = this.locationService.districts
    if (!this.districts || this.districts?.length === 0) {
      try {
        this.locationService.getDistricts()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.districts = res
              this.locationService.districts = res
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      this.filteredDistricts = this.districts?.filter((item: any) => item.province_code === this.calculatedTuanCuu?.details?.province)
    }
  }

  getWards() {
    this.wards = this.locationService.wards
    if (!this.wards || this.wards?.length === 0) {
      try {
        this.locationService.getWards()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.wards = res
              this.locationService.wards = res
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      this.filteredWards = this.wards?.filter((item: any) => item.district_code === this.calculatedTuanCuu?.details?.district)
    }
  }

  showContentMenu(event: any) {
    this.shareInformation = {
      content: event.target?.outerText,
      id: event.target?.id,
      targetLink: `${location.href?.split('#')[0]}#${event.target?.id}`
    }
    this.shareBottomSheetRef = this.matBottomSheet.open(this.contentMenu)
  }

  copyContent(type: any) {
    if (type === 'content') {
      navigator.clipboard.writeText(this.shareInformation.content);
      this.shareBottomSheetRef.dismiss()
      this._snackBar.open('Đã sao chép nội dung', 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    if (type === 'link') {
      navigator.clipboard.writeText(this.shareInformation.targetLink);
      this.shareBottomSheetRef.dismiss()
      this._snackBar.open('Đã sao chép liên kết', 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    if (type === 'content&link') {
      navigator.clipboard.writeText(`${this.shareInformation.content}\n${this.shareInformation.targetLink}`);
      this.shareBottomSheetRef.dismiss()
      this._snackBar.open('Đã sao chép nội dung và liên kết', 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
