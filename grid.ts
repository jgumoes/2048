
export const emptyGrid = [
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0], 
  [ 0, 0, 0, 0]
]

class Grid {
  activeGrid: number[][];
  constructor(grid = emptyGrid) {
    this.activeGrid = grid
      
  }
}

export default Grid