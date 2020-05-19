const randomBetweenMinMax = function number (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

const getFilledArrayWithZeros = function number (length: number): number[] {
  return new Array(length).fill(0, 0, length)
}

export {
  randomBetweenMinMax,
  getFilledArrayWithZeros
}
