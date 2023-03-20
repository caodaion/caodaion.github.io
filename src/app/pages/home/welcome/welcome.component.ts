import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  greatings = [
    `Chào mừng!👋`,
    `Xin chào!👋`,
    `CaoDaiON chào bạn!👋`,
    `Bạn có khỏe không?🤔`,
  ]
  randomRemember = [
    `<div>Hãy luôn ghi nhớ <h2 class="d-inline-block">"SỰ THƯƠNG YÊU là giềng bảo sanh của càn khôn thế giới"</h2> nhé!😉</div>`,
    `<div>Hãy luôn ghi nhớ <h2 class="d-inline-block">"THẦY là Cha SỰ THƯƠNG YÊU"</h2> nhé!😉</div>`,
    `<div>Hãy nhớ làm theo lời Thầy dạy bạn nhé!👉<h2 class="d-inline-block">"Thầy vui muốn các con thuận hòa cùng nhau hoài, ấy là lễ hiến cho Thầy rất trân trọng."</h2></div>`,
  ]
  rememberPlease: any = ''
  greating: any = ''

  ngOnInit(): void {
    const getRandomIntInclusive = (min: any, max: any) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    }
    this.rememberPlease = this.randomRemember[getRandomIntInclusive(0, this.randomRemember.length - 1)]
    this.greating = this.greatings[getRandomIntInclusive(0, this.greatings.length - 1)]
  }
}