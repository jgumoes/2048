
export const emptyGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

const gridSize = 4

/**
 * Chooses a number between 1 and nOfZeros
 * @param nOfZeros
 * @returns 1 <= number <= nOfZeros}
 */
export const chooseA0 = (nOfZeros: number) => {
  return Math.floor(Math.random() * nOfZeros) + 1
}

export enum Direction {
  left = "left",
  right = "right",
  up = "up",
  down = "down"
}

type directionVariables_t = {
  addNumberIncrement: {
      x: number;
      y: number;
  };
  startingIndex: (gridSize: number) => {
    x: number;
    y: number;
  };
  nextLine: (
    index: {
      x: number;
      y: number;
    }, 
    gridSize: number
  ) => {
    index: {
      x: number;
      y: number;
    }, zeros: number
  },
  "newTile": (chosen0: number, line: number) => {
    x: number,
    y: number
  }
}


type NewGridDirectionVariables_t = {
  [index in Direction]: directionVariables_t
}

const NewGridDirectionVariables: NewGridDirectionVariables_t = {
  "left": {
    "addNumberIncrement": {
      "x": 1,
      "y": 0,
    },
    "startingIndex": (gridSize) => {
      return {
        "x": 0,
        "y": 0
      }
    },
    "nextLine": (index, gridSize) => {
      return {
        "index": {
          "x": 0,
          "y": index.y + 1
        },
        "zeros": gridSize - index.x
      }
    },
    "newTile": (chosen0: number, line: number) => {
      return {
        x: gridSize - chosen0,
        y: line
      }
    }
  },
  "right": {
    "addNumberIncrement": {
      "x": -1,
      "y": 0,
    },
    "startingIndex": (gridSize) => {
      return {
        "x": gridSize - 1,
        "y": 0
      }
    },
    "nextLine": (index, gridSize) => {
      return {
        "index": {
          "x": gridSize - 1,
          "y": index.y + 1
        },
        "zeros": gridSize - index.x
      }
    },
    "newTile": (chosen0: number, line: number) => {
      return {
        x: chosen0 - 1,
        y: line
      }
    }
  },
  "up": {
    "addNumberIncrement": {
      "x": 0,
      "y": 1,
    },
    "startingIndex": (gridSize) => {
      return {
        "x": 0,
        "y": 0
      }
    },
    "nextLine": (index, gridSize) => {
      return {
        "index": {
          "x": index.x + 1,
          "y": 0
        },
        "zeros": gridSize - index.x
      }
    },
    "newTile": (chosen0: number, line: number) => {
      return {
        x: line,
        y: gridSize - chosen0
      }
    }
  },
  "down": {
    "addNumberIncrement": {
      "x": 0,
      "y": -1,
    },
    "startingIndex": (gridSize) => {
      return {
        "x": 0,
        "y": gridSize - 1
      }
    },
    "nextLine": (index, gridSize) => {
      return {
        "index": {
          "x": index.x + 1,
          "y": gridSize - 1
        },
        "zeros": gridSize - index.x
      }
    },
    "newTile": (chosen0: number, line: number) => {
      return {
        x: line,
        y: chosen0 - 1
      }
    }
  },
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
export class NextGridMaker {
  private nextGrid: number[][] = emptyGrid();

  private index: {"x": number, "y": number};
  private previousNumber: number = 0;

  private totalZerosCount: number;
  private zerosCounts: number[] = []
  
  private readonly addNumberIncrement: {"x": number, "y": number}
  private readonly startingIndex: {"x": number, "y": number}
  
  private nextLineX: (index: { x: number; y: number }, gridSize: number) => { index: { x: number; y: number }; zeros: number }
  private newTileX: (chosen0: number, line: number) => { x: number; y: number }
  private chooseA0: (nOfZeros: number) => number

  private _canBeSwiped: boolean = true;

  readonly direction;
  gridSize: number

  constructor (direction: Direction, grid: number[][], chooseA0Fn = chooseA0){
    // direction-specific setup
    this.gridSize = grid.length
    this.addNumberIncrement = NewGridDirectionVariables[direction].addNumberIncrement
    this.startingIndex = NewGridDirectionVariables[direction].startingIndex(gridSize)
    this.index = {...this.startingIndex}
    this.nextLineX = NewGridDirectionVariables[direction].nextLine
    this.newTileX = NewGridDirectionVariables[direction].newTile
    this.direction = direction

    // dependancy injection
    this.chooseA0 = chooseA0Fn
    
    // other setup
    this.totalZerosCount = gridSize * gridSize

    this.updateGrid(grid)
  }

  private resetGrid = () => {
    this.previousNumber = 0;
    this.nextGrid = emptyGrid()
    this.index = {...this.startingIndex}
    this.zerosCounts = []
    this.totalZerosCount = gridSize * gridSize;
  }

  get canBeSwiped() {
    return this._canBeSwiped
  }

  /**
   * Get the grid that's the result of swiping in this direction
   */
  get activeGrid() {
    return this.nextGrid
  }

  public updateGrid(grid: number[][]) {
    this.resetGrid();
    switch (this.direction) {
      case Direction.left:
        for(var y = 0; y < gridSize; y++){
          for(var x = 0; x < gridSize; x++){
            this.addNumber(grid[y][x])
          }
          this.nextLine()
        }
        break;
      case Direction.right:
        for(var y = 0; y < gridSize; y++){
          var xLimit = gridSize - 1
          for(var x = 0; x <= xLimit; x++){
            this.addNumber(grid[y][xLimit - x])
          }
          this.nextLine()
        }
        break;
      case Direction.up:
        for(var x = 0; x < gridSize; x++){
          for(var y = 0; y < gridSize; y++){
            this.addNumber(grid[y][x])
          }
          this.nextLine()
        }
        break;
      case Direction.down:
        for(var x = 0; x < gridSize; x++){
          var yLimit = gridSize - 1
          for(var y = 0; y <= yLimit; y++){
            this.addNumber(grid[yLimit - y][x])
          }
          this.nextLine()
        }
        break;
      default:
        break;
    }
    this._canBeSwiped = (this.activeGrid !== grid)
  }

  private addNumber = (number: number) => {
    if(number === 0){
      return
    }
    if(number !== this.previousNumber){
      this.nextGrid[this.index.y][this.index.x] = number
      this.totalZerosCount -= 1
      this.index.x += this.addNumberIncrement.x;
      this.index.y += this.addNumberIncrement.y
      this.previousNumber = number
    }
    else{
      this.nextGrid[this.index.y - this.addNumberIncrement.y][this.index.x - this.addNumberIncrement.x] = number * 2
      this.previousNumber = 0
    }
  }

  private nextLine = () => {
    const {index, zeros} = this.nextLineX(this.index, gridSize)
    this.index = index
    this.zerosCounts.push(zeros)
    this.previousNumber = 0
  }

  public newTileLocation = () => {
    const nOfZeros = this.totalZerosCount - 1
    let chosen0 = this.chooseA0(nOfZeros)

    let line = 0
    while( chosen0 > this.zerosCounts[line]){
      chosen0 -= this.zerosCounts[line]
      line++
    }

    return this.newTileX(chosen0, line)
  }
}

class Grid {
  private _activeGrid: number[][];
  _oldGrid: number[][];
  nextGrids: {
    [index in Direction]: NextGridMaker
  }
  gridSize = gridSize

  constructor(grid = emptyGrid()) {
    this._activeGrid = grid;
    this._oldGrid = this._activeGrid
    this.nextGrids = {
      "left": new NextGridMaker(Direction.left, grid = this._activeGrid),
      "right": new NextGridMaker(Direction.right, grid = this._activeGrid),
      "up": new NextGridMaker(Direction.up, grid = this._activeGrid),
      "down": new NextGridMaker(Direction.down, grid = this._activeGrid),
    }
  }

  
  public get oldGrid() : number[][] {
    return this._oldGrid
  }

  
  public get activeGrid() : number[][] {
    return this._activeGrid
  }
  
  
  private updateActiveGrid = (grid: number[][]) => {
    this._oldGrid = this._activeGrid
    this._activeGrid = grid;
    // TODO: this loop should happen after the swipe() has returned, while
    // the app is re-drawing i.e. this loop should be asynchronious
    for (const direction in Direction){
      this.nextGrids[<Direction>direction].updateGrid(grid)
    }
  }

  /**
   * Swipe the grid in a direction.
   * @param direction member of the Direction enum
   * @returns if the swipe was successful
   */
  swipe = (direction: Direction) => {
    const nextGrid = this.nextGrids[direction]
    if(nextGrid.canBeSwiped){
      this.updateActiveGrid(nextGrid.activeGrid)
      this.placeNewTile(nextGrid.newTileLocation())
      return true
    }
    else{
      return false
    }
  }

  /**
   * this is a private method, you should not be using it
   */
  protected placeNewTile = (newTileLocation: {'x': number, 'y': number}) => {
    this._activeGrid[newTileLocation.y][newTileLocation.x] = Math.random() < 0.9 ? 2 : 4
  }
}

export default Grid