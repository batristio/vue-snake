const randomBetweenMinMax = function number (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

const getFilledArrayWithSymbols = function number (length: number): string[] {
  return new Array(length).fill('&nbsp;&blk14;&blk14;&nbsp;', 0, length)
}

const randomBetweenMinMaxExcept = function number (min: number, max: number, except: number[]): number {
  const theNumber = randomBetweenMinMax(min, max)
  return except.find(it => it === theNumber) === undefined
    ? theNumber
    : (
      except.push(theNumber),
      randomBetweenMinMaxExcept(min, max, except)
    )
}

export {
  randomBetweenMinMax,
  getFilledArrayWithSymbols,
  randomBetweenMinMaxExcept
}
