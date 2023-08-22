import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import Grid, { colorTestGrid } from './grid';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { appStyles } from './AppStyles';
import GameBoard from './GameBoard';

export default function App() {
  // const [grid, setGrid] = useState(new Grid({gridSize: 4}))
  const [grid, setGrid] = useState(new Grid({grid: colorTestGrid()}))
  
  return (
    <SafeAreaView style={[appStyles.container]}>
        <StatusBar style="auto" hidden={false} />
      <GestureHandlerRootView style={[appStyles.container, {marginTop: 80}]}>
        <GameBoard grid={grid} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
