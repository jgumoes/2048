
export const emptyGrid = [[ null, null, null, null], 
[ null, null, null, null],
[ null, null, null, null],
[ null, null, null, null]]

class Grid {
  activeGrid: number|null[][];
  constructor(grid = emptyGrid) {
    this.activeGrid = grid
      
  }
}

export default Grid