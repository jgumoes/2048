import { StatusBar } from 'expo-status-bar';
import { useWindowDimensions, StyleSheet, Text, View, Modal, SafeAreaView } from 'react-native';
import Grid, { Direction, colorTestGrid } from './grid';
import { useState } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView, RectButton, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { observer } from 'mobx-react-lite';
import { tileBackgroundColours, styles, tileTextColours } from './AppStyles';
import GameInfoBar from './GameInfoBar';

function Tile({value, gridSides}:{value: number, gridSides: number}) {
  const styleIndex: tileNumber_t = Object.keys(tileBackgroundColours).includes(String(value)) ? String(value) : '4096'

  const valueString = value ? String(value) : ''

  const fontMultiplier = valueString.length <= 4 ? 20 : 15
  const fontSize = (gridSides * fontMultiplier)/245
  return(
    <View style={[styles.tile, tileBackgroundColours[styleIndex]]}>
      <Text style={[styles.tileText, tileTextColours[styleIndex], {fontSize: fontSize}]} >
        {valueString}
      </Text>
    </View>
  )
}

function GameOverOverlay({gridSides}: {gridSides: number}) {
  const fontSize = gridSides * 70 / 530
  return(
    <View style={styles.gameOver}>
      <Text style={[styles.gameOverText, {fontSize: fontSize}]}>Game Over</Text>
    </View>
  )
}

/**
 * Creates and views a 4x4 grid
 * @param param0 
 * @returns 
 */
const GridView4 = observer(({grid}: {grid: Grid}) => {
  
  const sidesX = useWindowDimensions().width * 0.95
  const sidesY = useWindowDimensions().height * 0.7
  const gridSides =  sidesX < sidesY ? sidesX : sidesY
  console.log("window sides: ", sidesX, sidesY)
  console.log("gridSides: ", gridSides)
  console.log("is game over: ", grid.isGameOver)

  return(
    <View style={[{height: gridSides, width: gridSides}]}>
      {grid.isGameOver && <GameOverOverlay gridSides={gridSides} />}
      <View style={[styles.gridView, {height: gridSides, width: gridSides}]}>
        <View style={styles.gridRow}>
          {grid.activeGrid[0].map((value, index) => <Tile value={value} gridSides={gridSides} key={'0' + index} />)}
        </View>
        <View style={styles.gridRow}>
          {grid.activeGrid[1].map((value, index) => <Tile value={value} gridSides={gridSides} key={'1' + index} />)}
        </View>
        <View style={styles.gridRow}>
          {grid.activeGrid[2].map((value, index) => <Tile value={value} gridSides={gridSides} key={'2' + index} />)}
        </View>
        <View style={styles.gridRow}>
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

function GameBoard({grid}: {grid: Grid}) {
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
export default function App() {
  // const [grid, setGrid] = useState(new Grid({gridSize: 4}))
  const [grid, setGrid] = useState(new Grid({grid: colorTestGrid()}))
  
  return (
    <SafeAreaView style={[styles.container]}>
        <StatusBar style="auto" hidden={false} />
      <GestureHandlerRootView style={[styles.container, {marginTop: 80}]}>
        <GameBoard grid={grid} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

type tileNumber_t = keyof typeof tileBackgroundColours;