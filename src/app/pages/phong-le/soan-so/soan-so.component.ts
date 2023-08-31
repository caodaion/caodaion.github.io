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
            if (res.data) {
              this.content = res.data
              console.log(this.content);
            } else {
              initNewContent()
              console.log(this.content);
            }
          })
      } catch (e) {
        console.log(e);
        initNewContent()
        console.log(this.content);
      }
    }
  }

  onSaveContent() {
    let content = JSON.stringify(this.content)
    // @ts-ignore
    content = content.replaceAll(this.token.replace('=', '').replaceAll('-', ''), '').replaceAll('%3D', '')
    let data = JSON.parse(content);
    data.content = data.content.map((item: any) => {
      return {
        key: item.key,
        type: item.type,
        content: item.content,
      }
    })
    // @ts-ignore
    data = JSON.parse(JSON.stringify(data).replaceAll(data.content[0].key.split('-')[0], this.commonService.generatedSlug(`Sớ ${this.editData.soTemplate}`)))
    console.log({ data: data });
    navigator.clipboard.writeText(JSON.stringify({ data: data }));
    this.content = data
  }
}
