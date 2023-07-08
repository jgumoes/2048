
export const emptyGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

const gridSize = 4

export class NewGrid {
  private _activeGrid: number[][];
  private xIncrement: 1 | -1;
  private yIncrement: 1 | -1;
  private xStartingIndex: number;
  private yStartingIndex: number;

  private yIndex: number;
  private xIndex: number;
  private nextLineFunction;
  private previousNumber: number;
  private addNumberFunction;

  constructor(direction: "left" | "right" | "up" | "down") {
    switch (direction) {
      case "left":
        this.xIncrement = 1
        this.yIncrement = 1
        this.xStartingIndex = 0
        this.yStartingIndex = 0
        this.nextLineFunction = this.nextLineHorizontal
        this.addNumberFunction = this.addNumberHorizontal
        break;
    
      case "right":
        this.xIncrement = -1
        this.yIncrement = 1
        this.xStartingIndex = gridSize -1
        this.yStartingIndex = 0
        this.nextLineFunction = this.nextLineHorizontal
        this.addNumberFunction = this.addNumberHorizontal
        break;
    
      case "up":
        this.xIncrement = 1
        this.yIncrement = 1
        this.xStartingIndex = 0
        this.yStartingIndex = 0
        this.nextLineFunction = this.nextLineVertical
        this.addNumberFunction = this.addNumberVertical
        break;
        
      case "down":
        this.xIncrement = 1
        this.yIncrement = -1
        this.xStartingIndex = 0
        this.yStartingIndex = gridSize - 1
        this.nextLineFunction = this.nextLineVertical
        this.addNumberFunction = this.addNumberVertical
        break;
      default:
        throw new Error(`${direction} is not a valid direction`)
    }
    this.previousNumber = 0;
    this._activeGrid = emptyGrid()
    this.xIndex = this.xStartingIndex;
    this.yIndex = this.yStartingIndex;
  }

  get activeGrid() {
    // console.log(this._activeGrid)
    return this._activeGrid
  }

  addNumber = (number: number) => {
    if(number === 0){ throw new Error("This is a heros only zone: no zeros allowed"); }
    this.addNumberFunction(number)
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
    switch (direction) {
      case "left":
        this.swipeLeft()
        break;
      case "right":
        this.swipeRight()
      default:
        break;
    }
}

  swipeLeft = () => {
    this.oldGrid = this.activeGrid
    let nextGrid = new NewGrid("left")
    for(var y = 0; y < gridSize; y++){
      for(var x = 0; x < gridSize; x++){
        if(this.oldGrid[y][x] > 0){
          nextGrid.addNumber(this.oldGrid[y][x])
        }
      }
      nextGrid.nextLine()
    }
    this.activeGrid = nextGrid.activeGrid
    console.log("active grid: ", this.activeGrid)
  }

  swipeRight = () => {
    this.oldGrid = this.activeGrid
    let nextGrid = new NewGrid("right")
    for(var y = 0; y < gridSize; y++){
      var xLimit = gridSize - 1
      for(var x = 0; x <= xLimit; x++){
        if(this.oldGrid[y][xLimit - x] > 0){
          nextGrid.addNumber(this.oldGrid[y][xLimit - x])
        }
      }
      nextGrid.nextLine()
    }
    this.activeGrid = nextGrid.activeGrid
    console.log("active grid: ", this.activeGrid)
  }
}

export default Grid