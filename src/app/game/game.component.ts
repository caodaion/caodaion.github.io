import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CaoDaiONHome } from 'src/assets/game/CaoDaiONHome';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('gameScene') gameScene!: ElementRef
  canvas: any;
  c: any;
  map: any;
  playerImage: any;
  player: any;
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
    x: -2400, y: -500
  }
  movables = <any>[]
  moving: boolean = true
  speed: number = 10
  lastTurn: any;

  constructor() {

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
  }

  renderMap() {
    this.canvas = document.getElementById('gameCanvas')
    this.c = this.canvas.getContext('2d')
    this.canvas.width = this.gameScene.nativeElement.offsetWidth
    this.canvas.height = this.gameScene.nativeElement.offsetHeight - 4
    this.collisions = []
    for (let index = 0; index < CaoDaiONHome.tiled.layers[1].data.length; index += 70) {
      this.collisions.push(CaoDaiONHome.tiled.layers[1].data.slice(index, 70 + index))
    }
    this.collisions.forEach((row: any, i: any) => {
      row.forEach((symbol: any, j: any) => {
        if (symbol === 43) {
          this.boundaries.push(
            new Boundary({
              position: {
                x: j * 96 + this.offset.x,
                y: i * 96 + this.offset.y,
              },
              c: this.c
            })
          )
        }
      })
    })
    this.map = new Image()
    this.map.src = 'assets/game/CaoDaiONHome.png'
    this.playerImage = new Image()
    this.playerImage.src = 'assets/game/male.png'
    const playerMoveLeft = new Image()
    playerMoveLeft.src = 'assets/game/moveleft.png'
    const playerMoveRight = new Image()
    playerMoveRight.src = 'assets/game/moveright.png'
    this.player = new Sprite({
      position: {
        x: this.canvas.width / 2 - (playerMoveLeft.width / 4) / 2,
        y: this.canvas.height / 2 - (playerMoveLeft.height / 4) / 2
      },
      image: playerMoveLeft,
      c: this.c,
      frames: {
        max: 4,
        speed: this.speed
      },
      sprites: {
        left: playerMoveLeft,
        right: playerMoveRight
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
    const rectangularCollistion = (rectagle1: any, rectangle2: any) => {
      return rectagle1.position.x + rectagle1.width >= rectangle2.position.x &&
        rectagle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectagle1.position.y + rectagle1.height >= rectangle2.position.y &&
        rectagle1.position.y <= rectangle2.position.y + rectangle2.height
    }
    this.movables = [this.background, ...this.boundaries]
    const animate = () => {
      window.requestAnimationFrame(animate)
      this.background.draw()
      this.player.draw()
      this.boundaries.forEach((boundary: any) => {
        boundary.draw()
      })
      this.player.moving = false
      // this.c.drawImage()
      if (this.keys.w.pressed) {
        this.moving = true
        this.player.moving = true
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (rectangularCollistion(this.player, {
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
        this.lastTurn = this.player.sprites.right
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (rectangularCollistion(this.player, {
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
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (rectangularCollistion(this.player, {
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
        this.lastTurn = this.player.sprites.left
        this.player.image = this.lastTurn
        this.boundaries.forEach((boundary: any) => {
          if (rectangularCollistion(this.player, {
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
  constructor({ position, velocity, image, c, frames = { max: 1 }, sprites }: any) {
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
    if (!this.moving) {
      this.frames.val = 0
      return;
    }
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if ((this.frames.elapsed % (this.frames.speed || 5)) === 0) {
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
  constructor({ position, c }: any) {
    this.position = position
    this.width = 96
    this.height = 96
    this.c = c
  }

  draw() {
    this.c.fillStyle = 'rgba(0,0,0,0)'
    // this.c.fillStyle = 'red'
    this.c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
