import { StatusBar } from 'expo-status-bar';
import { useWindowDimensions, StyleSheet, Text, View, Modal } from 'react-native';
import Grid, { Direction, colorTestGrid } from './grid';
import { useState } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { observer } from 'mobx-react-lite';

import ResetSquare from './assets/restart-square.svg'
import UndoSquare from './assets/undo.svg'

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

function GameInfoBar({grid}: {grid: Grid}) {
  const [showResetBoardModal, setShowResetBoardModal] = useState(false)
  const onResetSquarePress = () => setShowResetBoardModal(true)

  return(
    <View style={styles.gameInfoBar}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showResetBoardModal}
        onRequestClose={() => setShowResetBoardModal(false)}
      >
        <View style={styles.resetBoardModal}>
          <Text style={styles.resetBoardModalText}>Are you sure you want to reset?</Text>
          <View>
            <RectButton onPress={() => setShowResetBoardModal(false)}>
            <Text style={styles.resetBoardModalText}>no</Text>
            </RectButton>
            <RectButton onPress={()=> {grid.reset(); setShowResetBoardModal(false);}}>
            <Text style={styles.resetBoardModalText}>yes</Text>
            </RectButton>
          </View>
        </View>
      </Modal>
      <View>
        <Text>Score: {grid.currentScore}</Text>
        <Text>Undo Button Count: {grid.undoCount}</Text>
      </View>
      <RectButton onPress={()=>{grid.undo()}} >
        <UndoSquare width={100} height={100} />
      </RectButton>
      <RectButton onPress={onResetSquarePress} >
        <ResetSquare width={100} height={100} />
      </RectButton>
    </View>
  )
}

export default function App() {
  // const [grid, setGrid] = useState(new Grid({gridSize: 4}))
  const [grid, setGrid] = useState(new Grid({grid: colorTestGrid()}))

  const [initialTouch, setInitialTouch] = useState({x:0, y:0})

  const swipeResponder = Gesture.Pan()
    .minDistance(100)
    .maxPointers(1)
    .onBegin((e) => {
      // when screen is first touched
      setInitialTouch({x: e.absoluteX, y: e.absoluteY})
    })
    .onStart((e) => {
      // when gesture is registered
      const direction = findSwipeDirection({
        dx: e.absoluteX - initialTouch.x, 
        dy: e.absoluteY - initialTouch.y
      })
      grid.swipe(direction)
      setInitialTouch({x: 0, y: 0})
    })
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={styles.container}>
        <GameInfoBar grid={grid} />
        <GestureDetector  gesture={swipeResponder}>
          <GridView4 grid={grid}/>
        </GestureDetector >
      </GestureHandlerRootView>
    </View>
  );
}

const textColours = {
  white: 'rgb(249, 246, 241)',
  black: 'rgb(119, 110, 101)'
}

const gridViewBorderRadius = 10
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(251, 248, 239)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridView: {
    backgroundColor: 'rgb(187, 173, 160)',
    justifyContent: 'space-evenly',
    borderRadius: gridViewBorderRadius
  },
  gridRow: {
    flexDirection: 'row',
    height: '22%',
    justifyContent: 'space-evenly',
  },
  tile: {
    backgroundColor: 'white',
    width: '22%',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 10,
  },
  tileText: {
    textAlign: 'center',
  },
  gameInfoBar: {
    flexDirection: 'row'
  },
  gameOver: {
    backgroundColor: 'grey',
    opacity: 0.8,
    zIndex: 100,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: gridViewBorderRadius
  },
  gameOverText: {
    color: 'white',
  },
  resetBoardModal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    opacity: 0.8,
    height: '100%',
  },
  resetBoardModalText: {
    fontSize: 30
  }
});

const tileBackgroundColours = StyleSheet.create({
  '0': {
    backgroundColor: 'rgb(214, 205, 196)',
  },
  '2': {
    backgroundColor: 'rgb(238, 228, 218)',
  },
  '4': {
    backgroundColor: 'rgb(236, 224, 200)',
  },
  '8': {
    backgroundColor: 'rgb(242, 177, 121)',
  },
  '16': {
    backgroundColor: 'rgb(245, 149, 99)',
  },
  '32': {
    backgroundColor: 'rgb(245, 124, 95)',
  },
  '64': {
    backgroundColor: 'rgb(246, 93, 59)',
  },
  '128': {
    backgroundColor: 'rgb(237, 206, 113)',
  },
  '256': {
    backgroundColor: 'rgb(237, 204, 97)',
  },
  '512': {
    backgroundColor: 'rgb(236, 200, 80)',
  },
  '1024': {
    backgroundColor: 'rgb(237, 197, 63)',
  },
  '2048': {
    backgroundColor: 'rgb(238, 194, 46)',
  },
  '4096': {
    backgroundColor: 'black',
  }
})

const tileTextColours = StyleSheet.create({
  '0': {
    color: textColours.black,
  },
  '2': {
    color: textColours.black,
  },
  '4': {
    color: textColours.black,
  },
  '8': {
    color: textColours.white,
  },
  '16': {
    color: textColours.white,
  },
  '32': {
    color: textColours.white,
  },
  '64': {
    color: textColours.white,
  },
  '128': {
    color: textColours.white,
  },
  '256': {
    color: textColours.white,
  },
  '512': {
    color: textColours.white,
  },
  '1024': {
    color: textColours.white,
  },
  '2048': {
    color: textColours.white,
  },
  '4096': {
    color: textColours.white,
  }
})

type tileNumber_t = keyof typeof tileBackgroundColours;