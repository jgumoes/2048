import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Grid, { Direction } from './grid';
import { useState } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView, RectButton, Directions as gestureDirections } from 'react-native-gesture-handler';

function Tile({value}:{value: number}) {
  const styleIndex: tileNumber_t = value;

  const valueString = value || ''
  return(
    <View style={[styles.tile, tileNumberStyles[styleIndex]]}>
      <Text style={styles.tileText}>
        {valueString}
      </Text>
    </View>
  )
}

/**
 * Creates and views a 4x4 grid
 * @param param0 
 * @returns 
 */
function GridView4({grid}: {grid: Grid}) {
  const gridSides = Dimensions.get("window").width

  return(
    <View style={[styles.gridView, {height: gridSides, width: gridSides}]}>
      <View style={styles.gridRow}>
        {grid.activeGrid[0].map((value, index) => <Tile value={value} key={'0' + index} />)}
      </View>
      <View style={styles.gridRow}>
        {grid.activeGrid[1].map((value, index) => <Tile value={value} key={'1' + index} />)}
      </View>
      <View style={styles.gridRow}>
        {grid.activeGrid[2].map((value, index) => <Tile value={value} key={'2' + index} />)}
      </View>
      <View style={styles.gridRow}>
        {grid.activeGrid[3].map((value, index) => <Tile value={value} key={'3' + index} />)}
      </View>
    </View>
  )
}

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

export default function App() {
  const [grid, setGrid] = useState(new Grid({gridSize: 4}))

  const [initialTouch, setInitialTouch] = useState({x:0, y:0})
  const [swipeDirection, setSwipeDirection] = useState<Direction | "none">("none")

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
      setSwipeDirection(direction)
      setInitialTouch({x: 0, y: 0})
    })
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={styles.container}>
        <Text>Swipe Direction: {swipeDirection}</Text>
        <GestureDetector  gesture={swipeResponder}>
          <GridView4 grid={grid}/>
        </GestureDetector >
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'beige',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridView: {
    backgroundColor: 'grey',
    justifyContent: 'space-around',
    margin: 10,
  },
  gridRow: {
    flexDirection: 'row',
    height: '20%',
    justifyContent: 'space-around',
  },
  tile: {
    backgroundColor: 'white',
    // height: '20%',
    width: '20%',
    justifyContent: 'center',
    textAlign: 'center',
  },
  tileText: {
    color: 'black',
    fontSize: 26,
  }
});

const tileNumberStyles = StyleSheet.create({
  0: {
    backgroundColor: '#b5b5b5',
  },
  2: {
    backgroundColor: '#e9e9e9',
  },
  4: {
    backgroundColor: '#e1e1c6',
  },
})

type tileNumber_t = keyof typeof tileNumberStyles;