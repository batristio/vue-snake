<template>
  <div id="app">
    <div
      v-for="(row, index) in matrix"
      :key="index"
    >
      <span>{{ row }}</span>
    </div>

    <div style="margin-top: 20px;">
      <button @click="updateSnakeCoordinates">
        Next iteration
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import {
  randomBetweenMinMax,
  getFilledArrayWithZeros
} from './utils/index'

enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down'
}

type Coordinates = {
  x: number;
  y: number;
}

type GameState = {
  matrix: number[][];
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
        this.matrix[i] = getFilledArrayWithZeros(size)
      }

      this.generateInitialSnakePosition(size)
      this.matrix.reverse()
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
      const yDirection = yDirectionChance >= middleOfTheAxis ? Direction.UP : Direction.DOWN

      return xDirectionChance > yDirectionChance ? xDirection : yDirection
    },

    updateMatrix (): void {
      this.matrix = this.matrix.slice()
      this.snakeBodyCoordinates.forEach(({ x, y }: Coordinates) => {
        Vue.set(this.matrix[y], x, 1)
      })
      if (this.snakeTailTipCoordinates !== null) {
        const lastBodyIndexCoordinateX = this.snakeTailTipCoordinates.x
        const lastBodyIndexCoordinateY = this.snakeTailTipCoordinates.y
        Vue.set(this.matrix[lastBodyIndexCoordinateY], lastBodyIndexCoordinateX, 0)
      }
    },

    addToSnakeBody (x: number, y: number): void {
      this.snakeBodyCoordinates.push({ x, y })
    },

    updateSnakeCoordinates (): void {
      const head: Coordinates = this.generateNewHeadCoordinate(
        this.snakeBodyCoordinates[0]
      )
      this.snakeBodyCoordinates.unshift(head)
      this.snakeTailTipCoordinates = this.snakeBodyCoordinates.pop()
      this.updateMatrix()
    },

    generateNewHeadCoordinate ({ x, y }: Coordinates): Coordinates {
      switch (this.direction) {
        case Direction.LEFT:
          return { x: x - 1, y: y }
        case Direction.RIGHT:
          return { x: x + 1, y: y }
        case Direction.UP:
          return { x: x, y: y + 1 }
        case Direction.DOWN:
          return { x: x, y: y - 1 }
      }
    }

  },

  beforeMount () {
    this.generateMatrix(20)
  }
})
</script>
