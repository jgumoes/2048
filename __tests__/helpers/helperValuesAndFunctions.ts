import { Direction } from "../../src/grid"
import { screen } from '@testing-library/react-native'

export const numberTestsArray = ["0", "1", "2", "3"]
export const directionValueArray = [
  Direction.left,
  Direction.right,
  Direction.up,
  Direction.down
]

export const makeSnapshot = (testScreen: typeof screen) => {
  return JSON.stringify(screen.toJSON())
}