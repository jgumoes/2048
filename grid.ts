
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
  previousNumber: number;
  addNumberFunction;

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
    this.activeGrid = emptyGrid()
    this.xIndex = this.xStartingIndex;
    this.yIndex = this.yStartingIndex;
  }

  addNumber = (number: number) => {
    if(number === 0){ throw new Error("This is a heros only zone: no zeros allowed"); }
    this.addNumberFunction(number)
  }

  nextLine = () => {
    this.nextLineFunction()
  }

  private addNumberHorizontal = (number: number) => {
    if(number !== this.previousNumber){
      this.activeGrid[this.yIndex][this.xIndex] = number
      this.xIndex += this.xIncrement;
      this.previousNumber = number
    }
    else{
      this.activeGrid[this.yIndex][this.xIndex - this.xIncrement] = number * 2
      this.previousNumber = 0
    }
  }

  private addNumberVertical = (number: number) => {
    if(number !== this.previousNumber){
      this.activeGrid[this.yIndex][this.xIndex] = number
      this.yIndex += this.yIncrement;
      this.previousNumber = number
    }
    else{
      this.activeGrid[this.yIndex - this.yIncrement][this.xIndex] = number * 2
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
  constructor(grid = emptyGrid()) {
    this.activeGrid = grid
  }

  swipeLeft = () => {
    for(var i = 0; i < 4; i++){

    }
  }
}

export default Grid