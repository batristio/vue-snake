<template>
  <div id="app">
    <div
      v-for="(entry, index) in matrix"
      :key="index"
    >
      <span>{{ entry }}</span>
    </div>

    <p>{{ position }}</p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import {
  randomBetweenMinMax,
  getFilledArrayWithZeros
} from './utils/index'

enum Direction {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM
}

export default Vue.extend({
  data () {
    return {
      matrix: [],
      direction: '',
      position: '',
      snakeBody: [{}]
    }
  },

  methods: {
    generateMatrix (size: number): void {
      if (size < 20) throw new Error('Size should be at least 20 x 20.')
      if (size % 2 !== 0) throw new Error('Size should be an even number')

      for (let i = 0; i < size; i++) {
        this.$data.matrix[i] = getFilledArrayWithZeros(size)
      }

      this.generateInitialSnakePosition(size)
      this.$data.matrix.reverse()
    },

    generateInitialSnakePosition (size: number): void {
      const x = randomBetweenMinMax(2, size - 2)
      const y = randomBetweenMinMax(2, size - 2)
      this.$data.position = `${x}:${y}`
      this.$data.matrix[y][x] = 1

      this.$data.direction = this.calculateDirection(x, y, size)

      switch (this.$data.direction) {
        case Direction.LEFT:
          this.$data.matrix[y][x + 1] = 1
          this.$data.matrix[y][x + 2] = 1
          break
        case Direction.RIGHT:
          this.$data.matrix[y][x - 1] = 1
          this.$data.matrix[y][x - 2] = 1
          break
        case Direction.TOP:
          this.$data.matrix[y + 1][x] = 1
          this.$data.matrix[y + 2][x] = 1
          break
        case Direction.BOTTOM:
          this.$data.matrix[y - 1][x] = 1
          this.$data.matrix[y - 2][x] = 1
          break
      }
    },

    calculateDirection (x: number, y: number, length: number): Direction {
      const middleOfTheAxis = length / 2

      const xDirectionChance = length - x + 1
      const yDirectionChance = length - y + 1

      const xDirection = xDirectionChance >= middleOfTheAxis ? Direction.RIGHT : Direction.LEFT
      const yDirection = yDirectionChance >= middleOfTheAxis ? Direction.TOP : Direction.BOTTOM

      return xDirectionChance > yDirectionChance ? xDirection : yDirection
    }
  },

  beforeMount () {
    this.generateMatrix(20)
  }
})
</script>
