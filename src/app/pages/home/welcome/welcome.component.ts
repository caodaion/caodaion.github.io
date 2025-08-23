import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { AuthService } from "../../../shared/services/auth/auth.service";

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    standalone: false
})
export class WelcomeComponent implements OnInit {
  greatings = [
    `Chào mừng!👋`,
    `Xin chào!👋`,
    `CaoDaiON chào bạn!👋`,
    `Bạn có khỏe không?🤔`,
    `Thân tâm bạn hôm nay thế nào?🤔`,
  ]
  randomRemember = [
    `<div>Hãy luôn ghi nhớ <h5 class="d-inline-block">"SỰ THƯƠNG YÊU là giềng bảo sanh của càn khôn thế giới"</h5> nhé!🫶</div>`,
    `<div>Hãy luôn ghi nhớ <h5 class="d-inline-block">"THẦY là Cha SỰ THƯƠNG YÊU"</h5> nhé!🫶</div>`,
    `<div>Hãy nhớ làm theo lời Thầy dạy bạn nhé!👉<h5 class="d-inline-block">"Thầy vui muốn các con thuận hòa cùng nhau hoài, ấy là lễ hiến cho Thầy rất trân trọng."</h5></div>`,
    `<div>Bạn có biết👉<h5 class="d-inline-block">"Sự Thương yêu là chìa khóa mở của Bạch Ngọc Kinh"</h5> không?🗝️♥️</div>`,
    `<div>Bạn có biết👉<h5 class="d-inline-block">"Đức tin là cần yếu cho sự đắc Đạo"</h5> không?</div>`,
    `<div><h5 class="d-inline-block">"Khổ hạnh là nấc thang bước khỏi chốn luân hồi"</h5> liệu bạn đã chấp nhận?</div>`,
    `<div>Bạn đã biết👉<h5 class="d-inline-block">"Tâm trung chánh làm cốt cho Tiên Thánh"</h5> chưa?</div>`,
    `<div><h5 class="d-inline-block">"Thiên vị là của báu vô giá"</h5> bạn nhé!</div>`,
    `<div>Bạn hãy luôn nhớ <h5 class="d-inline-block">"Trong Đạo không phân sang hèn"</h5> đâu nha!</div>`,
    `<div><h5 class="d-inline-block">"Đạo không giữ bằng lỗ miệng"</h5>, vậy giữ như thế nào bạn biết chưa?</div>`,
    `<div>Tác dụng của lương tâm là gì? Bạn biết chưa? <h5 class="d-inline-block">"Lương tâm để răn tội lỗi của riêng mình"</h5> bạn nhé!</div>`,
    `<div><h5 class="d-inline-block">"Không biết Đạo không phải là Người"</h5></div>`,
    `<div>Hãy luôn ghi nhớ <h5 class="d-inline-block">"Sự dối trá, trái nghịch là của Tà Quái"</h5> bạn nhé!</div>`,
    `<div>Hãy luôn ghi nhớ <h5 class="d-inline-block">"Phải tu hành mới thoát khỏi nạn tai"</h5> bạn nhé!</div>`,
    `<div><h5 class="d-inline-block">"Được Thiên Phong mà không biết tự lập thì không bổ ích"</h5></div>`,
    `<div>Hãy cố gắng thực hiện cơ phổ độ bạn nhé! Vì <h5 class="d-inline-block">"Muốn đắc quả thì phải Phổ Độ chúng sanh"</h5></div>`,
    `<div><h5 class="d-inline-block">"Được Thầy un đúc thì phải dẫn dắt lại chúng sanh"</h5></div>`,
    `<div><h5 class="d-inline-block">"Lo Đạo bao nhiêu thì đường về Thầy được bấy nhiêu"</h5></div>`,
    `<div>Hãy nhớ lời Thầy dạy rằng <h5 class="d-inline-block">"Phải tự lập lấy mình chứ Thầy không bồng ẳm lên được"</h5> bạn nhé!</div>`,
    `<div><h5 class="d-inline-block">"Phải thương hại kẻ nghịch chứ chẳng nên cừu hờn"</h5></div>`,
    `<div><h5 class="d-inline-block">"Nếu hạnh đức được hoàn toàn thì muốn điều khó cũng tan như giá"</h5></div>`,
    `<div><h5 class="d-inline-block">"Phải chung tâm hiêp trí thì bước Đạo mới được vững vàng"</h5></div>`,
    `<div><h5 class="d-inline-block">"Lời răn của Thầy làm vị thuốc khử tội các con"</h5></div>`,
    `<div><h5 class="d-inline-block">"Đạo đã lập thành gương sáng trồi lên thì thói tà chìm xuống"</h5></div>`,
    `<div><h5 class="d-inline-block">"Phải thương hết mọi người, dù người thù nghịch với mình cũng vậy"</h5></div>`,
    `<div><h5 class="d-inline-block">"Đừng tham của thế gian"</h5></div>`,
    `<div><h5 class="d-inline-block">"Đừng giận đừng ghét một ai hết"</h5></div>`,
    `<div><h5 class="d-inline-block">"Đừng nói việc xấu của người, phải dè dặt lời nói, ít nói tốt hơn"</h5></div>`,
    `<div><h5 class="d-inline-block">"Thường ngày phải tập tưởng lành, nói lành và làm lành"</h5></div>`,
    `<div><h5 class="d-inline-block">Nhất bất sát sanh</h5> là một phần của Ngũ giới cấm</div>`,
    `<div><h5 class="d-inline-block">Nhì bất du đạo</h5> là một phần của Ngũ giới cấm</div>`,
    `<div><h5 class="d-inline-block">Tam bất tà dâm</h5> là một phần của Ngũ giới cấm</div>`,
    `<div><h5 class="d-inline-block">Tứ bất tửu nhục</h5> là một phần của Ngũ giới cấm</div>`,
    `<div><h5 class="d-inline-block">Ngũ bất vọng ngữ</h5> là một phần của Ngũ giới cấm</div>`,
  ]
  rememberPlease: any = ''
  greating: any = ''
  isActiveRequired: any = false;
  isPhone: boolean = false;
  time = this.commonService.time;
  nowDate: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private commonService: CommonService,
    private calendarService: CalendarService,
    private authService: AuthService
  ) {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.isPhone = state.matches;
      });
    this.nowDate = {
      lunar: this.calendarService.getConvertedFullDate(new Date()).convertSolar2Lunar,
      solar: new Date()
    }
  }

  ngOnInit(): void {
    const getRandomIntInclusive = (min: any, max: any) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    }
    this.rememberPlease = this.randomRemember[getRandomIntInclusive(0, this.randomRemember.length - 1)]
    this.greating = `${this.greatings[getRandomIntInclusive(0, this.greatings.length - 1)]} ${this.authService.currentUser?.name || ''}.`
    this.isActiveRequired = this.authService.currentUser?.isGuest ? this.authService.currentUser?.userName : ''
  }
}
