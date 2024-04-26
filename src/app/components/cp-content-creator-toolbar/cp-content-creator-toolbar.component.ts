import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { LocationService } from 'src/app/shared/services/location/location.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }
@Component({
  selector: 'cp-content-creator-toolbar',
  templateUrl: './cp-content-creator-toolbar.component.html',
  styleUrls: ['./cp-content-creator-toolbar.component.scss']
})
export class CpContentCreatorToolbarComponent implements OnInit {
  @Input() data: any;
  @Input() focusedBlock: any;
  @Input() contentEditable: boolean = false;
  @Output() save = new EventEmitter();
  @Output() reset = new EventEmitter();


  addedFormField = <any>{}
  provinces = <any>[];
  districts = <any>[];
  filteredDistricts = <any>[];
  calculatedTuanCuu = <any>[];
  wards = <any>[];
  filteredWards = <any>[];

  @HostListener('document:keydown.control.enter')
  onKeyControlEnterDown() {
    this.addNewContentBlock()
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onKeyControlS(event: any) {
    event.preventDefault()
    this.saveData()
  }

  @ViewChild('audioDialog') audioDialog!: ElementRef;
  readonly sel: any;
  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private locationService: LocationService
  ) {

  }

  ngOnInit(): void {
    // console.log(this.data)
    // @ts-ignore
    if (this.data == {}) {
      this.data = {
        name: '',
        key: ''
      }
    }
    // this.getAllDivisions()
    // this.getDistricts()
    // this.getWards()
  }

