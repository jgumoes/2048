
export const emptyGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

const gridSize = 4

type coordinate_t = {
  x: number,
  y: number
}

/**
 * Chooses a number between 1 and nOfZeros
 * @param nOfZeros
 * @returns 1 <= number <= nOfZeros}
 */
export const chooseA0 = (nOfZeros: number) => {
  return Math.floor(Math.random() * nOfZeros) + 1
}

/**
 * Usage:
 *  1. set a direction using setDirectionX()
 *  2. use addNumber(n) to add all numbers in a line
 *  3. nextLine() to move to the next line
 *  4. repeat 2&3 for all lines in grid
 *  5. retrieve the constructed grid with activeGrid
 *  6. retrieve coordinate for a new tile with newTileLocation()
 * 
 *  the activeGrid is reset when a new direction is set.
 */
export class NewGrid {
  private _activeGrid: number[][] = emptyGrid();
  private xIncrement: 1 | -1 = 1;
  private yIncrement: 1 | -1 = 1;
  private xStartingIndex: number = 0;
  private yStartingIndex: number = 0;
  private xEndingIndex: number = gridSize - 1
  private yEndingIndex: number = gridSize - 1

  private yIndex: number = 0;
  private xIndex: number = 0;
  private nextLineFunction = ()=>{};
  private previousNumber: number = 0;
  private addNumberFunction = (number: number)=>{};

  private newTileX = (chosen0: number) => {return {"x": gridSize, "y": gridSize}}
  // private zerosCount = new Array(gridSize * gridSize).fill(
  //   {
  //     "x": gridSize,
  //     "y": gridSize
  //   }
  // );
  private zerosCount = new Array(gridSize).fill(gridSize)
  chooseA0: (nOfZeros: number) => number

  constructor (chooseA0Fn = chooseA0){
    this.chooseA0 = chooseA0Fn
  }

  resetGrid = () => {
    this.previousNumber = 0;
    this._activeGrid = emptyGrid()
    this.xIndex = this.xStartingIndex;
    this.yIndex = this.yStartingIndex;
  }

  setDirectionLeft = () => {
    this.xIncrement = 1
    this.yIncrement = 1
    this.xStartingIndex = 0
    this.yStartingIndex = 0
    this.xEndingIndex = gridSize - 1
    this.yEndingIndex = gridSize - 1
    this.nextLineFunction = this.nextLineHorizontal
    this.addNumberFunction = this.addNumberHorizontal
    this.newTileX = this.newTileLeft
    this.resetGrid()
  }

  setDirectionRight = () => {
    this.xIncrement = -1
    this.yIncrement = 1
    this.xStartingIndex = gridSize -1
    this.yStartingIndex = 0
    this.xEndingIndex = 0
    this.yEndingIndex = gridSize - 1
    this.nextLineFunction = this.nextLineHorizontal
    this.addNumberFunction = this.addNumberHorizontal
    this.newTileX = this.newTileRight
    this.resetGrid()
  }

  setDirectionUp = () => {
    this.xIncrement = 1
    this.yIncrement = 1
    this.xStartingIndex = 0
    this.yStartingIndex = 0
    this.xEndingIndex = gridSize - 1
    this.yEndingIndex = gridSize - 1
    this.nextLineFunction = this.nextLineVertical
    this.addNumberFunction = this.addNumberVertical
    this.newTileX = this.newTileUp
    this.resetGrid()
  }

  setDirectionDown = () => {
    this.xIncrement = 1
    this.yIncrement = -1
    this.xStartingIndex = 0
    this.yStartingIndex = gridSize - 1
    this.xEndingIndex = gridSize - 1
    this.yEndingIndex = 0
    this.nextLineFunction = this.nextLineVertical
    this.addNumberFunction = this.addNumberVertical
    this.newTileX = this.newTileDown
    this.resetGrid()
  }

  /**
   * Convenience function for testing. The correct setDirectionX
   * method should be called to avoid an unnecessary switch statement
  */
  setDirection = (direction: "left" | "right" | "up" | "down") => {
    switch (direction) {
      case "left":
        this.setDirectionLeft()
        break;
      case "right":
        this.setDirectionRight()
        break;
      case "up":
        this.setDirectionUp()
        break;
      case "down":
        this.setDirectionDown()
        break;
      default:
        new Error(`{direction} is not a valid direction`)
        break;
    }
  }

  get activeGrid() {
    return this._activeGrid
  }

  addNumber = (number: number) => {
    if(number !== 0){
      this.addNumberFunction(number)
    }
  }

  nextLine = () => {
    this.nextLineFunction()
    this.previousNumber = 0
  }

  private addNumberHorizontal = (number: number) => {
    if(number !== this.previousNumber){
      this._activeGrid[this.yIndex][this.xIndex] = number
      this.zerosCount[this.yIndex] -= 1
      this.xIndex += this.xIncrement;
      this.previousNumber = number
    }
    else{
      this._activeGrid[this.yIndex][this.xIndex - this.xIncrement] = number * 2
      this.previousNumber = 0
    }
  }

  private addNumberVertical = (number: number) => {
    if(number !== this.previousNumber){
      this._activeGrid[this.yIndex][this.xIndex] = number
      this.zerosCount[this.xIndex] -= 1
      this.yIndex += this.yIncrement;
      this.previousNumber = number
    }
    else{
      this._activeGrid[this.yIndex - this.yIncrement][this.xIndex] = number * 2
      this.previousNumber = 0
    }
  }

