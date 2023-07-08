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
  ["right", importedTestGrids.right],
  ["up", importedTestGrids.up],
  ["down", importedTestGrids.down]
])('%s swiping once moves and merges test grids', (swipeDirection, resultGrid) => {
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

  test("testGrid 2", () => {
    let grid = new Grid(importedTestGrids.inputs["2"]);
    grid.swipe(direction)
    console.log(grid.activeGrid)
    expect(grid.activeGrid).toStrictEqual(resultGrid["2"])
  })

  test("testGrid 3", () => {
    let grid = new Grid(importedTestGrids.inputs["3"]);
    grid.swipe(direction)
    console.log(grid.activeGrid)
    expect(grid.activeGrid).toStrictEqual(resultGrid["3"])
  })
})

/* the second swipe is to ensure Grid holds its own reference to activeGrid */
describe.each([
  ["left", importedTestGrids.left],
  ["right", importedTestGrids.right],
  ["up", importedTestGrids.up],
  ["down", importedTestGrids.down]
])('grid moves and merges correctly when swiping %s ', (swipeDirection, resultGrid) => {
  const direction= <"left" | "right" | "up" | "down">swipeDirection;

  test("then left", () => {
    let grid = new Grid(importedTestGrids.inputs["0"]);
    grid.swipe(direction)
    grid.swipe("left")
    expect(grid.activeGrid).toStrictEqual(resultGrid.left)
  })

  test("then right", () => {
    let grid = new Grid(importedTestGrids.inputs["1"]);
    grid.swipe(direction)
    grid.swipe("right")
    expect(grid.activeGrid).toStrictEqual(resultGrid.right)
  })

  test("then up", () => {
    let grid = new Grid(importedTestGrids.inputs["2"]);
    grid.swipe(direction)
    grid.swipe("up")
    expect(grid.activeGrid).toStrictEqual(resultGrid.up)
  })

  test("then down", () => {
    let grid = new Grid(importedTestGrids.inputs["3"]);
    grid.swipe(direction)
    grid.swipe("down")
    expect(grid.activeGrid).toStrictEqual(resultGrid.down)
  })
})