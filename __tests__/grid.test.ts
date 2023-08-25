import Grid, { Direction, colorTestGrid } from "../grid";
import {emptyGrid} from "../grid";
import { ControlledPlaceGrid, NoPlaceGrid } from "./helpers/gridMocks";
import importedTestGrids from './helpers/testGrids'

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
  test('is not empty', () => {
    let grid = new Grid({gridSize: 4});

    const closeResult = emptyGrid()
    var closeZeros = 16;
    var gridZeros = 0;
    for(var y = 0; y < grid.gridSize; y++) {
      for(var x = 0; x < grid.gridSize; x++){
        if(closeResult[y][x] !== 0){
          // all non-zero values in closeResult should match activeGrid 
          expect(grid.activeGrid[y][x]).toEqual(closeResult[y][x])
        }
        else{
          if(grid.activeGrid[y][x] !== 0){
            expect([2, 4]).toContain(grid.activeGrid[y][x])
          }
          else{
            gridZeros++;
          }
        }
      }
    }
    expect(closeZeros - gridZeros).toEqual(2) // only one zero-value tile should be different
  });
})

describe.each(describeDirectionArray)('%s swiping once moves and merges test grids', (direction) => {
  const resultGrids = importedTestGrids.resultGrids[direction]
  

  test.each(["0", "1", "2", "3"])('testGrid %s', (index) => {
    let grid = new NoPlaceGrid({grid: importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs]});
    grid.swipe(direction)
    expect(grid.activeGrid).toStrictEqual(resultGrids[index as keyof typeof resultGrids])
  })

  const scores = importedTestGrids.scores[direction]
  test.each(numberTestsArray)('and increases the score by the correct amount: testGrid %s', (index)=>{
    const startingScore = Math.floor(Math.random() * 100)
    let testGrid = new NoPlaceGrid({
      grid: importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs],
      score: startingScore
    });
    expect(testGrid.currentScore).toBe(startingScore)
    testGrid.swipe(direction)
    expect(testGrid.currentScore).toBe(startingScore + scores[index as keyof typeof scores])
  })

  test.each(["0", "1", "2", "3"])("but doesn't change backButtonCount", (index) => {
    let testGrid = new NoPlaceGrid({grid: importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs]});
    const backButtonCount = testGrid.undoCount
    testGrid.swipe(direction)
    expect(testGrid.undoCount).toBe(backButtonCount)
  })
})

/* the second swipe is to ensure Grid holds its own reference to activeGrid */
describe.each(describeDirectionArray)('(double swipe) grid moves and merges correctly when swiping %s ', (direction) => {
  const inputGrids = importedTestGrids.numberedInputs
  const resultGrids = importedTestGrids.resultGrids[direction]

  test.each([
    [Direction.left, "0"],
    [Direction.right, "1"],
    [Direction.up, "2"],
    [Direction.down, "3"]
  ])("then %s", (direction2, index) => {
    let grid = new NoPlaceGrid({grid: inputGrids[index as keyof typeof inputGrids]});
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
    let testGrid = new NoPlaceGrid({
      grid: importedTestGrids.numberedInputs[index as keyof typeof importedTestGrids.numberedInputs],
      score: startingScore
    });
    expect(testGrid.currentScore).toBe(startingScore)
    testGrid.swipe(direction)
    testGrid.swipe(direction2)
    expect(testGrid.currentScore).toBe(startingScore + scores[direction2])
  })

  test.each([
    [Direction.left, "0"],
    [Direction.right, "1"],
    [Direction.up, "2"],
    [Direction.down, "3"]
  ])("and %s but doesn't change backButtonCount", (direction2, index)=>{
    let testGrid = new NoPlaceGrid({grid: inputGrids[index as keyof typeof inputGrids]});
    const backButtonCount = testGrid.undoCount
    testGrid.swipe(direction)
    testGrid.swipe(direction2)
    expect(testGrid.undoCount).toBe(backButtonCount)
  })
})

