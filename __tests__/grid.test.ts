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

describe('initial grid', () => {
  test('is empty', () => {
    let grid = new Grid();
    expect(grid.activeGrid).toStrictEqual(emptyGrid())
  });
})

describe.each([
  [Direction.left, importedTestGrids.left],
  [Direction.right, importedTestGrids.right],
  [Direction.up, importedTestGrids.up],
  [Direction.down, importedTestGrids.down]
])('%s swiping once moves and merges test grids', (direction, resultGrid) => {

  class TestingGrid extends Grid{
    // why use spyOn when you can use inheritance babyeee! also spyOn didn't work, this is the only way to stop a new tile being added to the active grid
    placeNewTile = (newTileLocation: {'x': number, 'y': number}) => {}
  }

  test.each(["0", "1", "2", "3"])('testGrid %s', (index) => {
    let grid = new TestingGrid(importedTestGrids.inputs[index as keyof typeof importedTestGrids.inputs]);
    grid.swipe(direction)
    expect(grid.activeGrid).toStrictEqual(resultGrid[index as keyof typeof resultGrid])
  })
})

/* the second swipe is to ensure Grid holds its own reference to activeGrid */
describe.each([
  [Direction.left, importedTestGrids.left],
  [Direction.right, importedTestGrids.right],
  [Direction.up, importedTestGrids.up],
  [Direction.down, importedTestGrids.down]
])('grid moves and merges correctly when swiping %s ', (direction, resultGrids) => {
  const inputGrids = importedTestGrids.inputs
  class TestingGrid extends Grid{
    // why use spyOn when you can use inheritance babyeee! also spyOn didn't work, this is the only way to stop a new tile being added to the active grid
    newTile = () => {}
  }

  test.each([
    [Direction.left, "0"],
    [Direction.right, "1"],
    [Direction.up, "2"],
    [Direction.down, "3"]
  ])("then left", (direction2, index) => {
    let grid = new TestingGrid(inputGrids[index as keyof typeof inputGrids]);
    grid.swipe(direction)
    grid.swipe(direction2)
    expect(grid.activeGrid).toStrictEqual(resultGrids[direction2 as keyof typeof resultGrids])
  })
})

describe.each([
  [Direction.left, importedTestGrids.left],
  [Direction.right, importedTestGrids.right],
  [Direction.up, importedTestGrids.up],
  [Direction.down, importedTestGrids.down]
])('2 or 4 should replace a zero after moving and merging a grid, when swiping %s', (direction, resultGrids) => {
  const inputGrids = importedTestGrids.inputs

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