import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameService } from 'src/app/shared/services/game/game.service';

@Component({
  selector: 'app-challenger',
  templateUrl: './challenger.component.html',
  styleUrls: ['./challenger.component.scss']
})
export class ChallengerComponent {
  @Input() position: any;
  @Input() fighting: boolean = false
  @Input() youTurn: boolean = false

  @Output() setUser = new EventEmitter();
  @Output() attack = new EventEmitter();

  kid = <any>{}
  fightingPurify = <any>{}
  purifyList = <any>[]
  totalScore = 0
  deducted = 0
  halfElement: any;
  sumElement = <any>[];

  constructor(private gameService: GameService) {
  }


  scanComplete(event: any) {
    this.getUser(event)
  }

  getUser(event: any) {
    if (event?.includes('@')) {
      const foundKid = JSON.parse(JSON.stringify(this.gameService.kidsList?.find((item: any) => item?.userName === event?.split('@')[1])))
      if (foundKid?.purify) {
        if (typeof foundKid?.purify === 'string') {
          foundKid.purify = JSON.parse(foundKid?.purify)
          if (Object?.keys(foundKid.purify)?.length > 0) {
            Object?.keys(foundKid.purify)?.forEach((p: any) => {
              const foundPurify = JSON.parse(JSON.stringify(this.gameService?.purifyList?.find((item: any) => item?.key === p)))
              const data = {
                data: foundKid.purify,
                purify: foundPurify
              }
              if (data?.purify?.defect && typeof data?.purify?.defect === 'string') {
                data.purify.defect = JSON.parse(data?.purify?.defect)
              }
              if (data?.purify?.init && typeof data?.purify?.init === 'string') {
                data.purify.init = JSON.parse(data?.purify?.init)
              }
              data.purify.attackPercent = (((parseFloat(foundKid.purify[p]?.attack) || 0) + data.purify.attack) / data.purify.attack) * 100
              data.purify.hp += parseFloat(foundKid.purify[p]?.hp) || 0
              data.purify.attack += parseFloat(foundKid.purify[p]?.attack) || 0
              data.purify.speed += parseFloat(foundKid.purify[p]?.speed) || 0
              data.purify.def += parseFloat(foundKid.purify[p]?.def) || 0
              if (data?.purify?.skill && typeof data?.purify?.skill === 'string') {
                data.purify.skill = JSON.parse(data?.purify?.skill)
              }
              data.purify.skill = data.purify.skill?.filter((ps: any) => {
                return ps?.required?.hp <= data.purify.hp &&
                  ps?.required?.attack <= data.purify.attack &&
                  ps?.required?.speed <= data.purify.speed &&
                  ps?.required?.def <= data.purify.def
              })
              data.purify.totalScore = 0
              data.purify.totalScore += data.purify.hp || 0
              data.purify.totalScore += data.purify.attack || 0
              data.purify.totalScore += data.purify.speed || 0
              data.purify.totalScore += data.purify.def || 0
              this.purifyList.push(data)
            })
          }
        }
      }
      this.kid = foundKid
      this.setUser.emit(foundKid)
    }
  }

  updateSelectedPurify(selectedPurify: any) {
    const fightingPurify = <any>[]
    this.totalScore = 0
    selectedPurify.selectedOptions.selected?.forEach((item: any) => {
      this.totalScore += this.purifyList?.find((p: any) => p?.purify?.key === item.value)?.purify?.totalScore
      fightingPurify.push(this.purifyList?.find((p: any) => p?.purify?.key === item.value))
    })
    this.deducted = JSON.parse(JSON.stringify(this.totalScore))
    this.kid.fightingPurify = fightingPurify
    this.setUser.emit(this.kid)
  }

  clearSelectedPurify(selectedPurify: any) {
    selectedPurify.selectedOptions.clean()
  }

  chooseFightingPurify(item: any) {
    this.sumElement = <any>[]
    this.fightingPurify = <any>{}
    this.fightingPurify = item
    this.fightingPurify.purify.deducted = JSON.parse(JSON.stringify(item.purify.hp))
    this.kid.fighting = this.fightingPurify
    this.kid.fighting?.purify?.skill?.forEach((skill: any) => {
      this.sumElement = this.sumElement.concat(skill?.element)
    })
    this.sumElement = [...new Set(this.sumElement)]
    this.setUser.emit(this.kid)
  }

  onAttack(skill: any) {
    const sumElement = [...new Set(skill?.element)]
    skill?.element?.forEach((item: any) => {
      const foundElement = this.fightingPurify.purify.init?.find((init: any) => item === init)
      if (foundElement) {
        this.fightingPurify.purify.init.splice(this.fightingPurify.purify.init.indexOf(foundElement), 1)
      }
    })
    if (!this.fightingPurify.return) {
      this.fightingPurify.return = 0
    }
    this.fightingPurify.return += skill?.element?.length / 2
    if (this.fightingPurify.return > 0) {
      if (sumElement?.length === 1) {
        this.halfElement = sumElement[0]
        for (let index = 0; index < Math.floor(this.fightingPurify.return); index++) {
          this.fightingPurify.purify.init.push(sumElement[0])
        }
        this.fightingPurify.return -= Math.floor(this.fightingPurify.return)
      }
    }
    skill.totalDamage = (parseFloat(skill?.damage) * this.fightingPurify.purify?.attackPercent) / 100
    this.attack.emit({
      from: this.position,
      skill: skill,
    })
  }

  getElementValue(name: any) {
    return this.gameService.element[name]?.name || '??'
  }

  borrowOneElement(element: any) {
    this.fightingPurify.purify.init.push(element)
    if (!this.kid.loan) {
      this.kid.loan = []
    }
    this.kid.loan.push(element)
  }
}
