import React, { useState } from "react"
import { View, useWindowDimensions, Text } from "react-native"
import { Gesture, GestureDetector, gestureHandlerRootHOC } from "react-native-gesture-handler"
import GameInfoBar from "./GameInfoBar"
import Grid, { Direction } from "./grid"
import { observer } from "mobx-react-lite"
import { appStyles, gameOverStyles, tileBackgroundColours, tileTextColours } from "./AppStyles"

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

function GameOverOverlay({gridSides}: {gridSides: number}) {
  const fontSize = gridSides * 70 / 530
  return(
    <View style={gameOverStyles.overlay}>
      <Text style={[gameOverStyles.text, {fontSize: fontSize}]}>Game Over</Text>
    </View>
  )
}

/**
 * Creates and views a 4x4 grid
 * @param param0 
 * @returns 
 */
export const GridView4 = observer(({grid}: {grid: Grid}) => {
  
  const sidesX = useWindowDimensions().width * 0.95
  const sidesY = useWindowDimensions().height * 0.7
  const gridSides =  sidesX < sidesY ? sidesX : sidesY
  console.log("window sides: ", sidesX, sidesY)
  console.log("gridSides: ", gridSides)
  console.log("is game over: ", grid.isGameOver)

  return(
    <View style={[{height: gridSides, width: gridSides}]}>
      {grid.isGameOver && <GameOverOverlay gridSides={gridSides} />}
      <View style={[appStyles.gridView, {height: gridSides, width: gridSides}]}>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[0].map((value, index) => <Tile value={value} gridSides={gridSides} key={'0' + index} />)}
        </View>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[1].map((value, index) => <Tile value={value} gridSides={gridSides} key={'1' + index} />)}
        </View>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[2].map((value, index) => <Tile value={value} gridSides={gridSides} key={'2' + index} />)}
        </View>
        <View style={appStyles.gridRow}>
          {grid.activeGrid[3].map((value, index) => <Tile value={value} gridSides={gridSides} key={'3' + index} />)}
        </View>
      </View>
    </View>
  )
})

const WrappedGridView4 = gestureHandlerRootHOC(GridView4)

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

export default function GameBoard({grid}: {grid: Grid}) {
  const [initialTouch, setInitialTouch] = useState({x:0, y:0})

  const swipeResponder = Gesture.Pan()
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
      grid.swipe(direction) // this is nerfing performance
      console.log("swipe time: ", Date.now() - now)
      setInitialTouch({x: 0, y: 0})
    })

  console.log("rerendered: ", Date.now())
  return(
    <View>
      <GameInfoBar grid={grid} />
      <GestureDetector  gesture={swipeResponder}>
        <WrappedGridView4 grid={grid}/>
      </GestureDetector >
    </View>
  )
}