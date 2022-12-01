import { Component, OnInit } from '@angular/core';
import {TnhtService} from "../../../shared/services/tnht/tnht.service";
import {FlatTreeControl} from "@angular/cdk/tree";

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-tnht-table-content',
  templateUrl: './tnht-table-content.component.html',
  styleUrls: ['./tnht-table-content.component.scss']
})
export class TnhtTableContentComponent implements OnInit {
  tableContent: Array<any> = [];
  constructor(private tnhtService: TnhtService) { }

  ngOnInit(): void {
    this.getTableContent()
  }
  getTableContent() {
    this.tnhtService.getTNHTByPath('quyen-1').subscribe((res: any) => {
      if (res.data) {
        this.tableContent.push(res.data)
        console.log(this.tableContent)
      }
    })
  }

  readTNHTContent(item: any) {
    let href = `${location.origin}`
    if (item?.attrs?.pathname) {
      href += item?.attrs?.pathname
    }
    if (item?.attrs?.hash) {
      href += item?.attrs?.hash
    }
    location.href = href
  }

  getContentName(item: any) {
    if (!item?.name) {
      let name = ''
      item?.content[0]?.content.forEach((text: any) => {
        if (text.type == 'text') {
          name += text?.text
        }
      })
      return name
    }
    return item?.name
  }
}
