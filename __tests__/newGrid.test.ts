import {NewGrid, emptyGrid } from "../grid";
import * as importedTestGrids from './testGrids.json'

describe('initialises', () => {
  test("with an empty grid", () => {
    let testGrid = new NewGrid("left");
    expect(testGrid.activeGrid).toStrictEqual(emptyGrid())
  })
})

describe.each([
  ["left", importedTestGrids.left],
  ["right", importedTestGrids.right],
  ["up", importedTestGrids.up],
  ["down", importedTestGrids.down]
])('when swipping %s', (direction, resultGrid) => {
  let testGrid: NewGrid;
  beforeEach(() => {
    testGrid = new NewGrid(<"left" | "right" | "up" | "down">direction)
  })
  test('new elements can be added on one line', () => {
    testGrid.addNumber(2);
    testGrid.addNumber(4);
    testGrid.addNumber(8);
    expect(testGrid.activeGrid).toStrictEqual(
      resultGrid.swipping.oneLine
    )
  })

  test('new elements can be added on different lines', () => {
    expect(testGrid.activeGrid).toStrictEqual(emptyGrid())
    testGrid.addNumber(2);
    testGrid.nextLine()
    testGrid.addNumber(4);
    testGrid.nextLine()
    testGrid.addNumber(8);
    expect(testGrid.activeGrid).toStrictEqual(
      resultGrid.swipping.multiline
    )
  })

  test('elements can be merged', () => {
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.nextLine()
    testGrid.addNumber(4)
    testGrid.addNumber(4)
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.nextLine()
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.addNumber(4)
    testGrid.nextLine()
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.addNumber(4)
    testGrid.addNumber(4)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    expect(testGrid.activeGrid).toStrictEqual(
      resultGrid.merging
    )
  })
})