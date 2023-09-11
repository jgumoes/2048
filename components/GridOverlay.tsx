import { ReactNode, useEffect } from "react"
import { View, Text, Pressable } from "react-native"
import Grid from "../src/grid"
import { gameOverStyles } from "../AppStyles"
import { GridOverlayState, overlayStates } from "../src/overlayState"
import { overlayTimeouts, testIDs } from "../src/globalValues"
import { gridSides } from "./GameBoard"

type overlayText_t = {
  [index in overlayStates]: {
    title: string,
    subtitle: string
  }
}

export const overlayText: overlayText_t = {
  gameWon: {
    title: "You Win!",
    subtitle: "(tap to dismiss)"
  },
  gameLost: {
    title: "Game Over",
    subtitle: "play again?"
  },
  resetGame: {
    title: "Reset Game?",
    subtitle: ""
  },
  undoButton: {
    title: "dude",
    subtitle: "weak"
  },
  hidden: {
    title: "",
    subtitle: ""
  }
}

function ConfirmResetButtons({grid}: {grid: Grid}){
  const noCallbacks = {
    gameLost: () => {grid.undo(); GridOverlayState.showUndoButtonOverlay()},
    resetGame: () => {GridOverlayState.hideOverlay()}
  }
  const onNoCallback = GridOverlayState.overlayState === overlayStates.gameLost ? noCallbacks.gameLost : noCallbacks.resetGame
  const onYesCallback = () => {grid.reset(); GridOverlayState.hideOverlay();}

  return(
    <View testID={testIDs.confirmResetButtons}>
      <Pressable onPress={onNoCallback}>
        <Text>no</Text>
      </Pressable>
      <Pressable onPress={onYesCallback}>
        <Text>yes</Text>
      </Pressable>
    </View>
  )
}

enum overlayStyles_enum {
  "gameWon",
  "standard"
}

interface GridOverlayWrapperProps_i {
  overlayStyle: overlayStyles_enum,
  children: ReactNode
}

/**
 * Wraps the GridOverlay in a styled View or pressable, depending on overlayStyle
 */
function GridOverlayWrapper({overlayStyle, children}: GridOverlayWrapperProps_i){
  if(overlayStyle === overlayStyles_enum.gameWon){
    return(
      <Pressable testID={testIDs.gridOverlay} onPress={() => {GridOverlayState.hideOverlay()}} style={gameOverStyles.overlay}>
        {children}
      </Pressable>
    )
  }
  else{
    return(
      <View testID={testIDs.gridOverlay} style={gameOverStyles.overlay}>
        {children}
      </View>
    )
  }
}

export default function GridOverlay({grid}: {grid: Grid}){
  const fontSize = gridSides() * 70 / 530
  const state = GridOverlayState.overlayState

  useEffect(()=>{
    let closeOverlayTimeout: NodeJS.Timeout | undefined = undefined;
    if(state === overlayStates.gameWon || state === overlayStates.undoButton){
      console.log("setting overlay timeout")
      closeOverlayTimeout = setTimeout(()=>GridOverlayState.hideOverlay(), overlayTimeouts[state])
    }
    else{console.log("overlay timeout not set")}
    
    return ()=> {
      console.log("GridOverlay is cleaning up by hiding the overlay")
      clearTimeout(closeOverlayTimeout)
      GridOverlayState.cleanupOverlay()
    }
  })

  const overlayStyle = state === overlayStates.gameWon ? overlayStyles_enum.gameWon : overlayStyles_enum.standard
  const showSubtitle = state !== overlayStates.resetGame
  const showConfirmButtons = state === overlayStates.gameLost || state === overlayStates.resetGame

  return(
    <GridOverlayWrapper overlayStyle={overlayStyle}>
      <Text style={[gameOverStyles.text, {fontSize: fontSize}]}>{overlayText[state].title}</Text>
      { showSubtitle && <Text style={[gameOverStyles.text, {fontSize: fontSize}]}>{overlayText[state].subtitle}</Text>}
      { showConfirmButtons && <ConfirmResetButtons grid={grid} />}
    </GridOverlayWrapper>
  )
}