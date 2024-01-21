import { Component, OnInit } from '@angular/core';
import OrgChart from "src/assets/orgchart";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.initChart()
  }

  initChart() {
    OrgChart.templates['mindMap'] = Object.assign({}, OrgChart.templates['ana']);
    OrgChart.templates['mindMap'].size = [150, 27];
    OrgChart.templates['mindMap'].minus = OrgChart.templates['belinda'].minus = "";
    OrgChart.templates['mindMap'].node = "";
    OrgChart.templates['mindMap'].link =
      '<path stroke="#575757" stroke-width="2" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}" />';
    OrgChart.templates['mindMap']['field_1'] =
      '<text data-width="auto" style="font-size: 16px;" fill="#575757" x="75" y="18" text-anchor="middle">{val}</text>';
    OrgChart.templates['invisibleGroup'].plus = "";
    OrgChart.templates['invisibleGroup'].minus = "";
    OrgChart.templates['belinda'].size = [200, 200];
    OrgChart.templates['belinda'].defs = OrgChart.gradientCircleForDefs(
      "circle",
      ["#F57C00", "#FFCA28", "#039BE5", "#039BE5", "#33b864", "#F57C00"],
      100,
      10
    );
    OrgChart.templates['belinda'].node =
      '<use x="0" y="0" xlink:href="#circle" />' +
      '<g transform="matrix(3.5,0,0,3.5,20,20)"><circle cx="12" cy="22" r="12" fill="#039BE5"></circle>' +
      '<circle cx="33" cy="14" r="10" fill="#FFCA28"></circle>' +
      '<circle cx="30" cy="32" r="8" fill="#F57C00"></circle></g>';

    // OrgChart.templates['belinda']['field_1'] =
    //   '<text style="font-size: 18px;" text-anchor="middle" fill="#575757"  x="100" y="230">{val}</text>';
    const tree = document.getElementById("tree")
    if (tree) {


      var chart = new OrgChart(tree, {
        template: "mindMap",
        nodeMouseClick: OrgChart.action.details,
        enableSearch: true,
        miniMap: true,
        enablePan: true,
        levelSeparation: 120,
        orientation: OrgChart.orientation.top,
        scaleInitial: OrgChart.match.boundary,
        nodeBinding: {
          field_0: "id",
          field_1: "Tên",
          field_2: "Địa Chỉ",
          field_3: "recognitionDate",
        },
        tags: {
          ig: {
            template: "invisibleGroup",
            subTreeConfig: {
              // orientation: OrgChart.orientation.left
            },
          },
          belinda: { template: "belinda" },
        },
      });

      chart.on("node-initialized", function (sender: any, args: any) {
        if (!args.node.children.length) {
          args.node.tags.push("no-children");
        }
      });

      chart.load([
        { id: "root", "Tên": "Đạo Cao Đài", tags: ["ig"] },
        { id: "dao-cao-dai", stpid: "root", tags: ["belinda"] },
        { id: "toa-thanh-tay-tinh", "Tên": "Tòa Thánh Tây Ninh", pid: "dao-cao-dai" },
        { id: "ban-chinh-dao", "Tên": "Ban Chỉnh Đạo", pid: "dao-cao-dai" },
        { id: "chieu-minh", "Tên": "Chiếu Minh", pid: "dao-cao-dai" },
        { id: "tien-thien", "Tên": "Tiên Thiên", pid: "dao-cao-dai" },
        { id: "truyen-giao", "Tên": "Truyền Giáo", pid: "dao-cao-dai" },
        { id: "toa-thanh-tay-tinh-ban-dai-dien-ben-tre", "Tên": "Ban Đại Diện Bến Tre", pid: "toa-thanh-tay-tinh" },
        { id: "ban-chinh-dao-ban-dai-dien-ben-tre", "Tên": "Ban Đại Diện Bến Tre", pid: "ban-chinh-dao" },
        { id: "ban-chinh-dao-ban-dai-dien-ben-tre-thanh-that-an-hoi", "Tên": "Thánh Thất An Hội", pid: "ban-chinh-dao-ban-dai-dien-ben-tre" },
        { id: "ban-chinh-dao-ban-dai-dien-ben-tre-thanh-that-binh-phu", "Tên": "Thánh Thất Bình Phú", pid: "ban-chinh-dao-ban-dai-dien-ben-tre" },
        { id: "ban-chinh-dao-ban-dai-dien-lam-dong", "Tên": "Ban Đại Diện Lâm Đồng", pid: "ban-chinh-dao" },
        { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-da-lat", "Tên": "Thánh Thất Đà Lạt", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
        { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-bong-lai", "Tên": "Thánh Thất Bồng Lai", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
        { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-xuan-son", "Tên": "Thánh Thất Xuân Sơn", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
        { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-phu-son", "Tên": "Thánh Thất Phú Sơn", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
        { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-quang-lac", "Tên": "Thánh Thất Quảng Lạc", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
        { id: "tien-thien-ban-dai-dien-ben-tre", "Tên": "Ban Đại Diện Bến Tre", pid: "tien-thien" },
        { id: "truyen-giao-ban-dai-dien-ben-tre", "Tên": "Ban Đại Diện Bến Tre", pid: "truyen-giao" },
      ]);
    }
  }
}
