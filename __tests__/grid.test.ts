import Grid, {emptyGrid} from "../grid";

const testGrid0 = [
  [ 2, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 2, 0, 0], 
  [ 0, 0, 0, 0]
]

describe('initial grid', () => {
  test('is empty', () => {
    let testGrid = new Grid();
    expect(testGrid.activeGrid).toBe(emptyGrid)
  });

  test('can be set', () => {
    let testGrid = new Grid(testGrid0);
    expect(testGrid.activeGrid).toBe(testGrid0)
  })
})

describe("left swiping moves test grids", () => {
  test("testGrid0", () => {
    let testGrid = new Grid(testGrid0);
    testGrid.swipeLeft();
    expect(testGrid.activeGrid).toBe([
      [ 2, 0, 0, 0], 
      [ 0, 0, 0, 0], 
      [ 2, 0, 0, 0], 
      [ 0, 0, 0, 0]
    ])
  })
})