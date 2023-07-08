import Grid from "../grid";
import {emptyGrid} from "../grid";
import * as importedTestGrids from './testGrids.json'

/* note: a good test grid should include the following:
  1. a line that starts with a 0
  2. a line that contains {x, x, 2x}, that should result in {2x, 2x}
  3. a line that starts with the same number the previous line finished with (the previous number shouldn't've mergered) ((this was an actual bug))
  4. a line where a number moves without merging

  I have made a grid for each direction that follows 1-3, but made result grids for every
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
  ["left", importedTestGrids.left],
  ["right", importedTestGrids.right]
])('%s swiping moves and merges test grids', (swipeDirection, resultGrid) => {
  const direction= <"left" | "right" | "up" | "down">swipeDirection;

  test("testGrid 0", () => {
    let grid = new Grid(importedTestGrids.inputs["0"]);
    grid.swipe(direction)
    console.log(grid.activeGrid)
    expect(grid.activeGrid).toStrictEqual(resultGrid["0"])
  })

  test("testGrid 1", () => {
    let grid = new Grid(importedTestGrids.inputs["1"]);
    grid.swipe(direction)
    console.log(grid.activeGrid)
    expect(grid.activeGrid).toStrictEqual(resultGrid["1"])
  })
})