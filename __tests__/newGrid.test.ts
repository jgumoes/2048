import {NewGrid, emptyGrid } from "../grid";

describe('initialises', () => {
  test("with an empty grid", () => {
    let testGrid = new NewGrid("left");
    expect(testGrid.activeGrid).toStrictEqual(emptyGrid())
  })
})

describe('when swipping left', () => {
  let testGrid: NewGrid;
  beforeEach(() => {
    testGrid = new NewGrid("left")
  })
  test('new elements can be added on one line', () => {
    testGrid.addNumber(2);
    // expect(testGrid.activeGrid).toStrictEqual([
    //   [ 2, 0, 0, 0], 
    //   [ 0, 0, 0, 0], 
    //   [ 0, 0, 0, 0], 
    //   [ 0, 0, 0, 0]
    // ])
    testGrid.addNumber(4);
    // expect(testGrid.activeGrid).toStrictEqual([
    //   [ 2, 4, 0, 0], 
    //   [ 0, 0, 0, 0], 
    //   [ 0, 0, 0, 0], 
    //   [ 0, 0, 0, 0]
    // ])
    testGrid.addNumber(8);
    expect(testGrid.activeGrid).toStrictEqual([
      [ 2, 4, 8, 0], 
      [ 0, 0, 0, 0], 
      [ 0, 0, 0, 0], 
      [ 0, 0, 0, 0]
    ])
  })

  test('new elements can be added on different lines', () => {
    expect(testGrid.activeGrid).toStrictEqual(emptyGrid())
    testGrid.addNumber(2);
    // expect(testGrid.activeGrid).toStrictEqual([
    //   [ 2, 0, 0, 0], 
    //   [ 0, 0, 0, 0], 
    //   [ 0, 0, 0, 0], 
    //   [ 0, 0, 0, 0]
    // ])
    testGrid.nextLine()
    testGrid.addNumber(4);
    // expect(testGrid.activeGrid).toStrictEqual([
    //   [ 2, 0, 0, 0], 
    //   [ 4, 0, 0, 0], 
    //   [ 0, 0, 0, 0], 
    //   [ 0, 0, 0, 0]
    // ])
    testGrid.nextLine()
    testGrid.addNumber(8);
    expect(testGrid.activeGrid).toStrictEqual([
      [ 2, 0, 0, 0], 
      [ 4, 0, 0, 0], 
      [ 8, 0, 0, 0], 
      [ 0, 0, 0, 0]
    ])
  })
})