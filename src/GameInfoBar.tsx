import { Text, View, StyleSheet, Pressable } from 'react-native';
import Grid from './grid';
import { ResetSquare, UndoIcon } from './SVGIcons'
import React from 'react';
import { gridSides } from './GameBoard';
import { observer } from 'mobx-react-lite';
import { GridOverlayState, overlayStates } from './overlayState';
import { testIDs } from './globalValues';

const GameInfoBar = observer(({grid}: {grid: Grid}) => {
  const onResetSquarePress = () => {
    GridOverlayState.showResetGameOverlay()
    if(grid.isGameOver){
      grid.reset()
    }
  }

  const onUndoButtonPress = () => {
    if(GridOverlayState.overlayState === overlayStates.resetGame || GridOverlayState.overlayState === overlayStates.gameWon){
      GridOverlayState.hideOverlay()
    }
    else if(grid.isUndoAllowed){
      GridOverlayState.showUndoButtonOverlay();
      grid.undo();
    }
  }

  const componentHeight = gridSides()/5
  const scoreFontSize = (30 / 475) * gridSides()

  return(
    <View style={styles.gameInfoBar}>
      <View style={styles.scoresContainer}>
        <Text style={[{fontSize: scoreFontSize}, styles.scoresText]} >Score: {grid.currentScore}</Text>
        <Text style={[{fontSize: scoreFontSize}, styles.scoresText]} >Undo Count: {grid.undoCount}</Text>
      </View>
      <View style={[styles.buttonsContainer]} >
        <Pressable
          testID={testIDs.undoButton}
          onPress={onUndoButtonPress}
        >
          <UndoIcon width={componentHeight} height={componentHeight} />
        </Pressable>
        <Pressable
          testID={testIDs.resetButton}
          onPress={onResetSquarePress}
        >
          <ResetSquare width={componentHeight} height={componentHeight} />
        </Pressable>
      </View>
    </View>
  )
})

export default GameInfoBar

const styles = StyleSheet.create({
  gameInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  },
  scoresContainer: {
    justifyContent: 'space-around'
  },
  scoresText: {
    color: '#1C274C'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
})
