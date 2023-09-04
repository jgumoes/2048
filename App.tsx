import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from "react-error-boundary";
import { SafeAreaView } from 'react-native';
import Grid, { colorTestGrid } from './src/grid';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { appStyles } from './AppStyles';
import GameBoard from './src/GameBoard';

const swipeForGameWonGrid = () => [
  [ 0, 0, 0, 0], 
  [ 0, 1024, 1024, 0],
  [ 0, 1024, 1024, 0], 
  [ 0, 0, 0, 0], 
]
export default function App() {
  // const [grid, setGrid] = useState(new Grid({gridSize: 4}))
  // const [grid, setGrid] = useState(new Grid({grid: colorTestGrid(), undoCount: 5}))
  const [grid, setGrid] = useState(() => {
    const newGrid = new Grid({grid: swipeForGameWonGrid()})
    // const newGrid = new Grid({grid: colorTestGrid(), score: 42069, undoCount: 5})
    // const newGrid = new Grid({grid: [
    //   [ 8, 8, 4, 2], 
    //   [ 4, 4, 2, 4], 
    //   [ 2, 2, 4, 2], 
    //   [ 0, 4, 2, 4]
    // ]})
    // GridOverlayState.primeGameWon = newGrid.isGameWon
    return newGrid
  })
  
  return (
    <SafeAreaView style={[appStyles.container]}>
      <StatusBar style="auto" hidden={false} />
      <GestureHandlerRootView style={[appStyles.container, {marginTop: 80}]}>
        <GameBoard grid={grid}/>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
