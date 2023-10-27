import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-purify-vs',
  templateUrl: './purify-vs.component.html',
  styleUrls: ['./purify-vs.component.scss']
})
export class PurifyVsComponent implements OnInit {
  challengerLeft = <any>{}
  challengerRight = <any>{}
  winner = <any>{}
  responseData = <any>[]
  fighting: boolean = false
  loading: boolean = false
  turn: any;
  turnAnimation: any;
  deducted: any;
  attacking: any;
  @ViewChild('gameWinSound') gameWinSound!: ElementRef;
  @ViewChild('gameStartSound') gameStartSound!: ElementRef;
  @ViewChild('dodgeAttackSound') dodgeAttackSound!: ElementRef;
  @ViewChild('player1Sound') player1Sound!: ElementRef;
  @ViewChild('player1WinsSound') player1WinsSound!: ElementRef;
  @ViewChild('player2Sound') player2Sound!: ElementRef;
  @ViewChild('player2WinsSound') player2WinsSound!: ElementRef;


  ngOnInit(): void {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }

  disabledFight() {
    return !(this.challengerLeft?.fightingPurify?.length > 0 && this.challengerRight?.fightingPurify?.length > 0)
  }

  toggleFighting() {
    this.fighting = !this.fighting
    this.loading = true
    this.gameStartSound?.nativeElement?.play()
    setTimeout(() => {
      this.loading = false
    }, 3000)
  }

  randomFirstTurn() {
    this.turn = Math.random() >= 0.5 ? 'left' : 'right'
    this.switchTurn()
  }

  switchTurn() {
    this.turnAnimation = {
      to: this.turn,
      turn: this.turn === 'left' ? this.challengerLeft : this.challengerRight,
    }
    setTimeout(() => {
      this.turnAnimation = null
      this.checkResult()
    }, 1000);
  }

  checkResult() {
    if (this.challengerRight.deducted === 0 || this.challengerLeft.deducted === 0) {
      setTimeout(() => {
        if (this.gameWinSound) {
          if (this.challengerRight.deducted === 0) {
            this.winner = this.challengerLeft
            this.player1WinsSound?.nativeElement?.play()
          }
          if (this.challengerLeft.deducted === 0) {
            this.winner = this.challengerRight
            this.player2WinsSound?.nativeElement?.play()
          }
          setTimeout(() => {
            this.gameWinSound?.nativeElement?.play()
          }, 1500);
        }
      }, 2000)
    } else {
      if (this.turn === 'left') {
        this.player1Sound?.nativeElement?.play()
      }
      if (this.turn === 'right') {
        this.player2Sound?.nativeElement?.play()
      }
    }
  }
  onAttack(event: any) {
    this.attacking = event
    this.responseData = JSON.parse(JSON.stringify(event))
    if (event.from === 'start') {
      this.turn = 'right'
      this.responseData.avoid = event?.skill?.totalDamage - (event?.skill?.totalDamage * (this.challengerRight?.fighting?.purify?.speed / (event?.skill?.totalDamage + this.challengerRight?.fighting?.purify?.speed)) * 100) / 100
      this.responseData.defense = event?.skill?.totalDamage - (event?.skill?.totalDamage * (this.challengerRight?.fighting?.purify?.def / (event?.skill?.totalDamage + this.challengerRight?.fighting?.purify?.def)) * 100) / 100
    }
    if (event.from === 'end') {
      this.turn = 'left'
      this.responseData.avoid = event?.skill?.totalDamage - (event?.skill?.totalDamage * (this.challengerLeft?.fighting?.purify?.speed / (event?.skill?.totalDamage + this.challengerLeft?.fighting?.purify?.speed)) * 100) / 100
      this.responseData.defense = event?.skill?.totalDamage - (event?.skill?.totalDamage * (this.challengerLeft?.fighting?.purify?.def / (event?.skill?.totalDamage + this.challengerLeft?.fighting?.purify?.def)) * 100) / 100
    }
  }

  onRepsonse(damage: any, effect: any) {
    if (effect === 'avoid') {
      this.dodgeAttackSound?.nativeElement?.play()
    }
    if (effect === 'defense') {
      if (this.responseData?.skill?.sound?.match(/d\/([^\/]+)/)) {
        this.responseData.skill.sound = `https://drive.google.com/uc?export=view&id=${this.responseData?.skill?.sound.match(/d\/([^\/]+)/)[1]}`
      }
      const audio = new Audio(this.responseData?.skill?.sound);
      audio?.play();
    }
    this.attacking = null
    if (this.responseData?.from === 'start') {
      const deducted = this.challengerRight.fighting.purify.deducted - damage
      if (deducted >= 0) {
        this.challengerRight.deducted -= damage
      } else {
        this.challengerRight.deducted -= this.challengerRight.fighting.purify.deducted
      }
      this.challengerRight.deducted = this.challengerRight.deducted < 0 ? 0 : this.challengerRight.deducted
      this.challengerRight.fighting.purify.deducted -= damage
      this.challengerRight.fighting.purify.deducted = this.challengerRight.fighting.purify.deducted > 0 ? this.challengerRight.fighting.purify.deducted : 0
      this.switchTurn()
    }
    if (this.responseData?.from === 'end') {
      const deducted = this.challengerLeft.fighting.purify.deducted - damage
      if (deducted > 0) {
        this.challengerLeft.deducted -= damage
      } else {
        this.challengerLeft.deducted -= this.challengerLeft.fighting.purify.deducted
      }
      this.challengerLeft.deducted = this.challengerLeft.deducted < 0 ? 0 : this.challengerLeft.deducted
      this.challengerLeft.fighting.purify.deducted -= damage
      this.challengerLeft.fighting.purify.deducted = this.challengerLeft.fighting.purify.deducted > 0 ? this.challengerLeft.fighting.purify.deducted : 0
      this.switchTurn()
    }
    setTimeout(() => {
      this.deducted = {
        user: this.responseData?.from,
        damage: damage
      }
      setTimeout(() => {
        this.deducted = null
      }, 1000);
    }, 1500);
  }

  onRefresh() {
    location.reload()
  }
}
