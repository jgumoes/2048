import { NextGridMaker, Direction, emptyGrid } from "../grid";
import * as importedTestGrids from './testGrids.json'

// Note: beforeAll should be used to instantiate the NextGridMaker classes
// .updateGrid() should clear everything every time it's called,
// and beforeAll will test this behaviour

const numberTestsArray = ["0", "1", "2", "3"]
const describeDirectionArray = [
  Direction.left,
  Direction.right,
  Direction.up,
  Direction.down
]
describe.each(describeDirectionArray)('when swipping %s:', (direction) => {
  let testGrid: NextGridMaker;
  const resultGrid = importedTestGrids[direction]
  beforeEach(()=>{
    testGrid = new NextGridMaker(direction, emptyGrid())
  })
  test.each(["0", "1", "2", "3"])(`swiping once moves and merges test grids correctly: testGrid %s`, (index) => {
    testGrid.updateGrid(importedTestGrids.inputs[index as keyof typeof importedTestGrids.inputs]);
    expect(testGrid.activeGrid).toStrictEqual(resultGrid[index as keyof typeof resultGrid])
  })

  test.each(numberTestsArray)('newTileLocation randomly produces a valid location: testGrid %s', (index) => {
    testGrid.updateGrid(importedTestGrids.inputs[index as keyof typeof importedTestGrids.inputs]);
    const {x, y} = testGrid.newTileLocation()
    expect(testGrid.activeGrid[y][x]).toBe(0)
  })
})

describe.each(describeDirectionArray)('newTileLocation produces the first valid location when swipping %s', (direction) => {
  let testGrid: NextGridMaker;
  beforeAll(()=>{
    testGrid = new NextGridMaker(direction, emptyGrid(), (nOfZeros)=>0)
  })

  test.each(numberTestsArray)('newTileLocation randomly produces a valid location: testGrid %s', (index) => {
    testGrid.updateGrid(importedTestGrids.inputs[index as keyof typeof importedTestGrids.inputs]);
    const {x, y} = testGrid.newTileLocation()
    expect(testGrid.activeGrid[y][x]).toBe(0)
  })
})

describe.each(describeDirectionArray)('newTileLocation produces the last valid location when swipping %s', (direction) => {
  let testGrid: NextGridMaker;
  beforeAll(()=>{
    testGrid = new NextGridMaker(direction, emptyGrid(), (nOfZeros)=>nOfZeros-1)
  })

  test.each(numberTestsArray)('newTileLocation randomly produces a valid location: testGrid %s', (index) => {
    testGrid.updateGrid(importedTestGrids.inputs[index as keyof typeof importedTestGrids.inputs]);
    const {x, y} = testGrid.newTileLocation()
    expect(testGrid.activeGrid[y][x]).toBe(0)
  })
})
