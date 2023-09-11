import { NextGridMaker, Direction, emptyGrid, chooseA0 } from "../src/grid";
import importedTestGrids from './helpers/testGrids'

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
  const resultGrid = importedTestGrids.resultGrids[direction]
  const scores = importedTestGrids.scores[direction]
  beforeEach(()=>{
    testGrid = new NextGridMaker(direction, emptyGrid())
  })
  test.each(["0", "1", "2", "3"])(`swiping once moves and merges test grids correctly: testGrid %s`, (index) => {
    testGrid.updateGrid(importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs]);
    expect(testGrid.activeGrid).toStrictEqual(resultGrid[index as keyof typeof resultGrid])
  })

  test.each(numberTestsArray)('newTileLocation randomly produces a valid location: testGrid %s', (index) => {
    testGrid.updateGrid(importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs]);
    const {x, y} = testGrid.newTileLocation()
    expect(testGrid.activeGrid[y][x]).toBe(0)
  })

  test.each(numberTestsArray)('the correct score is calculated: testGrid %s', (index)=>{
    expect(testGrid.mergeScore).toBe(0)
    testGrid.updateGrid(importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs]);
    expect(testGrid.mergeScore).toBe(scores[index as keyof typeof scores])
  })

})

describe.each(describeDirectionArray)('newTileLocation only produces valid locations when swipping %s', (direction) => {
  const resultGrids = importedTestGrids.resultGrids[direction]
  let testGrid: NextGridMaker;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let numberOfZeros: number;
  let zeroIndex: number;
  beforeEach(()=>{
    zeroIndex = 0
    numberOfZeros = 10;
    testGrid = new NextGridMaker(direction, emptyGrid(), (nOfZeros)=>{
      numberOfZeros = nOfZeros
      return zeroIndex
    })
  })

  test.each(numberTestsArray)('testGrid %s', (testIndex) => {
    const resultNumberOfZeros = resultGrids[testIndex as keyof typeof resultGrids].flat().filter((value)=>value===0).length
    while(zeroIndex < resultNumberOfZeros){
      testGrid.updateGrid(importedTestGrids.numberedInputs[testIndex as keyof typeof importedTestGrids.numberedInputs]);
      const {x, y} = testGrid.newTileLocation()
      expect(testGrid.activeGrid[y][x]).toBe(0)
      zeroIndex++
    }
    const zerosInGrid = testGrid.activeGrid.flat().filter((value)=>value===0).length
    expect(zerosInGrid).toBe(resultNumberOfZeros)
  })
})

test("chooseA0 will not go out of bounds over X% of runs", ()=>{
  // TODO: what is the actual percentage?
  let roll
  for (let index = 0; index < 100000; index++) {
    roll = chooseA0(9)
    if(!((roll >= 0) && (roll < 9))){console.log(roll)}
    expect((roll >= 0) && (roll < 9)).toBe(true)
  }
})

describe.each(describeDirectionArray)("when swiping %s, .canBeSwiped", (direction)=>{
  let testGrid: NextGridMaker
  beforeEach(()=>{
    testGrid = new NextGridMaker(direction, emptyGrid());
  })
  test(`is true when the grid can be swiped ${direction}`, ()=>{
    const canBeSwiped = testGrid.updateGrid(importedTestGrids.numberedInputs[0]);
    expect(canBeSwiped).toBe(true)
    expect(testGrid.canBeSwiped).toBe(true)
  })

  test(`is false when the grid can't be swiped ${direction}`,()=>{
    const canBeSwiped = testGrid.updateGrid(importedTestGrids.gameOverInputs.noSwipe)
    expect(canBeSwiped).toBe(false)
    expect(testGrid.canBeSwiped).toBe(false)
  })
})
