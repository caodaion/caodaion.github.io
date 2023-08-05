import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaoDaiONHome } from 'src/assets/game/CaoDaiONHome';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('gameScene') gameScene!: ElementRef
  @ViewChild('gameScene') warningDialog!: ElementRef
  warningTitle: any;
  warningMessage: any;
  canvas: any;
  c: any;
  map: any;
  playerImageUp: any;
  playerImageRight: any;
  playerImageDown: any;
  playerImageLeft: any;
  player: any;
  playerPlaceHolder: any;
  playerPlaceHolderLocation: any;
  background: any;
  keys: any = {
    w: {
      pressed: false
    },
    d: {
      pressed: false
    },
    s: {
      pressed: false
    },
    a: {
      pressed: false
    },
  }
  collisions: any;
  boundaries = <any>[];
  offset = <any>{
    x: -1185, y: -400
  }
  movables = <any>[]
  moving: boolean = true
  speed: number = 5
  moveTo: any = 'left';
  lastTurn: any;
  mapWidth = 480
  mapUnit = 8 * 4
  gender: any = null;
  isFlycamInusing: boolean = false
  isIgnoreBoundary: boolean = false

  @ViewChild('itemChestDialog') itemChestDialog!: any;

  constructor(
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {

  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: any) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        this.keys.w.pressed = true
        break;
      case 'ArrowRight':
      case 'd':
        this.keys.d.pressed = true
        break;
      case 'ArrowDown':
      case 's':
        this.keys.s.pressed = true
        break;
      case 'ArrowLeft':
      case 'a':
        this.keys.a.pressed = true
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: any) {
    this.keys.w.pressed = false
    this.keys.d.pressed = false
    this.keys.s.pressed = false
    this.keys.a.pressed = false
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.renderMap()
    this.cd.detectChanges()
  }

  rectangularCollistion = (rectagle1: any, rectangle2: any) => {
    return !this.isIgnoreBoundary && (rectagle1.position.x + rectagle1.width - this.mapUnit * 2 >= rectangle2.position.x &&
      rectagle1.position.x <= rectangle2.position.x + rectangle2.width - this.mapUnit * 2 &&
      rectagle1.position.y + rectagle1.height - this.mapUnit * 2 >= rectangle2.position.y &&
      rectagle1.position.y <= rectangle2.position.y + rectangle2.height - this.mapUnit * 2)
  }

  renderMap() {
    this.canvas = document.getElementById('gameCanvas')
    this.c = this.canvas.getContext('2d')
    this.canvas.width = this.gameScene.nativeElement.offsetWidth
    this.canvas.height = this.gameScene.nativeElement.offsetHeight - 4
    this.collisions = []
    const collision = CaoDaiONHome.tiled.layers.find((item: any) => item.name == 'collision')
    if (collision) {
      for (let index = 0; index < (collision.data.length); index += this.mapWidth) {
        this.collisions.push(collision.data.slice(index, this.mapWidth + index))
      }
      this.collisions.forEach((row: any, i: any) => {
        row.forEach((symbol: any, j: any) => {
          if (symbol === 137) {
            this.boundaries.push(
              new Boundary({
                position: {
                  x: j * this.mapUnit + this.offset.x,
                  y: i * this.mapUnit + this.offset.y,
                },
                c: this.c,
                height: this.mapUnit,
                width: this.mapUnit
              })
            )
          }
        })
      })
    }

    this.map = new Image()
    this.map.src = 'assets/game/CaoDaiONHome.png'
    this.playerImageLeft = new Image()
    this.playerImageLeft.src = `assets/game/form-left.png`
    this.playerImageRight = new Image()
    this.playerImageRight.src = `assets/game/form-right.png`
    this.playerImageUp = new Image()
    this.playerImageUp.src = `assets/game/form-${this.moveTo}.png`
    this.playerImageDown = new Image()
    this.playerImageDown.src = `assets/game/form-${this.moveTo}.png`
    if (!!this.gender) {
      this.playerImageUp.src = `assets/game/${this.gender}-${this.moveTo}.png`
      this.playerImageRight.src = `assets/game/${this.gender}-right.png`
      this.playerImageDown.src = `assets/game/${this.gender}-${this.moveTo}.png`
      this.playerImageLeft.src = `assets/game/${this.gender}-left.png`
    }
    this.player = new Sprite({
      position: {
        x: this.canvas.width / 2 - (this.playerImageLeft.width / 4) / 2,
        y: this.canvas.height / 2 - (this.playerImageLeft.height / 4) / 2
      },
      image: this.playerImageLeft,
      c: this.c,
      frames: {
        max: 4,
        speed: this.speed
      },
      sprites: {
        up: this.playerImageUp,
        right: this.playerImageRight,
        down: this.playerImageDown,
        left: this.playerImageLeft,
      }
    })
    this.lastTurn = this.player.sprites.left
    this.background = new Sprite({
      position: {
        x: this.offset.x, y: this.offset.y
      },
      image: this.map,
      c: this.c
    })
    this.map.onload = () => {
      this.background.draw()
    }
    this.movables = [this.background, ...this.boundaries]
    const animate = () => {
      window.requestAnimationFrame(animate)
      this.background.draw()
      if (this.playerPlaceHolder) {
        this.playerPlaceHolder.draw()
      }
      this.player.draw()
      this.boundaries.forEach((boundary: any) => {
        boundary.draw()
      })
      this.player.moving = false
      if (this.keys.w.pressed) {
        this.moving = true
        this.player.moving = true
        if (this.isFlycamInusing) {
          this.moveTo = 'up'
          this.lastTurn = this.player.sprites.up
        }
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (this.rectangularCollistion(this.player, {
            ...boundary, position: {
              x: boundary.position.x,
              y: boundary.position.y + this.speed
            }
          })) {
            this.moving = false
          }
        })
        if (this.moving) {
          this.movables.forEach((movable: any) => {
            movable.position.y += this.speed
          })
        }
      }
      if (this.keys.d.pressed) {
        this.moving = true
        this.player.moving = true
        this.moveTo = 'right'
        this.lastTurn = this.player.sprites.right
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (this.rectangularCollistion(this.player, {
            ...boundary, position: {
              x: boundary.position.x - this.speed,
              y: boundary.position.y
            }
          })) {
            this.moving = false
          }
        })
        if (this.moving) {
          this.movables.forEach((movable: any) => {
            movable.position.x -= this.speed
          })
        }
      }
      if (this.keys.s.pressed) {
        this.moving = true
        this.player.moving = true
        if (this.isFlycamInusing) {
          this.moveTo = 'down'
          this.lastTurn = this.player.sprites.down
        }
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (this.rectangularCollistion(this.player, {
            ...boundary, position: {
              x: boundary.position.x,
              y: boundary.position.y - this.speed
            }
          })) {
            this.moving = false
          }
        })
        if (this.moving) {
          this.movables.forEach((movable: any) => {
            movable.position.y -= this.speed
          })
        }
      }
      if (this.keys.a.pressed) {
        this.moving = true
        this.player.moving = true
        this.moveTo = 'left'
        this.lastTurn = this.player.sprites.left
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (this.rectangularCollistion(this.player, {
            ...boundary, position: {
              x: boundary.position.x + this.speed,
              y: boundary.position.y
            }
          })) {
            this.moving = false
          }
        })
        if (this.moving) {
          this.movables.forEach((movable: any) => {
            movable.position.x += this.speed
          })
        }
      }
    }
    animate()
  }

  openItemchest() {
    this.matDialog.open(this.itemChestDialog)
  }

  selectGender(gender: any) {
    this.isIgnoreBoundary = false
    this.isFlycamInusing = false
    this.gender = gender;
    this.moveTo = 'left'
    this.playerImageUp.src = `assets/game/${this.gender || 'form'}-${this.moveTo}.png`
    this.playerImageRight.src = `assets/game/${this.gender || 'form'}-right.png`
    this.playerImageDown.src = `assets/game/${this.gender || 'form'}-${this.moveTo}.png`
    this.playerImageLeft.src = `assets/game/${this.gender || 'form'}-left.png`
    this.player.frames.max = 4
    this.speed = 5
    this.lastTurn = this.player.sprites.left
    this.player.frames.speed = 5
    this.player.frames.alwayMoving = false
    if (this.playerPlaceHolder) {
      this.movables = [this.background, ...this.boundaries]
      this.playerPlaceHolder = undefined
    }
  }

  useFlycam() {
    this.isFlycamInusing = true
    this.isIgnoreBoundary = true
    this.playerImageUp.src = `assets/game/flycam.png`
    this.playerImageRight.src = `assets/game/flycam-right.png`
    this.playerImageDown.src = `assets/game/flycam.png`
    this.playerImageLeft.src = `assets/game/flycam-left.png`
    this.lastTurn = this.player.sprites.up
    this.player.frames.max = 2
    this.speed = 15
    this.player.frames.speed = 15
    this.player.frames.alwayMoving = 15
    const playerPlaceHolder = new Image()
    playerPlaceHolder.src = `assets/game/${this.gender || 'form'}-${this.moveTo}.png`
    const x = this.background.position.x
    const y = this.background.position.y
    this.playerPlaceHolder = new Sprite({
      position: {
        x: this.canvas.width / 2 - (playerPlaceHolder.width / 4) / 2,
        y: this.canvas.height / 2 - (playerPlaceHolder.height / 4) / 2
      },
      image: playerPlaceHolder,
      c: this.c,
      frames: {
        max: 4,
        speed: this.speed
      },
      sprites: {
        up: playerPlaceHolder,
        right: playerPlaceHolder,
        down: playerPlaceHolder,
        left: playerPlaceHolder,
      }
    })
    if (this.playerPlaceHolder) {
      this.movables.push(this.playerPlaceHolder)
    }
  }
}

class Sprite {
  position: any
  velocity: any
  c: any
  image: any
  width: any
  height: any
  frames: any
  sprites: any
  moving: boolean = false
  constructor({ position, velocity, image, c, frames = { max: 1, alwayMoving: false }, sprites }: any) {
    this.position = position
    this.velocity = velocity
    this.image = image
    this.c = c
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.moving = false
    this.sprites = sprites
  }

  draw() {
    this.c.drawImage(
      this.image,
      this.frames.val * this.image.width / this.frames.max,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height,
    )
    if (!this.moving && !this.frames.alwayMoving) {
      this.frames.val = 0
      return;
    }
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if ((this.frames.elapsed % (!this.frames.alwayMoving ? this.frames.speed || 5 : 5)) === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++
      } else {
        this.frames.val = 0
      }
    }
  }
}


class Boundary {
  position: any;
  width: any;
  height: any;
  c: any;
  constructor({ position, c, height, width }: any) {
    this.position = position
    this.width = width
    this.height = height
    this.c = c
  }

  draw() {
    this.c.fillStyle = 'rgba(0,0,0,0)'
    // this.c.fillStyle = 'red'
    this.c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
