// ToDo: this needs to be exported
type Coordinates = {
  x: number;
  y: number;
}

const createCoordinatesMatrix = function (matrixLength: number) {
  const coordinatesMatrix: {}[][] = [...Array(matrixLength).keys()].map(() => [...Array(matrixLength).keys()])

  for (let i = 0; i < matrixLength; i++) {
    for (let j = 0; j < matrixLength; j++) {
      coordinatesMatrix[i][j] = { x: j, y: i }
    }
  }

  return coordinatesMatrix
}

const randomBetweenMinMax = function (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

// ToDo: create unique function
// const unique = function (a) {
//   const seen = {}
//   const out = []
//   const len = a.length
//   let j = 0

//   for (let i = 0; i < len; i++) {
//     const item: number = a[i]
//     if (seen[item] !== 1) {
//       seen[item] = 1
//       out[j++] = item
//     }
//   }
//   return out
// }

const randomApplePointFromMatrix = function (snakeBodyCoordinate: Coordinates[], matrixLength: number): {} {
  const copyOfLabelledMatrix = createCoordinatesMatrix(matrixLength)

  // ToDo: this does not work because we've got objects
  const uniqueSnakeBody = [...new Set(snakeBodyCoordinate)]

  uniqueSnakeBody.map(it => {
    copyOfLabelledMatrix[it.y].splice(it.x, 1)
  })

  const flattenedCopyOfLabeledMatrix = copyOfLabelledMatrix.flat()
  const rndNumber = randomBetweenMinMax(0, flattenedCopyOfLabeledMatrix.length)

  return flattenedCopyOfLabeledMatrix[rndNumber]
}

export {
  randomBetweenMinMax,
  randomApplePointFromMatrix
}
