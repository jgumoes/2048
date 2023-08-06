
export const emptyGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

const gridSize = 4

/**
 * Compares two grids, and returns if they are different.
 * gridA and gridB have same shape
 */
const areGridsDifferent = (gridA: number[][], gridB: number[][])=>{
  // if(gridA.length !== gridB.length){ return false } // same number of rows
  for(let y = 0; y < gridA.length; y++){
    // if(gridA[y].length !== gridB[y].length){ return false } // same number of colomns
    for(let x = 0; x < gridA[y].length; x++){
      if(gridA[y][x] !== gridB[y][x]){
        return true
      }
    }
  }
  return false
}

/**
 * Chooses a number between 0 and nOfZeros - 1
 * @returns 0 <= number < nOfZeros}
 */
export const chooseA0 = (nOfZeros: number) => {
  return Math.floor(Math.random() * nOfZeros)
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
        x: gridSize - 1 - chosen0,
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
        "zeros": index.x + 1
      }
    },
    "newTile": (chosen0: number, line: number) => {
      return {
        x: chosen0,
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
        "zeros": gridSize  - index.y
      }
    },
    "newTile": (chosen0: number, line: number) => {
      return {
        x: line,
        y: gridSize -1 - chosen0
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
        "zeros": index.y + 1
      }
    },
    "newTile": (chosen0: number, line: number) => {
      return {
        x: line,
        y: chosen0
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
  private _nextGrid: number[][] = emptyGrid();
  private _mergeScore: number = 0;

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
  readonly gridSize: number

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
    this.totalZerosCount = 0

    this.updateGrid(grid)
  }

  private resetGrid = () => {
    this.previousNumber = 0;
    this._nextGrid = emptyGrid()
    this.index = {...this.startingIndex}
    this.zerosCounts = []
    this.totalZerosCount = 0
    this._mergeScore = 0
  }

  /**
   * returns true if swiping in this direction is a valid move 
   */
  get canBeSwiped() {
    return this._canBeSwiped
  }

  /**
   * Get the grid that's the result of swiping in this direction
   */
  get activeGrid() {
    return this._nextGrid
  }

  /**
   * Get the score gained from merging in this direction
   */
  get mergeScore() {
    return this._mergeScore
  }

  /**
   * Update the class to use the grid currently on the game board.
   * Will reset current variables, merge the grid in the relevant direction,
   * find the merge score etc.
   * Basically, when the user changes the game board, this method should be called
   */
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
    this._canBeSwiped = areGridsDifferent(this.activeGrid, grid)
    return this._canBeSwiped
  }

  private addNumber = (number: number) => {
    if(number === 0){
      return
    }
    if(number !== this.previousNumber){
      this._nextGrid[this.index.y][this.index.x] = number
      this.index.x += this.addNumberIncrement.x;
      this.index.y += this.addNumberIncrement.y
      this.previousNumber = number
    }
    else{
      this._nextGrid[this.index.y - this.addNumberIncrement.y][this.index.x - this.addNumberIncrement.x] = number * 2
      this._mergeScore += number * 2
      this.previousNumber = 0
    }
  }

  private nextLine = () => {
    const {index, zeros} = this.nextLineX(this.index, gridSize)
    this.index = index
    this.totalZerosCount += zeros
    this.zerosCounts.push(zeros)
    this.previousNumber = 0
  }

  public newTileLocation = () => {
    const nOfZeros = this.totalZerosCount
    let chosen0 = this.chooseA0(nOfZeros)

    let line = 0
    while( chosen0 >= this.zerosCounts[line]){
      chosen0 -= this.zerosCounts[line]
      line++
    }

    return this.newTileX(chosen0, line)
  }
}

class Grid {
  private _activeGrid: number[][];
  private _oldGrid: number[][] | null = null;
  private nextGrids: {
    [index in Direction]: NextGridMaker
  }
  readonly gridSize: number;
  private _currentScore: number
  private _gameOver = false

  /**
   * 
   * @param grid a valid grid to start with, if loading from save. otherwise optional
   * @param score initial score. defaults to 0
   * @param gridSize defaults to 4. if grid is given, grid.length is used instead
   */
  constructor(params: {grid?: number[][], score?: number, gridSize?: number} = {score: 0, gridSize: 4}) {
    if(params.grid === undefined){
      this.gridSize = params.gridSize || 4
      this._activeGrid = emptyGrid()
      this.fillInitialGrid()
    }
    else{
      this._activeGrid = params.grid;
      this.gridSize = this._activeGrid.length
    }
    this._currentScore = params.score || 0

    this.nextGrids = {
      "left": new NextGridMaker(Direction.left, this._activeGrid),
      "right": new NextGridMaker(Direction.right, this._activeGrid),
      "up": new NextGridMaker(Direction.up, this._activeGrid),
      "down": new NextGridMaker(Direction.down, this._activeGrid),
    }
  }

  private fillInitialGrid = () => {
    const z1 = {
      x: chooseA0(gridSize),
      y: chooseA0(gridSize)
    }

    let z2 = {
      x: chooseA0(gridSize),
      y: chooseA0(gridSize)
    }

    while((z1.x === z2.x) && (z1.y === z2.y)){
      z2 = {
        x: chooseA0(gridSize),
        y: chooseA0(gridSize)
      }
    }

    this.placeNewTile(z1)
    this.placeNewTile(z2)
  }

  public get isGameOver(){
    return this._gameOver
  }

  public get currentScore(): number {
    return this._currentScore
  }
  
  public get oldGrid() : number[][] | null {
    return this._oldGrid
  }

  
  public get activeGrid() : number[][] {
    return this._activeGrid
  }
  
  /**
   * Updates the active grid in this class
   * @param grid the new active grid
   */
  private updateActiveGrid = (grid: number[][]) => {
    this._oldGrid = this._activeGrid
    this._activeGrid = grid;
  }

  /**
   * Updates all the nextGrids with the current activeGrid.
   * Important: .nextTileLocation() must be called before updating the grids!
   */
  private updateNextGrids = () => {
    // TODO: this loop should happen after the swipe() has returned, while
    // the app is re-drawing i.e. this loop should be asynchronious
    for (const direction in Direction){
      this.nextGrids[<Direction>direction].updateGrid(this._activeGrid)
    }
    this.testForGameOver()
  }

  private testForGameOver = () => {
    let gameStillPlayable = !this._gameOver
    for(const direction in Direction){
      gameStillPlayable &&= this.nextGrids[<Direction>direction].canBeSwiped
    }
    this._gameOver = ! gameStillPlayable
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
      this._currentScore += nextGrid.mergeScore
      this.placeNewTile(nextGrid.newTileLocation())
      this.updateNextGrids()
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