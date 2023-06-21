
export const emptyGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

const gridSize = 4

export class NewGrid {
  activeGrid: number[][];
  xIncrement: 1 | -1;
  yIncrement: 1 | -1;
  xStartingIndex: number;
  yStartingIndex: number;

  yIndex: number;
  xIndex: number;
  nextLineFunction;

  constructor(direction: "left" | "right" | "up" | "down") {
    switch (direction) {
      case "left":
        this.xIncrement = 1
        this.yIncrement = 1
        this.xStartingIndex = 0
        this.yStartingIndex = 0
        this.nextLineFunction = this.nextLineHorizontal
        break;
    
      case "right":
        this.xIncrement = -1
        this.yIncrement = 1
        this.xStartingIndex = gridSize -1
        this.yStartingIndex = 0
        this.nextLineFunction = this.nextLineHorizontal
        break;
    
      case "up":
        this.xIncrement = 1
        this.yIncrement = 1
        this.xStartingIndex = 0
        this.yStartingIndex = 0
        this.nextLineFunction = this.nextLineVertical
        break;
        
      case "down":
        this.xIncrement = 1
        this.yIncrement = -1
        this.xStartingIndex = 0
        this.yStartingIndex = gridSize - 1
        this.nextLineFunction = this.nextLineVertical
        break;
      default:
        this.xIncrement = 1
        this.yIncrement = 1
        this.xStartingIndex = 0
        this.yStartingIndex = 0
        this.nextLineFunction = this.nextLineHorizontal
        break;
    }
    this.activeGrid = emptyGrid()
    this.xIndex = this.xStartingIndex;
    this.yIndex = this.yStartingIndex;
  }

  addNumber = (number: number) => {
    this.activeGrid[this.yIndex][this.xIndex] = number
    this.xIndex += this.xIncrement;
  }

  nextLine = () => {
    this.nextLineFunction()
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
  constructor(grid = emptyGrid()) {
    this.activeGrid = grid
  }

  swipeLeft = () => {
    for(var i = 0; i < 4; i++){

    }
  }
}

export default Grid