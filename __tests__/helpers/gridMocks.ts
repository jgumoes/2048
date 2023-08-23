import Grid from "../../grid";

/**
 * overides placeNewTile to not place new tiles
 */
export class NoPlaceGrid extends Grid{
  // why use spyOn when you can use inheritance babyeee! also spyOn didn't work, this is the only way to stop a new tile being added to the active grid
  placeNewTile(newTileLocation: {'x': number, 'y': number}){}
}

/**
 * Overides placeNewTile to place a tiles at [1, 1] then [2, 2]
 */
export class ControlledPlaceGrid extends Grid{
  placeTileCalls = 0;
  placeNewTile = (newTileLocation: {'x': number, 'y': number}) => {
    if(this.placeTileCalls === 0){
      this._activeGrid[1][1] = 2
    }
    if(this.placeTileCalls === 0){
      this._activeGrid[2][2] = 2
    }
    this.placeTileCalls += 1
  }
}