  saveData() {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.focused === key ? o : find(o.content || [], key));
      return result;
    }
    const replaceFocused = () => {
      if (find(this.data.content, true)) {
        find(this.data.content, true).focused = false
        replaceFocused()
      } else {
        this.save.emit()
      }
    }
    setTimeout(() => {
      replaceFocused()
    }, 0)
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
        type: 'contentBlock',
        focused: true
      })
      setTimeout(() => {
        // @ts-ignore
        const newEl = document.getElementById(`${location.pathname.slice(1, location.pathname.length).split('/').slice(1).join('-').replaceAll('-', '')}${this.data.content.length - 1 || 0}p0`)
        if (newEl?.parentElement) {
          newEl?.parentElement.focus()
        }
      }, 0)
    }
    if (this.focusedBlock?.type == 'block') {
      this.focusedBlock.content.push({
        // @ts-ignore
        key: `${(location.pathname + this.focusedBlock.attrs.hash).slice(1, (location.pathname + this.focusedBlock.attrs.hash).length).split('/').slice(1).join('-').replaceAll('-', '')}${this.focusedBlock.content.length || 0}`,
        attrs: {
          pathname: location.pathname + this.focusedBlock.attrs.hash,
          hash: `#${this.focusedBlock.content.length || 0}`
        },
        type: 'contentBlock',
        focused: true
      })
      setTimeout(() => {
        // @ts-ignore
        const newEl = document.getElementById(`${(location.pathname + this.focusedBlock.attrs.hash).slice(1, (location.pathname + this.focusedBlock.attrs.hash).length).split('/').slice(1).join('-').replaceAll('-', '')}${this.focusedBlock.content.length - 1 || 0}p0`)
        if (newEl?.parentElement) {
          newEl?.parentElement.focus()
        }
      }, 0)
    }
  }

  addNewBlock() {
    if (!this.data.content || this.data.content.length == 0) {
      this.data.content = []
    }
    if (this.focusedBlock?.type == 'block') {
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
            type: 'contentBlock',
            focused: true
          }
        ],
        type: 'block',
        focused: true
      })
    }
  }

  addContentAudio() {
    console.log(this.data);
  }

  openAudioDialog(audioDialog?: any) {
    if (!this.data.audio) {
      this.data.audio = { src: '' }
    }
    const dialogRef = this.dialog.open(audioDialog)
  }

  openAddNewInputField(newFieldDialog: any) {
    const dialogRef = this.dialog.open(newFieldDialog)
    const sel: any = document.getSelection();
    if (sel) {
      const fix = {
        anchorNode: sel.anchorNode,
        anchorOffset: sel.anchorOffset,
        baseNode: sel.baseNode,
        baseOffset: sel.baseOffset,
        extentNode: sel.extentNode,
        extentOffset: sel.extentOffset,
        focusNode: sel.focusNode,
        focusOffset: sel.focusOffset,
        isCollapsed: sel.isCollapsed,
        rangeCount: sel.rangeCount,
        type: sel.type,
        getRangeAt: sel?.getRangeAt(0),
      }

      const ref: Mutable<this> = this;
      ref.sel = fix
      console.log(this.sel);
    }
  }

  disabledAddFormField() {
    if (!this.addedFormField.type || !this.addedFormField.key) {
      return true
    }
    if (this.addedFormField.type === 'comboLocation' && !this.addedFormField.mode) {
      return true
    }
    return false
  }

  updateAddedFormFieldKey() {
    this.addedFormField.key = this.commonService.generatedSlug(this.addedFormField.label)
  }

  addNewInputField() {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key ? o : find(o.content || [], key));
      return result;
    }
    const addText = () => {
      const range = this.sel?.getRangeAt;
      let nodeValue = 'INPUT'
      this.sel?.focusNode
      let updatedNode = document.createElement(nodeValue);
      updatedNode.setAttribute('placeholder', this.addedFormField.label)
      updatedNode.classList.add('font-bold')
      updatedNode.classList.add('form-control')
      updatedNode.classList.add('text')
      updatedNode.id = this.addedFormField.key
      range?.deleteContents();
      range?.insertNode(updatedNode);
      document.body.focus()
      this.data.formGroup.push({
        key: this.addedFormField.key,
        label: this.addedFormField.label,
        value: '',
        required: false,
        type: 'text'
      })
    }
    const addTextarea = () => {
      const range = this.sel?.getRangeAt;
      let nodeValue = 'TEXTAREA'
      this.sel?.focusNode
      let updatedNode = document.createElement(nodeValue);
      updatedNode.setAttribute('placeholder', this.addedFormField.label)
      updatedNode.classList.add('font-bold')
      updatedNode.classList.add('form-control')
      updatedNode.classList.add('textarea')
      updatedNode.id = this.addedFormField.key
      range?.deleteContents();
      range?.insertNode(updatedNode);
      document.body.focus()
      this.data.formGroup.push({
        key: this.addedFormField.key,
        label: this.addedFormField.label,
        value: '',
        required: false,
        type: 'textarea'
      })
    }
    const addCheckbox = () => {
      const range = this.sel?.getRangeAt;
      let nodeValue = 'INPUT'
      let label = 'LABEL'
      this.sel?.focusNode
      let updatedNode = document.createElement(label);
      let inputNode = document.createElement(nodeValue);
      inputNode.setAttribute('type', 'checkbox')
      updatedNode.classList.add('form-control')
      updatedNode.classList.add('checkbox')
      inputNode.classList.add('form-control')
      inputNode.classList.add('checkbox')
      inputNode.id = this.addedFormField.key
      updatedNode.setAttribute('for', this.addedFormField.key)
      updatedNode.innerHTML = `${this.addedFormField.label}${inputNode.outerHTML.toString()}`
      updatedNode.setAttribute('contentEditable', 'false')
      range?.deleteContents();
      range?.insertNode(updatedNode);
      document.body.focus()
      this.data.formGroup.push({
        key: this.addedFormField.key,
        label: this.addedFormField.label,
        value: '',
        required: false,
        type: 'checkbox'
      })
    }
    const addComboLocation = () => {
      const range = this.sel?.getRangeAt;
      let nodeValue = 'button'
      this.sel?.focusNode
      let updatedNode = document.createElement(nodeValue);
      updatedNode.classList.add('form-control')
      updatedNode.classList.add('font-bold')
      updatedNode.classList.add('comboLocation')
      updatedNode.classList.add(this.addedFormField.mode)
      updatedNode.id = this.addedFormField.key
      updatedNode.innerHTML = this.addedFormField.label
      updatedNode.setAttribute('aria-label', this.addedFormField.label)
      updatedNode.setAttribute('contentEditable', 'false')
      range?.deleteContents();
      range?.insertNode(updatedNode);
      document.body.focus()
      this.data.formGroup.push({
        key: this.addedFormField.key,
        label: this.addedFormField.label,
        mode: this.addedFormField.mode,
        value: '',
        required: false,
        type: 'comboLocation'
      })
    }
    if (this.sel) {
      switch (this.addedFormField.type) {
        case 'text':
          addText()
          break;
        case 'textarea':
          addTextarea()
          break;
        case 'checkbox':
          addCheckbox()
          break;
        case 'comboLocation':
          addComboLocation()
          break;
        default:
          break;
      }
    }
  }

  getAllDivisions() {
    this.commonService.fetchProvinceData()
      .subscribe((res: any) => {
        if (res?.status == 200) {
          this.provinces = res.provinces
          this.districts = res.districts
          this.wards = res.wards
        }
      })
  }
}

