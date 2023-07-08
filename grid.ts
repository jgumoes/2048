
export const emptyGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

const gridSize = 4

export class NewGrid {
  private _activeGrid: number[][];
  private xIncrement: 1 | -1 = 1;
  private yIncrement: 1 | -1 = 1;
  private xStartingIndex: number = 0;
  private yStartingIndex: number = 0;

  private yIndex: number;
  private xIndex: number;
  private nextLineFunction = ()=>{};
  private previousNumber: number;
  private addNumberFunction = (number: number)=>{};

  constructor(direction: "left" | "right" | "up" | "down") {
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
       this.setDirectionLeft()
       break
    }
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
  }

  setDirectionRight = () => {
    this.xIncrement = -1
    this.yIncrement = 1
    this.xStartingIndex = gridSize -1
    this.yStartingIndex = 0
    this.nextLineFunction = this.nextLineHorizontal
    this.addNumberFunction = this.addNumberHorizontal
  }

  setDirectionUp = () => {
    this.xIncrement = 1
    this.yIncrement = 1
    this.xStartingIndex = 0
    this.yStartingIndex = 0
    this.nextLineFunction = this.nextLineVertical
    this.addNumberFunction = this.addNumberVertical
  }

  setDirectionDown = () => {
    this.xIncrement = 1
    this.yIncrement = -1
    this.xStartingIndex = 0
    this.yStartingIndex = gridSize - 1
    this.nextLineFunction = this.nextLineVertical
    this.addNumberFunction = this.addNumberVertical
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

  constructor(grid = emptyGrid()) {
    this.activeGrid = grid
    this.oldGrid = grid
  }

  swipe = (direction: "left" | "right" | "up" | "down") => {
    this.oldGrid = this.activeGrid
    let nextGrid = new NewGrid(direction)
    switch (direction) {
      case "left":
        this.activeGrid = this.swipeLeft(nextGrid)
        break;
      case "right":
        this.activeGrid = this.swipeRight(nextGrid)
        break
      case "up":
        this.activeGrid = this.swipeUp(nextGrid)
        break
      case "down":
        this.activeGrid = this.swipeDown(nextGrid)
        break
      default:
        break;
    }
}

  swipeLeft = (nextGrid: NewGrid) => {
    for(var y = 0; y < gridSize; y++){
      for(var x = 0; x < gridSize; x++){
        nextGrid.addNumber(this.oldGrid[y][x])
      }
      nextGrid.nextLine()
    }
    return nextGrid.activeGrid
  }

  swipeRight = (nextGrid: NewGrid) => {
    for(var y = 0; y < gridSize; y++){
      var xLimit = gridSize - 1
      for(var x = 0; x <= xLimit; x++){
        nextGrid.addNumber(this.oldGrid[y][xLimit - x])
      }
      nextGrid.nextLine()
    }
    return nextGrid.activeGrid
  }

  swipeUp = (nextGrid: NewGrid) => {
    for(var x = 0; x < gridSize; x++){
      for(var y = 0; y < gridSize; y++){
        nextGrid.addNumber(this.oldGrid[y][x])
      }
      nextGrid.nextLine()
    }
    return nextGrid.activeGrid
  }

  swipeDown = (nextGrid: NewGrid) => {
    for(var x = 0; x < gridSize; x++){
      var yLimit = gridSize - 1
      for(var y = 0; y <= yLimit; y++){
        nextGrid.addNumber(this.oldGrid[yLimit - y][x])
      }
      nextGrid.nextLine()
    }
    return nextGrid.activeGrid
  }
}

export default Grid