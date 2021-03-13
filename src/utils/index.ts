// ToDo: this needs to be exported
type Coordinates = {
  x: number;
  y: number;
}

const fillLabelledMatrix = function (matrixLength: number) {
  const labelledMatrix: {}[][] = [...Array(30).keys()].map(() => [...Array(30).keys()])

  for (let i = 0; i < matrixLength; i++) {
    for (let j = 0; j < matrixLength; j++) {
      labelledMatrix[i][j] = { x: j, y: i }
    }
  }

  return labelledMatrix
}

const randomBetweenMinMax = function (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

const getFilledArrayWithSymbols = function (length: number): string[] {
  return new Array(length).fill('&nbsp;&blk14;&blk14;&nbsp;', 0, length)
}

const randomApplePointFromMatrix = function (snakeBodyCoordinate: Coordinates[], labeledMatrix: {}[][]): {} {
  snakeBodyCoordinate.forEach(it => function () {
    labeledMatrix[it.y].splice(it.x, 1)
  })
  const flattenedLabeledMatrix = labeledMatrix.flat()
  return flattenedLabeledMatrix[randomBetweenMinMax(0, flattenedLabeledMatrix.length)]
}

export {
  randomBetweenMinMax,
  getFilledArrayWithSymbols,
  randomApplePointFromMatrix,
  fillLabelledMatrix
}
