import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SoanSoService } from 'src/app/shared/services/soan-so/soan-so.service';

@Component({
  selector: 'app-soan-so',
  templateUrl: './soan-so.component.html',
  styleUrls: ['./soan-so.component.scss']
})
export class SoanSoComponent implements OnInit {

  editData: any;
  isLoading: any;
  token: any;
  content = <any>{};
  previewContent = <any>{};
  contentEditable: boolean = true

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private soanSoService: SoanSoService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((query) => {
      if (query['token']) {
        const token = query['token']
        this.token = token
        const jwtHelper = new JwtHelperService()
        const decodedToken = jwtHelper.decodeToken(token)
        this.editData = decodedToken
        this.editData.name = 'Soạn sớ'
        console.log(this.editData);
      }
    })
    this.getCotnent()
  }

  getCotnent() {
    if (!this.content?.content || this.content?.content?.length === 0) {
      const initNewContent = () => {
        this.content = {
          type: 'block',
          key: this.commonService.generatedSlug(`${this.editData.soTemplate} ${this.editData.eventName} ${this.editData.subject.key}`),
          content: [],
        }
        if (!this.content.formGroup || this.content.formGroup.length == 0) {
          this.content.formGroup = []
        }
      }
      try {
        this.soanSoService.getSoTemplate(this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`))
          .subscribe((res: any) => {
            if (res?.data) {
              this.content = res.data
              this.content.name = `Sớ ${this.editData.soTemplate}`
              console.log(this.content);
              if (this.editData.eventLunar.lunarYearName) {
                this.applyData('nam-am-lich', this.editData.eventLunar.lunarYearName)
              }
              let content = JSON.stringify(this.content)
              // @ts-ignore
              content = content.replaceAll(this.token.replace('=', '').replaceAll('-', ''), '').replaceAll('%3D', '')
              let data = JSON.parse(content);
              data.content = data.content.map((item: any, index: any) => {
                return {
                  key: `preview-${this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)}-${index}`,
                  type: item.type,
                  content: item.content?.map((evn: any, i: any) => {
                    return {
                      attrs: evn.attrs,
                      content: evn.content,
                      key: `preview-${this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)}-${index}p${i}`,
                      type: evn.type,
                    }
                  }),
                }
              })
              // @ts-ignore
              data = JSON.parse(JSON.stringify(data).replaceAll(data.content[0].key.split('-')[0], this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)))
              this.previewContent = data
            } else {
              initNewContent()
            }
          })
      } catch (e) {
        console.log(e);
        initNewContent()
      }
    }
  }

  onSaveContent() {
    console.log(this.content);
    let content = JSON.stringify(this.content)
    // @ts-ignore
    content = content.replaceAll(this.token.replace('=', '').replaceAll('-', ''), '').replaceAll('%3D', '')
    let data = JSON.parse(content);
    data.content = data.content.map((item: any, index: any) => {
      return {
        key: `preview-${this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)}-${index}`,
        type: item.type,
        content: item.content?.map((evn: any, i: any) => {
          return {
            attrs: evn.attrs,
            content: evn.content,
            key: `preview-${this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)}-${index}p${i}`,
            type: evn.type,
          }
        }),
      }
    })
    // @ts-ignore
    data = JSON.parse(JSON.stringify(data).replaceAll(data.content[0].key.split('-')[0], this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)))
    console.log({ data: data });
    navigator.clipboard.writeText(JSON.stringify({ data: data }));
    this.previewContent = data
  }

  onChangeSelectedIndex(event: any) {
    if (event === 1) {
      this.contentEditable = false
    }
    if (event === 0) {
      this.contentEditable = true
    }
  }

  onPrint() {
    let printTab = window.open(
      '',
      'PRINT',
      `width=${window.innerWidth},height=${window.innerHeight}`
    );
    printTab?.document.write(
      `<html><head>
      <title>${document.title.toUpperCase()}PRINTER</title>
      <style>
      .tableContent td, th {
        font-size: 22px;
        text-align: left;
        padding: 1rem;
        border-bottom: 1px solid #000000;
      }
      .btn-share-item {
        display: none;
      }
      </style>
      `
    );
    printTab?.document.write('</head><body >');

    const printContent = document.getElementById('contentCreatorWrapper');
    const writeContent = document.createElement('DIV');
    if (writeContent) {
      writeContent.innerHTML = `${printContent?.outerHTML}`;
      // @ts-ignore
      if (writeContent.childNodes[0] && writeContent.childNodes[0].style) {
        // @ts-ignore
        writeContent.childNodes[0].style.padding = 0;
      }
    }
    printTab?.document.write(writeContent?.outerHTML);
    printTab?.document.write('</body></html>');
    printTab?.document.close(); // necessary for IE >= 10
    printTab?.focus(); // necessary for IE >= 10*/
    printTab?.print();
  }

  applyData(key: any, value: any) {
    const find = (array: any, key: any) => {
      let result: any;
      array.some((o: any) => result = o.key === key && o.type === 'form-control' ? o : find(o.content || [], key));
      return result;
    }
    if (this.content.formGroup.find((item: any) => item.key === key)) {
      this.content.formGroup.find((item: any) => item.key === key).value = value
    }
    console.log(find(this.content.content, key));

    if (find(this.content.content, key)) {
      find(this.content.content, key).value = value
    }
  }
}
