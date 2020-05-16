/* Get a random integer between min and max */
const randomBetweenMinMax = function number (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

/* Inititialise array of size length, filled with 0s */
const getFilledArrayWithZeros = function number (length: number): number[] {
  return new Array(length).fill(0, 0, length)
}

export {
  randomBetweenMinMax,
  getFilledArrayWithZeros
}
