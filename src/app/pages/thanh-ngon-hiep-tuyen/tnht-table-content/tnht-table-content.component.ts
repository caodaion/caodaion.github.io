import { Component, OnInit } from '@angular/core';
import { TnhtService } from "../../../shared/services/tnht/tnht.service";
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tnht-table-content',
  templateUrl: './tnht-table-content.component.html',
  styleUrls: ['./tnht-table-content.component.scss']
})
export class TnhtTableContentComponent implements OnInit {

  tableContent: Array<any> = [];
  isLoading: boolean = false
  reading: any;

  constructor(private tnhtService: TnhtService, private router: Router, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Thánh-Ngôn Hiệp-Tuyển`)
    this.getTableContent()
  }

  getTableContent() {
    this.isLoading = true
    this.tnhtService.getTNHTByPath('quyen-1').subscribe((res: any) => {
      if (res.data) {
        this.isLoading = false
        this.tableContent.push(res.data)
        this.reading = JSON.parse(localStorage.getItem('reading') || '[]')?.find((item: any) => item.key == 'thanhngonhieptuyenquyen1')
        this.dataMigration()
      }
    })
  }

  dataMigration() {
    // this.tableContent[0].content.forEach((item: any) => {
    //   item.content = item?.content?.map((c: any) => {
    //     return {
    //       attrs: c.attrs,
    //       key: c.key,
    //       type: c.type,
    //       content: c.content,
    //       focused: c.focused,
    //     }
    //   })
    // });
    // console.log(this.tableContent[0]);
  }

  readTNHTContent(item: any) {
    if (item?.attrs?.hash?.includes('#')) {
      this.router.navigate([item?.attrs?.pathname], { fragment: item?.attrs?.hash.replace('#', '') })
    } else {
      this.router.navigate([`${item?.attrs?.pathname}${item?.attrs?.hash || ''}`])
    }
  }

  getContentName(item: any) {
    if (!item?.name) {
      let name = ''
      item?.content[0]?.content?.forEach((text: any) => {
        if (text.type == 'text') {
          name += text?.text
        }
      })
      return name
    }
    return item?.name
  }

  continueReading(isAutoPlay: boolean = false) {
    if (isAutoPlay) {
      this.router.navigateByUrl(`${this.reading.location.replace(location.origin, '')}`, {
        state: { autoplay: true }
      })
    } else {
      this.router.navigateByUrl(this.reading.location.replace(location.origin, ''))
    }
  }
}
