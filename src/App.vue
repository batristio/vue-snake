<template>
  <div id="app" class="center">
    <canvas id="canvas" class="mt-5"></canvas>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import {
  randomBetweenMinMax,
  fillLabelledMatrix,
  randomApplePointFromMatrix
} from './utils/index'

enum DrawType {
  STOKE,
  FILL
}

enum Direction {
  LEFT,
  RIGHT,
  UP,
  DOWN
}

type Coordinates = {
  x: number;
  y: number;
}

type GameState = {
  CANVAS_SIZE: number | null;
  MATRIX_LENGTH: number | null;
  labeledMatrix: {}[][];
  snakeBodyCoordinates: Coordinates[];
  snakeTailTipCoordinates: Coordinates | null;
  snakeBodyLength: number;
  direction: Direction | null;
  appleCoordinates: Coordinates | null;
  isAppleEaten: boolean;
  applesEatenCounter: number;
}

export default Vue.extend({
  data (): GameState {
    return {
      CANVAS_SIZE: null,
      MATRIX_LENGTH: null,
      labeledMatrix: [],
      snakeBodyCoordinates: [],
      snakeTailTipCoordinates: null,
      snakeBodyLength: 0,
      direction: null,
      appleCoordinates: null,
      isAppleEaten: false,
      applesEatenCounter: 0
    }
  },

  methods: {
    init (): void {
      if (this.MATRIX_LENGTH < 20) throw new Error('Size should be at least 20 x 20.')
      if (this.MATRIX_LENGTH % 2 !== 0) throw new Error('Size should be an even number')

      this.generateInitialSnakePosition(this.MATRIX_LENGTH)
      this.generateRandomApplePoint()

      const canvas = document.getElementById('canvas')
      const drawingContext = canvas.getContext('2d')

      drawingContext.canvas.width = drawingContext.canvas.height = this.CANVAS_SIZE

      const rectSide = this.CANVAS_SIZE / this.MATRIX_LENGTH

      for (let i = 0; i < this.CANVAS_SIZE; i += rectSide) {
        for (let j = 0; j < this.CANVAS_SIZE; j += rectSide) {
          this.draw(i, j, 'rgb(0, 0, 0)', DrawType.STOKE)
        }
      }

      this.redrawChanges()
    },

    generateInitialSnakePosition (size: number): void {
      const x = randomBetweenMinMax(2, size - 2)
      const y = randomBetweenMinMax(2, size - 2)
      this.addToSnakeBody(x, y)

      this.direction = this.calculateInitialDirection(x, y, size)

      switch (this.direction) {
        case Direction.LEFT:
          this.addToSnakeBody(x + 1, y)
          this.addToSnakeBody(x + 2, y)
          break
        case Direction.RIGHT:
          this.addToSnakeBody(x - 1, y)
          this.addToSnakeBody(x - 2, y)
          break
        case Direction.UP:
          this.addToSnakeBody(x, y + 1)
          this.addToSnakeBody(x, y + 2)
          break
        case Direction.DOWN:
          this.addToSnakeBody(x, y - 1)
          this.addToSnakeBody(x, y - 2)
          break
      }
    },

    calculateInitialDirection (x: number, y: number, length: number): Direction {
      const middleOfTheAxis = length / 2

      const xDirectionChance = length - x + 1
      const yDirectionChance = length - y + 1

      const xDirection = xDirectionChance >= middleOfTheAxis ? Direction.RIGHT : Direction.LEFT
      const yDirection = yDirectionChance >= middleOfTheAxis ? Direction.DOWN : Direction.UP

      return xDirectionChance > yDirectionChance ? xDirection : yDirection
    },

    redrawChanges (): void {
      const rectSide = this.CANVAS_SIZE / this.MATRIX_LENGTH

      this.snakeBodyCoordinates.forEach(({ x, y }: Coordinates) => {
        this.draw(x * rectSide, y * rectSide, 'rgb(0, 0, 0)', DrawType.FILL)
      })

      if (this.snakeTailTipCoordinates !== null) {
        const x = this.snakeTailTipCoordinates.x * rectSide
        const y = this.snakeTailTipCoordinates.y * rectSide
        this.draw(x, y, 'rgb(255, 255, 255)', DrawType.FILL)
        this.draw(x, y, 'rgb(0, 0, 0)', DrawType.STOKE)
      }

      if (this.isAppleEaten === true || this.applesEatenCounter === 0) {
        this.generateRandomApplePoint()
        this.draw(this.appleCoordinates.x * rectSide, this.appleCoordinates.y * rectSide, 'rgb(255, 0, 0)', DrawType.FILL)
        this.isAppleEaten = false
        this.applesEatenCounter++
        // ToDO if applesEatenCounter === matrix * matrix - 3 => YOU WON
      }
    },

    addToSnakeBody (x: number, y: number): void {
      this.snakeBodyCoordinates.push({ x, y })
      this.snakeBodyLength++
    },

    updateSnakeCoordinates (): void {
      const head: Coordinates = this.generateNewHeadCoordinates(this.snakeBodyCoordinates[0])
      this.snakeBodyCoordinates.unshift(head)
      if (head.x === this.appleCoordinates.x && head.y === this.appleCoordinates.y) {
        this.isAppleEaten = true
        this.snakeBodyLength++
        this.snakeTailTipCoordinates = null
      } else {
        this.snakeTailTipCoordinates = this.snakeBodyCoordinates.pop()
      }
      this.redrawChanges()
    },

    generateNewHeadCoordinates ({ x, y }: Coordinates): Coordinates {
      switch (this.direction) {
        case Direction.LEFT:
          return { x: this.checkSnakeWrap(x - 1), y: y }
        case Direction.RIGHT:
          return { x: this.checkSnakeWrap(x + 1), y: y }
        case Direction.UP:
          return { x: x, y: this.checkSnakeWrap(y - 1) }
        case Direction.DOWN:
          return { x: x, y: this.checkSnakeWrap(y + 1) }
      }
    },

    checkSnakeWrap (headIndex: number): number {
      if (headIndex > this.MATRIX_LENGTH - 1) return 0
      if (headIndex < 0) return this.MATRIX_LENGTH - 1
      return headIndex
    },

    checkForDirectionChange (event: KeyboardEvent): void {
      if (event.keyCode === 37 && this.direction !== Direction.RIGHT) this.changeDirection(Direction.LEFT)
      if (event.keyCode === 38 && this.direction !== Direction.DOWN) this.changeDirection(Direction.UP)
      if (event.keyCode === 39 && this.direction !== Direction.LEFT) this.changeDirection(Direction.RIGHT)
      if (event.keyCode === 40 && this.direction !== Direction.UP) this.changeDirection(Direction.DOWN)
    },

    changeDirection (newDirection: Direction): void {
      this.direction = newDirection
    },

    generateRandomApplePoint (): void {
      const copyOfSnakeBodyCoordinates: Coordinates[] = this.snakeBodyCoordinates

      if (this.snakeTailTipCoordinates !== null) {
        copyOfSnakeBodyCoordinates.push(this.snakeTailTipCoordinates)
        copyOfSnakeBodyCoordinates.shift()
      }

      this.appleCoordinates = randomApplePointFromMatrix(copyOfSnakeBodyCoordinates, this.labeledMatrix)
    },

    draw (x: number, y: number, color: string, type: DrawType): void {
      const rectSide = this.CANVAS_SIZE / this.MATRIX_LENGTH
      const canvas = document.getElementById('canvas')
      const drawingContext = canvas.getContext('2d')

      drawingContext.fillStyle = color

      type === DrawType.STOKE
        ? drawingContext.strokeRect(x, y, rectSide, rectSide)
        : drawingContext.fillRect(x, y, rectSide, rectSide)
    }
  },

  mounted () {
    this.CANVAS_SIZE = 500
    this.MATRIX_LENGTH = 20
    this.labeledMatrix = fillLabelledMatrix(this.MATRIX_LENGTH)

    this.init()

    setInterval(() => {
      this.updateSnakeCoordinates()
    }, 300)
  },

  beforeMount () {
    window.addEventListener('keydown', (event) => {
      this.checkForDirectionChange(event)
    })
  }
})
</script>

<style>
  .center {
    text-align: center;
  }

  .matrix-entry-size {
    display: inline-block;
    height:30.67px;
    width:30.67px;
    transform: scale(1,1.2)
  }

  .scaled-snake-body-piece {
    transform: scale(5.5) translate(0.1px, 5px);
  }

  .scaled-food {
    color: #ff0000;
    transform: scale(1.7) translate(0.2px, 1.5px);
  }

  .mt-5 {
    margin-top: 5rem;
  }
</style>
