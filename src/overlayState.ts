/**
 * state behaviours:
 * 
 * - GameWon
 *    - should render the first time a game reachers or exceeds 2048
 * 
 * - GameLost
 *    - should only be accessible by swiping into a losing game
 *    - "no" is identical to UndoButton
 * 
 * - ResetGame
 *    - overides any overlay on screen
 *    - idea: if changing from UndoButton, should pressing "no" resume UndoButton overlay?
 * 
 * - UndoButton
 *    - overides GameLost. hides and GameWon ResetGame without undoing the action
 * 
 * having an overlay on screen should disable all grid actions
 * 
 */

import { makeAutoObservable } from "mobx";

enum overlayStates {
  gameWon = "gameWon",
	gameLost = "gameLost",
	resetGame = "resetGame",
  undoButton = "undoButton",
	hidden = "hidden",
}

/**
 * a class to provide states for the GridView overlays
 */
class OverlayStateClass {
  private _primeGameWon: boolean = false;
  private _overlayState: overlayStates

  constructor() {
    this._overlayState = overlayStates.hidden
    makeAutoObservable(this)
  }
	
  public get overlayState(): overlayStates {
    return this._overlayState
  }

  /**
   * should only be called by reactions
   */
  showGameWonOverlay(){
    // if(this._primeGameWon){
    //   this._primeGameWon = false
    //   this._overlayState = overlayStates.gameWon
    // }
    this._overlayState = overlayStates.gameWon
  }

  /**
   * should only be called by reactions
   */
  showGameLostOverlay(){
    this._overlayState = overlayStates.gameLost
  }

  showResetGameOverlay(){
    if(this._overlayState !== overlayStates.gameLost){
      this._overlayState = overlayStates.resetGame
    }
    else{
      this._overlayState = overlayStates.hidden
    }
  }

  showUndoButtonOverlay(){
    console.log("showing undoButton overlay")
    this._overlayState = overlayStates.undoButton
  }

  /**
   * hides the overlay, unless it's a gameWon overlay.
   * should be called in useEffect cleanup for overlay component
   * checks are needed to top react prematurely hidding an overlay
   */
  cleanupOverlay(){
    console.log("cleaning up overlay")
    console.log("overlayState: ", this._overlayState)
    if(this._overlayState !== overlayStates.gameWon && this._overlayState !== overlayStates.undoButton){
      console.log("hiding the overlay from cleanup")
      this.hideOverlay()
    }
  }

  /**
   * forces the overlay to be hidden.
   * should only be called from user interactions
   */
  hideOverlay(){
    console.log("hiding the overlay")
    this._overlayState = overlayStates.hidden
  }
  
  public get isHidden() : boolean {
    return this._overlayState === overlayStates.hidden
  }

  /**
   * set the reference for the Grid instance.
   * also initialises some reactions
   */
  // public set setGridRef(grid: Grid) {
  //   this._gridReference = grid  // TODO: should we wait for reset() to complete before continuing?
  //   // this._primeGameWon = !this._gridReference.isGameWon
  //   // if(this._primeGameWon){
  //   if(!this._gridReference.isGameWon){
  //     console.log("setting gameWon reaction")
  //     this._cancelfunctions["gameWon"] = when(
  //       ()=>{return this._gridReference?.isGameWon || false},
  //       ()=>{this.showGameWonOverlay()}
  //     )
  //   }
  //   this._cancelfunctions["gameLost"] = autorun(()=>{
  //     console.log("gameLost autorun has been triggered: ")
  //     if(this._gridReference?.isGameOver){
  //       console.log("showing gameLost overlay: ", this._gridReference.isGameOver)
  //       this.showGameLostOverlay
  //     }
  //     else{console.log("not showing gameLost overlay")}
  //   })
  // }
  
  /**
   * cancel all the reactions
   */
  // public reset(){
  //   for(let f of Object.values(this._cancelfunctions)){
  //     f() // todo: can this create a race condition?
  //   }
  //   for(let t of Object.values(this._timeouts)){
  //     clearTimeout(t)
  //   }
  // }
}

/**
 * TODO: fix all exports, implement reactivity
 */
const GridOverlayState = new OverlayStateClass()
export {overlayStates, GridOverlayState}