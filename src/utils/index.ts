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

const uniqueBody = function (array: Coordinates[]) {
  const seen = {}
  const out = []
  let j = 0

  for (let i = 0; i < array.length; i++) {
    const item = [array[i].x, array[i].y]
    if (seen[item] !== 1) {
      seen[item] = 1
      out[j++] = array[i]
    }
  }
  return out
}

const randomApplePointFromMatrix = function (uniqueSnakeBody: Coordinates[], matrixLength: number): {} {
  const startTime = performance.now()
  const copyOfLabelledMatrix = createCoordinatesMatrix(matrixLength)

  uniqueSnakeBody.map(it => {
    copyOfLabelledMatrix[it.y].splice(it.x, 1)
  })

  const flattenedCopyOfLabeledMatrix = copyOfLabelledMatrix.flat()
  const rndNumber = randomBetweenMinMax(0, flattenedCopyOfLabeledMatrix.length)

  return flattenedCopyOfLabeledMatrix[rndNumber]
}

export {
  randomBetweenMinMax,
  randomApplePointFromMatrix,
  uniqueBody
}
