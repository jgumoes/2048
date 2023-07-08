
export const emptyGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

const gridSize = 4

export class NewGrid {
  private _activeGrid: number[][] = emptyGrid();
  private xIncrement: 1 | -1 = 1;
  private yIncrement: 1 | -1 = 1;
  private xStartingIndex: number = 0;
  private yStartingIndex: number = 0;

  private yIndex: number = 0;
  private xIndex: number = 0;
  private nextLineFunction = ()=>{};
  private previousNumber: number = 0;
  private addNumberFunction = (number: number)=>{};

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
    this.nextLineFunction = this.nextLineHorizontal
    this.addNumberFunction = this.addNumberHorizontal
    this.resetGrid()
  }

  setDirectionRight = () => {
    this.xIncrement = -1
    this.yIncrement = 1
    this.xStartingIndex = gridSize -1
    this.yStartingIndex = 0
    this.nextLineFunction = this.nextLineHorizontal
    this.addNumberFunction = this.addNumberHorizontal
    this.resetGrid()
  }

  setDirectionUp = () => {
    this.xIncrement = 1
    this.yIncrement = 1
    this.xStartingIndex = 0
    this.yStartingIndex = 0
    this.nextLineFunction = this.nextLineVertical
    this.addNumberFunction = this.addNumberVertical
    this.resetGrid()
  }

  setDirectionDown = () => {
    this.xIncrement = 1
    this.yIncrement = -1
    this.xStartingIndex = 0
    this.yStartingIndex = gridSize - 1
    this.nextLineFunction = this.nextLineVertical
    this.addNumberFunction = this.addNumberVertical
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
      this.yIndex += this.yIncrement;
      this.previousNumber = number
    }
    else{
      this._activeGrid[this.yIndex - this.yIncrement][this.xIndex] = number * 2
      this.previousNumber = 0
    }
  }

  private nextLineHorizontal = () => {
    this.xIndex = this.xStartingIndex
    this.yIndex += this.yIncrement
  }

  private nextLineVertical = () => {
    this.xIndex += this.xIncrement
    this.yIndex = this.yStartingIndex
  }

}

class Grid {
  activeGrid: number[][];
  oldGrid: number[][];
  nextGrid: NewGrid;

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
    return this.nextGrid.activeGrid
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
    return this.nextGrid.activeGrid
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
    return this.nextGrid.activeGrid
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
    return this.nextGrid.activeGrid
  }
}

export default Grid