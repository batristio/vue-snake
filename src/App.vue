<template>
  <div id="app" class="center">
    <p>Snake body length: {{ snakeBodyCoordinates.length }}</p>
    <p>Unique body length: {{ uniqueSnakeBodyCoordinates.length }}</p>
    <canvas id="canvas" class="mt-5 border-2"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  randomBetweenMinMax,
  randomApplePointFromMatrix,
  uniqueBody
} from './utils/index'

enum DrawType {
  OUTLINE,
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
  CANVAS_SIZE: number;
  MATRIX_LENGTH: number;
  snakeBodyCoordinates: Coordinates[];
  uniqueSnakeBodyCoordinates: Coordinates[];
  snakeTailTipCoordinates: Coordinates | null;
  snakeBodyLength: number;
  direction: Direction;
  appleCoordinates: Coordinates;
  isAppleEaten: boolean;
  applesEatenCounter: number;
  canvas: HTMLElement | null;
  drawingContext: Record <string, any>;
  rectSide: number;
}

export default defineComponent({
  data (): GameState {
    return {
      CANVAS_SIZE: 0,
      MATRIX_LENGTH: 0,
      snakeBodyCoordinates: [],
      uniqueSnakeBodyCoordinates: [],
      snakeTailTipCoordinates: null,
      snakeBodyLength: 0,
      direction: Direction.LEFT,
      appleCoordinates: { x: 0, y: 0 },
      isAppleEaten: false,
      applesEatenCounter: 0,
      canvas: null,
      drawingContext: {},
      rectSide: 0
    }
  },

  methods: {
    init (): void {
      if (this.MATRIX_LENGTH < 20) throw new Error('Size should be at least 20 x 20.')
      if (this.MATRIX_LENGTH % 2 !== 0) throw new Error('Size should be an even number')

      this.initializeCanvas()

      this.generateInitialSnakePosition(this.MATRIX_LENGTH)
      this.generateRandomApplePoint()

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
      this.snakeBodyCoordinates.forEach(({ x, y }: Coordinates) => {
        this.draw(x * this.rectSide, y * this.rectSide, 'rgb(0, 0, 0)', DrawType.FILL)
      })

      if (this.snakeTailTipCoordinates !== null) {
        const x = this.snakeTailTipCoordinates.x * this.rectSide
        const y = this.snakeTailTipCoordinates.y * this.rectSide
        this.draw(x, y, 'rgb(255, 255, 255)', DrawType.FILL)
      }

      if (this.isAppleEaten === true || this.applesEatenCounter === 0) {
        this.generateRandomApplePoint()
        this.draw(this.appleCoordinates.x * this.rectSide, this.appleCoordinates.y * this.rectSide, 'rgb(255, 0, 0)', DrawType.FILL)
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
      this.uniqueSnakeBodyCoordinates = uniqueBody(this.snakeBodyCoordinates)
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
      if (event.key === 'ArrowUp' && this.direction !== Direction.DOWN) this.changeDirection(Direction.UP)
      if (event.key === 'ArrowDown' && this.direction !== Direction.UP) this.changeDirection(Direction.DOWN)
      if (event.key === 'ArrowLeft' && this.direction !== Direction.RIGHT) this.changeDirection(Direction.LEFT)
      if (event.key === 'ArrowRight' && this.direction !== Direction.LEFT) this.changeDirection(Direction.RIGHT)
    },

    changeDirection (newDirection: Direction): void {
      this.direction = newDirection
    },

    generateRandomApplePoint (): void {
      const copyOfSnakeBodyCoordinates: Coordinates[] = this.snakeBodyCoordinates.slice()

      if (this.snakeTailTipCoordinates !== null) {
        copyOfSnakeBodyCoordinates.push(this.snakeTailTipCoordinates)
        copyOfSnakeBodyCoordinates.shift()
      }
      this.appleCoordinates = randomApplePointFromMatrix(copyOfSnakeBodyCoordinates, this.MATRIX_LENGTH)
    },

    initializeCanvas (): void {
      this.canvas = document.getElementById('canvas')
      this.drawingContext = this.canvas.getContext('2d')

      this.drawingContext.canvas.width = this.drawingContext.canvas.height = this.CANVAS_SIZE

      this.rectSide = this.CANVAS_SIZE / this.MATRIX_LENGTH
    },

    draw (x: number, y: number, color: string, type: DrawType): void {
      this.drawingContext.fillStyle = color

      type === DrawType.OUTLINE
        ? this.drawingContext.strokeRect(x, y, this.rectSide, this.rectSide)
        : this.drawingContext.fillRect(x, y, this.rectSide, this.rectSide)
    }
  },

  mounted () {
    this.CANVAS_SIZE = 500
    this.MATRIX_LENGTH = 20

    this.init()

    setInterval(() => {
      this.updateSnakeCoordinates()
    }, 100)
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

  .mt-5 {
    margin-top: 5rem;
  }

  .border-2 {
    border: 2px solid black;
  }
</style>
