<template>
  <div id="app">
    <div
      v-for="(entry, index) in matrix"
      :key="index"
    >
      <span>{{ entry }}</span>
    </div>

    <p>{{ position }}</p>

    <p>{{ direction }}</p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import {
  randomBetweenMinMax,
  getFilledArrayWithZeros
} from './utils/index'

export default Vue.extend({
  data () {
    return {
      matrix: [],
      direction: '',
      position: ''
    }
  },

  methods: {
    /* Generate the terrain that is a (Size x Size) matrix */
    generateMatrix (size: number): void {
      if (size < 20) throw new Error('Size should be at least 20 x 20.')
      if (size % 2 !== 0) throw new Error('Size should be an even number')

      for (let i = 0; i < size; i++) {
        this.$data.matrix[i] = getFilledArrayWithZeros(size)
      }

      this.generateInitialSnakePosition(size)
    },

    /* Generate initial snake position and direction */
    generateInitialSnakePosition (size: number): void {
      const x = randomBetweenMinMax(2, size - 2)
      const y = randomBetweenMinMax(2, size - 2)
      this.$data.position = `${x}:${y}`
      this.$data.matrix[y][x] = 1

      this.$data.direction = this.calculateDirection(x, y, size)
    },

    /* Based on x, y, and the length of any axis, return up, down, left or right */
    calculateDirection (x: number, y: number, length: number): string {
      const middleOfTheAxis = length / 2

      /* Length is counted from 1 not from 0, so add one to the index */
      const xDirectionChance = length - x + 1
      const yDirectionChance = length - y + 1
      let xDirection = ''
      let yDirection = ''
      let direction = ''

      xDirectionChance >= middleOfTheAxis
        ? xDirection = 'right'
        : xDirection = 'left'

      yDirectionChance >= middleOfTheAxis
        ? yDirection = 'top'
        : yDirection = 'bottom'

      xDirectionChance > yDirectionChance
        ? direction = xDirection
        : direction = yDirection

      return direction
    }
  },

  beforeMount () {
    this.generateMatrix(20)
  }
})
</script>