describe.each(describeDirectionArray)('2 or 4 should replace a zero after moving and merging a grid, when swiping %s', (direction) => {
  const inputGrids = importedTestGrids.numberedInputs
  const resultGrids = importedTestGrids.resultGrids[direction]

  test.each(["0", "1", "2", "3"])('testGrid %s', (index) => {
    let grid = new Grid({grid: inputGrids[index as keyof typeof inputGrids]});
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
    testGrid = new Grid({
      grid: importedTestGrids.gameOverInputs.noSwipe,
      score: startingScore
    })
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

  test("backButtonCount won't change", ()=>{
    const backButtonCount = testGrid.undoCount
    testGrid.swipe(direction)
    expect(testGrid.undoCount).toBe(backButtonCount)
  })
})

describe.each(describeDirectionArray)("when swiping %s into a losing game", (direction)=>{
  const startingGrid = importedTestGrids.gameOverInputs[direction]
  let testGrid: Grid
  beforeEach(()=>{
    testGrid = new Grid({grid: startingGrid, score: 10000})
  })

  test("gameOver becomes true", ()=>{
    expect(testGrid.isGameOver).toBe(false)
    testGrid.swipe(direction)
    expect(testGrid.isGameOver).toBe(true)
  })

  test("pressing the back button still works though", () =>{
    const backButtonCount = testGrid.undoCount
    const score = testGrid.currentScore
    testGrid.swipe(direction)
    testGrid.undo()
    expect(testGrid.currentScore).toBe(score)
    expect(testGrid.undoCount).toBe(backButtonCount + 1)
    expect(testGrid.isGameOver).toBe(false)
  })
})

describe('reseting the grid', ()=>{

  let testGrid: ControlledPlaceGrid
  beforeEach(()=>{
    testGrid = new ControlledPlaceGrid({grid: colorTestGrid(), score: 500000})
    testGrid.reset()
  })

  test('resets the active grid', ()=>{
    const nonZeroTiles = testGrid.activeGrid.flat().filter(value => value > 0)
    expect(nonZeroTiles.length).toBe(2)
    expect([2, 4]).toContain(nonZeroTiles[0])
    expect([2, 4]).toContain(nonZeroTiles[1])
    expect(testGrid.activeGrid).toStrictEqual([
      [ 0, 0, 0, 0], 
      [ 0, 2, 0, 0], 
      [ 0, 0, 2, 0], 
      [ 0, 0, 0, 0]
    ])
  })

  test('isGameOver is false', ()=>{
    expect(testGrid.isGameOver).toBe(false)
  })

  test('resets the score', ()=>{
    expect(testGrid.currentScore).toBe(0)
  })

  test.each(describeDirectionArray)('resets the %s nextGrid', (direction)=>{
    testGrid.swipe(direction);
    expect(testGrid.activeGrid).toStrictEqual(importedTestGrids.afterResetGrids[direction])
  })

  test('resets the back button count', () => {
    expect(testGrid.undoCount).toBe(0)
  })

  test('pressing the back button does nothing', () => {
    // more specifically, doesn't raise an error
    const activeGrid = testGrid.activeGrid
    testGrid.undo();
    expect(testGrid.undoCount).toBe(0)
    expect(testGrid.activeGrid).toStrictEqual(activeGrid)
  })
})

describe.each([
  ["once", 1],
  ["more than once", 5]
])("when the back button is pressed %s", (title, count)=>{
  let testGrid: Grid
  const initialGrid = importedTestGrids.numberedInputs[0]
  const initialScore = 10000
  beforeEach(()=>{
    testGrid = new Grid({
      grid: initialGrid,
      score: initialScore
    })
    testGrid.swipe(Direction.left)
    for(let i = 0; i < count; i++){ testGrid.undo() }
  })

  test("grid reverts to previous grid", () => {
    expect(testGrid.activeGrid).toStrictEqual(initialGrid)
  })

  test("score reverts to previous score", () =>{
    expect(testGrid.currentScore).toBe(initialScore)
  })

  test("backButtonCount increases by 1", () =>{
    expect(testGrid.undoCount).toBe(1)
  })

  test("nothing happens when the grid is fresh", ()=>{
    // more specifically, no uncaught errors occur
    testGrid = new Grid({
      grid: initialGrid,
      score: initialScore
    })
    for(let i = 0; i < count; i++){ testGrid.undo() }
    expect(testGrid.activeGrid).toStrictEqual(initialGrid)
    expect(testGrid.currentScore).toBe(initialScore)
    expect(testGrid.undoCount).toBe(0)
  })
})

describe.each(describeDirectionArray)("if .swipe(%s) is called before nextGrids have finished computing, activeGrid updates correctly", (direction)=>{
  // actually, it would be better for all swiping to be rejected until the animations have completed.
  test.todo(`if only nextGrid[${direction}] has been computed`)
  test.todo(`if nextGrid[${direction}] hasn't been computed yet`)
})