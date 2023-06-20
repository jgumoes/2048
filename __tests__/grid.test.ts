import Grid, {emptyGrid} from "../grid";

test('initial grid is empty', () => {
  let testGrid = new Grid();
  expect(testGrid.activeGrid).toBe(emptyGrid)
}
)