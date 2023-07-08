import Grid from "../grid";
import {emptyGrid} from "../grid";
import * as importedTestGridsJson from './testGrids.json'
const importedTestGrids = importedTestGridsJson.gridList

describe('initial grid', () => {
  test('is empty', () => {
    let grid = new Grid();
    expect(grid.activeGrid).toStrictEqual(emptyGrid())
  });

  test('can be set', () => {
    let testGrid = importedTestGrids[0].input;
    let grid = new Grid(testGrid);
    expect(grid.activeGrid).toBe(testGrid)
  })
})

describe("left swiping moves and merges test grids", () => {

  test("testGrid0", () => {
    let grid = new Grid(importedTestGrids[0].input);
    grid.swipeLeft();
    console.log(grid.activeGrid)
    expect(grid.activeGrid).toStrictEqual(importedTestGrids[0].left)
  })
})