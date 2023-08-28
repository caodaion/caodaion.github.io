import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-soan-so',
  templateUrl: './soan-so.component.html',
  styleUrls: ['./soan-so.component.scss']
})
export class SoanSoComponent implements OnInit {

  editData: any;
  isLoading: any;
  content = <any>{};

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((query) => {
      if (query['token']) {
        const token = query['token']
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
      this.content = {
        type: 'block',
        key: this.commonService.generatedSlug(`${this.editData.soTemplate} ${this.editData.eventName} ${this.editData.subject.key}`),
        content: [],
        attrs: {
          hash: '',
          pathname: location.pathname
        }
      }

      if (!this.content.formGroup || this.content.formGroup.length == 0) {
        this.content.formGroup = []
      }
      console.log(this.content);
    }
  }

  onSaveContent() {
    console.log(this.content);

  }
}
