const randomBetweenMinMax = function number (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

const getFilledArrayWithZeros = function number (length: number): string[] {
  return new Array(length).fill('&nbsp;&blk14;&blk14;&nbsp;', 0, length)
}

export {
  randomBetweenMinMax,
  getFilledArrayWithZeros
}
