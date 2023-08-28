import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import Grid, { colorTestGrid } from './src/grid';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { appStyles } from './AppStyles';
import GameBoard from './src/GameBoard';

export default function App() {
  // const [grid, setGrid] = useState(new Grid({gridSize: 4}))
  const [grid, setGrid] = useState(new Grid({grid: colorTestGrid(), undoCount: 5}))
  
  return (
    <SafeAreaView style={[appStyles.container]}>
        <StatusBar style="auto" hidden={false} />
      <GestureHandlerRootView style={[appStyles.container, {marginTop: 80}]}>
        <GameBoard grid={grid} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
