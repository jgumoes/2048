import Grid, { Direction } from "../grid";
import {emptyGrid} from "../grid";
import * as importedTestGrids from './testGrids.json'

/* note: a good test grid should include the following:
  0. it should be swipable in every direction, and the resulting grid should also be swipable in every direction
  1. a line that starts with a 0
  2. a line that contains {x, x, 2x}, that should result in {2x, 2x}
  3. a line that starts with the same number the previous line finished with (the previous number shouldn't've mergered) ((this was an actual bug))
  4. a line where a number moves without merging

  I have made a grid for each direction that follows 0-3, but made result grids for every
  grid in each direction. This means that 4 is definitely covered, plus increases the chance
  of stumbling accross a new bug I haven't thought of yet.
*/

const numberTestsArray = ["0", "1", "2", "3"]
const describeDirectionArray = [
  Direction.left,
  Direction.right,
  Direction.up,
  Direction.down
]

describe('initial grid', () => {
  test('is empty', () => {
    let grid = new Grid();
    expect(grid.activeGrid).toStrictEqual(emptyGrid())
  });
})

describe.each(describeDirectionArray)('%s swiping once moves and merges test grids', (direction) => {
  const resultGrids = importedTestGrids.resultGrids[direction]
  class TestingGrid extends Grid{
    // why use spyOn when you can use inheritance babyeee! also spyOn didn't work, this is the only way to stop a new tile being added to the active grid
    placeNewTile = (newTileLocation: {'x': number, 'y': number}) => {}
  }

  test.each(["0", "1", "2", "3"])('testGrid %s', (index) => {
    let grid = new TestingGrid(importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs]);
    grid.swipe(direction)
    expect(grid.activeGrid).toStrictEqual(resultGrids[index as keyof typeof resultGrids])
  })

  const scores = importedTestGrids.scores[direction]
  test.each(numberTestsArray)('and increases the score by the correct amount: testGrid %s', (index)=>{
    const startingScore = Math.floor(Math.random() * 100)
    let testGrid = new TestingGrid(importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs], startingScore);
    expect(testGrid.currentScore).toBe(startingScore)
    testGrid.swipe(direction)
    expect(testGrid.currentScore).toBe(startingScore + scores[index as keyof typeof scores])
  })

  test.todo("but doesn't change backButtonCount")

})

/* the second swipe is to ensure Grid holds its own reference to activeGrid */
describe.each(describeDirectionArray)('(double swipe) grid moves and merges correctly when swiping %s ', (direction) => {
  const inputGrids = importedTestGrids.numberedInputs
  const resultGrids = importedTestGrids.resultGrids[direction]

  class TestingGrid extends Grid{
    // why use spyOn when you can use inheritance babyeee! also spyOn didn't work, this is the only way to stop a new tile being added to the active grid
    placeNewTile = (newTileLocation: {'x': number, 'y': number}) => {}
  }

  test.each([
    [Direction.left, "0"],
    [Direction.right, "1"],
    [Direction.up, "2"],
    [Direction.down, "3"]
  ])("then %s", (direction2, index) => {
    let grid = new TestingGrid(inputGrids[index as keyof typeof inputGrids]);
    grid.swipe(direction)
    grid.swipe(direction2)
    expect(grid.activeGrid).toStrictEqual(resultGrids[direction2 as keyof typeof resultGrids])
  })

  const scores = importedTestGrids.scores[direction]
  test.each([
    [Direction.left, "0"],
    [Direction.right, "1"],
    [Direction.up, "2"],
    [Direction.down, "3"]
  ])('and increases the score by the correct amount: testGrid %s', (direction2, index)=>{
    const startingScore = Math.floor(Math.random() * 100)
    let testGrid = new TestingGrid(importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs], startingScore);
    expect(testGrid.currentScore).toBe(startingScore)
    testGrid.swipe(direction)
    testGrid.swipe(direction2)
    expect(testGrid.currentScore).toBe(startingScore + scores[direction2])
  })

  test.todo("but doesn't change backButtonCount")
})

describe.each(describeDirectionArray)('2 or 4 should replace a zero after moving and merging a grid, when swiping %s', (direction) => {
  const inputGrids = importedTestGrids.numberedInputs
  const resultGrids = importedTestGrids.resultGrids[direction]

  test.each(["0", "1", "2", "3"])('testGrid %s', (index) => {
    let grid = new Grid(inputGrids[index as keyof typeof inputGrids]);
    grid.swipe(direction)

    const closeResult = resultGrids[index as keyof typeof resultGrids]
    var closeZeros = 0;
    var gridZeros = 0;
    var newTileValue = 0;
    for(var y = 0; y < grid.gridSize; y++) {
      for(var x = 0; x< grid.gridSize; x++){
        if(closeResult[y][x] !== 0){
          // all non-zero values in closeResult should match activeGrid 
          expect(grid.activeGrid[y][x]).toEqual(closeResult[y][x])
        }
        else{
          closeZeros++;
          if(grid.activeGrid[y][x] !== 0){
            newTileValue = grid.activeGrid[y][x]
          }
          else{
            gridZeros++;
          }
        }
      }
    }
    expect(closeZeros - gridZeros).toEqual(1) // only one zero-value tile should be different
    expect([2, 4]).toContain(newTileValue)    // and that tile should be 2 or 4
  })
})

describe.each(describeDirectionArray)("when the grid can't be swiped %s", (direction)=> {
  const startingScore = Math.floor(Math.random() * 100)
  let testGrid: Grid
  beforeAll(()=>{
    testGrid = new Grid(importedTestGrids.gameOverInputs.noSwipe, startingScore)
  })

  test(".swipe() will return false", ()=>{
    const canBeSwiped = testGrid.swipe(direction)
    expect(canBeSwiped).toBe(false)
  })

  test("the score won't change", ()=>{
    expect(testGrid.currentScore).toBe(startingScore)
    testGrid.swipe(direction)
    expect(testGrid.currentScore).toBe(startingScore)
  })

  test.todo("backButtonCount won't change")
})

describe.each(describeDirectionArray)("when swiping %s into a losing game", (direction)=>{
  const startingGrid = importedTestGrids.gameOverInputs[direction]
  let testGrid: Grid
  beforeEach(()=>{
    testGrid = new Grid(startingGrid, 0)
  })

  test("gameOver becomes true", ()=>{
    expect(testGrid.gameOver).toBe(false)
    testGrid.swipe(direction)
    expect(testGrid.gameOver).toBe(true)
  })

  test.todo("pressing the back button still works though")
})

describe.each([
  ["once", 1],
  ["more than once", 5]
])("when the back button is pressed %s", (title, count)=>{
  test.todo("grid reverts to previous grid")

  test.todo(".previousGrid becomes null")

  test.todo("score reverts to previous score")

  test.todo("backButtonCount increases by 1")

})

describe.each(describeDirectionArray)("if .swipe(%s) is called before nextGrids have finished computing, activeGrid updates correctly", (direction)=>{

  test.todo(`if only nextGrid[${direction}] has been computed`)
  test.todo(`if nextGrid[${direction}] hasn't been computed yet`)
})