  private nextLineHorizontal = () => {
    // while(this.xIndex !== this.xEndingIndex){
    //   this.zerosLocations.push(
    //     {
    //       "x": this.xIndex,
    //       "y": this.yIndex
    //     }
    //   )
    //   this.xIndex += 1
    // }
    this.xIndex = this.xStartingIndex
    this.yIndex += this.yIncrement
  }

  private nextLineVertical = () => {
    // while(this.yIndex !== this.yEndingIndex){
    //   this.zerosLocations.push(
    //     {
    //       "x": this.xIndex,
    //       "y": this.yIndex
    //     }
    //   )
    //   this.yIndex += 1
    // }
    this.xIndex += this.xIncrement
    this.yIndex = this.yStartingIndex
  }

  newTileLocation = () => {
    let nOfZeros = this.zerosCount.reduce((cum, x)=> cum + x, 0)
    let chosen0 = this.chooseA0(nOfZeros)
    return this.newTileX(chosen0)
  }

  private newTileLeft = (chosen0: number) => {
    let y = 0
    while( chosen0 > this.zerosCount[y]){
      chosen0 -= this.zerosCount[y]
      y++
    }

    return {
      x: gridSize - chosen0,
      y: y
    }
  }

  private newTileRight = (chosen0: number) => {
    let y = 0
    while( chosen0 > this.zerosCount[y]){
      chosen0 -= this.zerosCount[y]
      y++
    }

    return {
      x: chosen0 - 1,
      y: y
    }
  }

  private newTileUp = (chosen0: number) => {
    let x = 0
    while( chosen0 > this.zerosCount[x]){
      chosen0 -= this.zerosCount[x]
      x++
    }

    return {
      x: x,
      y: gridSize - chosen0
    }
  }

  private newTileDown = (chosen0: number) => {
    let x = 0
    while( chosen0 > this.zerosCount[x]){
      chosen0 -= this.zerosCount[x]
      x++
    }

    return {
      x: x,
      y: chosen0 - 1
    }
  }
}

class Grid {
  activeGrid: number[][];
  oldGrid: number[][];
  nextGrid: NewGrid;
  gridSize = gridSize

  constructor(grid = emptyGrid()) {
    this.activeGrid = grid
    this.oldGrid = grid
    this.nextGrid = new NewGrid()
  }

  /**
   * Convenience function for testing. Try to use the correct swipeX method if possible
  */
  swipe = (direction: "left" | "right" | "up" | "down") => {
    switch (direction) {
      case "left":
        this.activeGrid = this.swipeLeft()
        break;
      case "right":
        this.activeGrid = this.swipeRight()
        break
      case "up":
        this.activeGrid = this.swipeUp()
        break
      case "down":
        this.activeGrid = this.swipeDown()
        break
      default:
        new Error(`{direction} is not a valid direction`)
        break;
    }
}

  swipeLeft = () => {
    this.oldGrid = this.activeGrid
    this.nextGrid.setDirectionLeft()
    for(var y = 0; y < gridSize; y++){
      for(var x = 0; x < gridSize; x++){
        this.nextGrid.addNumber(this.oldGrid[y][x])
      }
      this.nextGrid.nextLine()
    }
    this.activeGrid = this.nextGrid.activeGrid
    this.newTile()
    return this.activeGrid
  }

  swipeRight = () => {
    this.oldGrid = this.activeGrid
    this.nextGrid.setDirectionRight()
    for(var y = 0; y < gridSize; y++){
      var xLimit = gridSize - 1
      for(var x = 0; x <= xLimit; x++){
        this.nextGrid.addNumber(this.oldGrid[y][xLimit - x])
      }
      this.nextGrid.nextLine()
    }
    this.activeGrid = this.nextGrid.activeGrid
    this.newTile()
    return this.activeGrid
  }

  swipeUp = () => {
    this.oldGrid = this.activeGrid
    this.nextGrid.setDirectionUp()
    for(var x = 0; x < gridSize; x++){
      for(var y = 0; y < gridSize; y++){
        this.nextGrid.addNumber(this.oldGrid[y][x])
      }
      this.nextGrid.nextLine()
    }
    this.activeGrid = this.nextGrid.activeGrid
    this.newTile()
    return this.activeGrid
  }

  swipeDown = () => {
    this.oldGrid = this.activeGrid
    this.nextGrid.setDirectionDown()
    for(var x = 0; x < gridSize; x++){
      var yLimit = gridSize - 1
      for(var y = 0; y <= yLimit; y++){
        this.nextGrid.addNumber(this.oldGrid[yLimit - y][x])
      }
      this.nextGrid.nextLine()
    }
    this.activeGrid = this.nextGrid.activeGrid
    this.newTile()
    return this.activeGrid
  }

  /**
   * this is a private method, you should not be using it
   */
  protected newTile = () => {
    const c = this.nextGrid.newTileLocation()
    if(Math.random() < 0.9){
      this.activeGrid[c.y][c.x] = 2
    }
    else{
      this.activeGrid[c.y][c.x] = 4
    }
  }
}

export default Grid