import { useEffect, useState } from "react"
import { View, useWindowDimensions, Text } from "react-native"
import { Gesture, GestureDetector, gestureHandlerRootHOC } from "react-native-gesture-handler"
import GameInfoBar from "./GameInfoBar"
import Grid, { Direction } from "../src/grid"
import { observer } from "mobx-react-lite"
import { appStyles, tileBackgroundColours, tileTextColours } from "../AppStyles"
import { GridOverlayState } from "../src/overlayState"
import { testIDs } from "../src/globalValues"
import GridOverlay from "./GridOverlay"

type tileNumber_t = keyof typeof tileBackgroundColours;

function Tile({value, gridSides}:{value: number, gridSides: number}) {
  const styleIndex: tileNumber_t = Object.keys(tileBackgroundColours).includes(String(value))? String(value) as tileNumber_t : '4096'

  const valueString = value ? String(value) : ''

  const fontMultiplier = valueString.length <= 4 ? 20 : 15
  const fontSize = (gridSides * fontMultiplier)/245
  return(
    <View style={[appStyles.tile, tileBackgroundColours[styleIndex]]}>
      <Text style={[appStyles.tileText, tileTextColours[styleIndex], {fontSize: fontSize}]} >
        {valueString}
      </Text>
    </View>
  )
}

export const gridSides = () => {
  const sidesX = useWindowDimensions().width * 0.95
  const sidesY = useWindowDimensions().height * 0.7
  return sidesX < sidesY ? sidesX : sidesY
}

/**
 * Creates and views a 4x4 grid
 * @param param0 
 */
export const NakedGridView4 = observer(({grid}: {grid: Grid}) => {
  const [primeGameWon, setPrimeGameWon] = useState(!grid.isGameWon)
  useEffect(()=>{
    console.log("GridView isGameWon useEffect triggered")
    if(primeGameWon && grid.isGameWon){
      console.log("GridView is showing gameWon overlay")
      setPrimeGameWon(false)
      GridOverlayState.showGameWonOverlay()
    }
  }, [grid.isGameWon])
  useEffect(()=>{
    console.log("GridView isGameOver useEffect triggered")
    if(grid.isGameOver){
      console.log("GridView is showing gameLost overlay")
      GridOverlayState.showGameLostOverlay()
    }
  }, [grid.isGameOver])
  
  return(
    <View style={[{height: gridSides(), width: gridSides()}]} testID={testIDs.gridView}>
      {!GridOverlayState.isHidden && <GridOverlay grid={grid} /> }
      <View style={[appStyles.gridView, {height: gridSides(), width: gridSides()}]}>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[0].map((value, index) => <Tile value={value} gridSides={gridSides()} key={'0' + index} />)}
        </View>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[1].map((value, index) => <Tile value={value} gridSides={gridSides()} key={'1' + index} />)}
        </View>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[2].map((value, index) => <Tile value={value} gridSides={gridSides()} key={'2' + index} />)}
        </View>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[3].map((value, index) => <Tile value={value} gridSides={gridSides()} key={'3' + index} />)}
        </View>
      </View>
    </View>
  )
})

export const GridView4 = gestureHandlerRootHOC(NakedGridView4)

function findSwipeDirection({dx, dy}:{dx: number, dy:number}) {
  if(Math.abs(dx) > Math.abs(dy)){
    if(dx > 0){
      return Direction.right
    }
    return Direction.left
  }
  else{
    if(dy > 0){
      return Direction.down
    }
    return Direction.up
  }
}

const GameBoard = observer(({grid}: {grid: Grid}) => {
  const [initialTouch, setInitialTouch] = useState({x:0, y:0})

  const swipeResponder = Gesture.Pan()
  // TODO: mock this class to create swipe function
  // then create a function that triggers the swipe 
    .minDistance(100)
    .maxPointers(1)
    .onBegin((e) => {
      // when screen is first touched
      console.log("touch begin: ", Date.now())
      setInitialTouch({x: e.absoluteX, y: e.absoluteY})
    })
    .onStart((e) => {
      // when gesture is registered
      const direction = findSwipeDirection({
        dx: e.absoluteX - initialTouch.x, 
        dy: e.absoluteY - initialTouch.y
      })
      const now = Date.now()
      console.log("now: ", now)
      if(GridOverlayState.isHidden){grid.swipe(direction)} // TODO: this is nerfing performance
      console.log("swipe time: ", Date.now() - now)
      setInitialTouch({x: 0, y: 0})
    })
  
  console.log("rerendered: ", Date.now())
  return(
    <View>
      <GameInfoBar grid={grid} />
      <GestureDetector  gesture={swipeResponder}>
        <GridView4 grid={grid} />
      </GestureDetector >
    </View>
  )
})

export default GameBoard