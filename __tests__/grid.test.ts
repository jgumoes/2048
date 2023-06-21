import Grid from "../grid";
import {emptyGrid} from "../src/newGrid";
import * as importedTestGrids from './testGrids.json'

describe('initial grid', () => {
  test('is empty', () => {
    let grid = new Grid();
    expect(grid.activeGrid).toBe(emptyGrid)
  });

  test('can be set', () => {
    let testGrids = importedTestGrids.moveOnly;
    let grid = new Grid(testGrids[0].init);
    expect(grid.activeGrid).toBe(testGrids[0].init)
  })
})

describe("left swiping moves test grids", () => {
  let testGrids = importedTestGrids.moveOnly;

  test("testGrid0", () => {
    let grid = new Grid(testGrids[0].init);
    grid.swipeLeft();
    expect(grid.activeGrid).toBe(testGrids[0].left)
  })
})