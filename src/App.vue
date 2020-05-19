<template>
  <div
    id="app"
    class="center"
  >
    <div
      v-for="(row, i) in matrix"
      :key="i"
    >
      <span
        v-for="(element, j) in row"
        :key="j"
      >
        <span
          v-if="element === '&squf;'"
          v-html="element"
          class="matrix-entry-size scaled-snake-body-piece"
        />
        <span
          v-else
          v-html="element"
          class="matrix-entry-size"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import {
  randomBetweenMinMax,
  getFilledArrayWithSymbols
} from './utils/index'

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
  matrix: string[][];
  snakeBodyCoordinates: Coordinates[];
  snakeTailTipCoordinates: Coordinates | null;
  snakeBodyLength: number;
  direction: Direction | null;
}

export default Vue.extend({
  data (): GameState {
    return {
      matrix: [],
      snakeBodyCoordinates: [],
      snakeTailTipCoordinates: null,
      snakeBodyLength: 0,
      direction: null
    }
  },

  methods: {
    generateMatrix (size: number): void {
      if (size < 20) throw new Error('Size should be at least 20 x 20.')
      if (size % 2 !== 0) throw new Error('Size should be an even number')

      for (let i = 0; i < size; i++) {
        this.matrix[i] = getFilledArrayWithSymbols(size)
      }

      this.generateInitialSnakePosition(size)
      this.updateMatrix()
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

    updateMatrix (): void {
      if (this.snakeTailTipCoordinates !== null) {
        const lastBodyIndexCoordinateX = this.snakeTailTipCoordinates.x
        const lastBodyIndexCoordinateY = this.snakeTailTipCoordinates.y
        this.matrix[lastBodyIndexCoordinateY][lastBodyIndexCoordinateX] = '&nbsp;&blk14;&blk14;&nbsp;'
      }

      this.snakeBodyCoordinates.forEach(({ x, y }: Coordinates) => {
        this.matrix[y][x] = '&squf;'
      })

      this.matrix = this.matrix.slice()
    },

    addToSnakeBody (x: number, y: number): void {
      this.snakeBodyCoordinates.push({ x, y })
      this.snakeBodyLength++
    },

    updateSnakeCoordinates (): void {
      const head: Coordinates = this.generateNewHeadCoordinates(this.snakeBodyCoordinates[0])
      this.snakeBodyCoordinates.unshift(head)
      this.snakeTailTipCoordinates = this.snakeBodyCoordinates.pop()
      this.updateMatrix()
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
      if (headIndex > this.matrix.length - 1) return 0
      if (headIndex < 0) return this.matrix.length - 1
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
    }

  },

  mounted () {
    setInterval(() => {
      this.updateSnakeCoordinates()
    }, 300)
  },

  beforeMount () {
    this.generateMatrix(30)

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

  .scaled-food,
  .scaled-snake-body-piece {
    transform: scale(5.5) translate(0.1px, 5px);
  }

  .scaled-food {
    color: #ff0000;
  }
</style>
