import {NewGrid, emptyGrid } from "../grid";
import * as importedTestGrids from './newGridTestGrids.json'

describe('initialises', () => {
  test("with an empty grid", () => {
    let testGrid = new NewGrid();
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
    testGrid = new NewGrid()
    testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
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

  test('elements can be merged #1', () => {
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
      resultGrid.merging[0]
    )
  })

  test('elements can be merged #2', ()=>{
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.nextLine()
    testGrid.addNumber(4)
    testGrid.addNumber(2)
    testGrid.addNumber(4)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(64)
    testGrid.addNumber(32)
    testGrid.addNumber(32)
    expect(testGrid.activeGrid).toStrictEqual(
      resultGrid.merging[1]
    )
  })
})

describe.each([
  ["left", importedTestGrids.left],
  ["right", importedTestGrids.right],
  ["up", importedTestGrids.up],
  ["down", importedTestGrids.down]
])('newTileLocation randomly produces a valid location when swipping %s', (direction, resultGrid) => {
  let testGrid: NewGrid;
  beforeEach(() => {
    testGrid = new NewGrid()
    testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
  })

  test('1', () => {
    testGrid.addNumber(2);
    testGrid.addNumber(4);
    testGrid.addNumber(8);
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('2', () => {
    expect(testGrid.activeGrid).toStrictEqual(emptyGrid())
    testGrid.addNumber(2);
    testGrid.nextLine()
    testGrid.addNumber(4);
    testGrid.nextLine()
    testGrid.addNumber(8);
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('3', () => {
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
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('4', ()=>{
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.nextLine()
    testGrid.addNumber(4)
    testGrid.addNumber(2)
    testGrid.addNumber(4)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(64)
    testGrid.addNumber(32)
    testGrid.addNumber(32)
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })
})

describe.each([
  ["left", importedTestGrids.left],
  ["right", importedTestGrids.right],
  ["up", importedTestGrids.up],
  ["down", importedTestGrids.down]
])('newTileLocation produces the first valid location when swipping %s', (direction, resultGrid) => {
  let testGrid: NewGrid;
  beforeEach(() => {
    testGrid = new NewGrid((nOfZeros)=>1)
    testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
  })

  test('1', () => {
    testGrid.addNumber(2);
    testGrid.addNumber(4);
    testGrid.addNumber(8);
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('2', () => {
    expect(testGrid.activeGrid).toStrictEqual(emptyGrid())
    testGrid.addNumber(2);
    testGrid.nextLine()
    testGrid.addNumber(4);
    testGrid.nextLine()
    testGrid.addNumber(8);
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('3', () => {
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
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('4', ()=>{
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.nextLine()
    testGrid.addNumber(4)
    testGrid.addNumber(2)
    testGrid.addNumber(4)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(64)
    testGrid.addNumber(32)
    testGrid.addNumber(32)
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })
})

describe.each([
  ["left", importedTestGrids.left],
  ["right", importedTestGrids.right],
  ["up", importedTestGrids.up],
  ["down", importedTestGrids.down]
])('newTileLocation produces the last valid location when swipping %s', (direction, resultGrid) => {
  let testGrid: NewGrid;
  beforeEach(() => {
    testGrid = new NewGrid((nOfZeros)=>nOfZeros)
    testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
  })

  test('1', () => {
    testGrid.addNumber(2);
    testGrid.addNumber(4);
    testGrid.addNumber(8);
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('2', () => {
    expect(testGrid.activeGrid).toStrictEqual(emptyGrid())
    testGrid.addNumber(2);
    testGrid.nextLine()
    testGrid.addNumber(4);
    testGrid.nextLine()
    testGrid.addNumber(8);
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('3', () => {
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
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })

  test('4', ()=>{
    testGrid.addNumber(2)
    testGrid.addNumber(2)
    testGrid.nextLine()
    testGrid.addNumber(4)
    testGrid.addNumber(2)
    testGrid.addNumber(4)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.addNumber(8)
    testGrid.nextLine()
    testGrid.addNumber(64)
    testGrid.addNumber(32)
    testGrid.addNumber(32)
    const l = testGrid.newTileLocation()
    expect(testGrid.activeGrid[l.y][l.x]).toBe(0)
  })
})