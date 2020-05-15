<template>
  <div id="app">
    <div
      v-for="(entry, index) in matrix"
      :key="index"
    >
      <span>{{ entry }}</span> {{ index }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { random } from './utils/index'

export default Vue.extend({
  data () {
    return {
      matrix: [],
      direction: 'right',
      position: ''
    }
  },
  methods: {
    generateMatrix (size: number): void {
      if (size < 20) throw new Error('Size should be at least 20 x 20.')

      for (let i = 0; i < size; i++) {
        this.$data.matrix[i] = this.getFilledArrayWithZeros(size)
      }

      this.generateInitialSnakePosition('', size)
    },
    generateInitialSnakePosition (direction: string, size: number): void {
      const x = random(2, size - 2)
      const y = random(2, size - 2)
      this.$data.position = `${x}:${y}`
      this.$data.matrix[x][y] = 1
    },
    getFilledArrayWithZeros (size: number): number[] {
      return new Array(size).fill(0, 0, size)
    }
  },
  beforeMount () {
    this.generateMatrix(20)
  }
})
</script>
