import { Text, View, Modal, StyleSheet, Pressable } from 'react-native';
import Grid from './grid';
import { ResetSquare, UndoIcon } from './SVGIcons'
import React, { useState } from 'react';
import { gridSides } from './GameBoard';
import { observer } from 'mobx-react-lite';

const ResetBoardModal = ({onYes, onNo}: {onYes: () => void, onNo: () => void}) => {
  return(
    <View style={styles.resetBoardModal}>
      <Text style={styles.resetBoardModalText}>Are you sure you want to reset?</Text>
      <View>
        <Pressable onPress={onNo}>
        <Text style={styles.resetBoardModalText}>no</Text>
        </Pressable>
        <Pressable onPress={onYes}>
        <Text style={styles.resetBoardModalText}>yes</Text>
        </Pressable>
      </View>
    </View>
  )
}

const GameInfoBar = observer(({grid}: {grid: Grid}) => {
  const [showResetBoardModal, setShowResetBoardModal] = useState(false)
  const onResetSquarePress = () => {
    if(!grid.isGameOver){setShowResetBoardModal(true)}
    else{grid.reset()}
  }

  const componentHeight = gridSides()/5
  console.log('gridSides', gridSides())
  const scoreFontSize = (30 / 475) * gridSides()

  const onNoCallback = () => {console.log('user pressed no'); setShowResetBoardModal(false);}
  const onYesCallback = ()=> {console.log('user pressed yes'); grid.reset(); setShowResetBoardModal(false);}
  return(
    <View style={styles.gameInfoBar}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showResetBoardModal}
        onRequestClose={() => setShowResetBoardModal(false)}
      >
        <ResetBoardModal onNo={onNoCallback} onYes={onYesCallback} />
      </Modal>
      <View style={styles.scoresContainer}>
        <Text style={[{fontSize: scoreFontSize}, styles.scoresText]} >Score: {grid.currentScore}</Text>
        <Text style={[{fontSize: scoreFontSize}, styles.scoresText]} >Undo Count: {grid.undoCount}</Text>
      </View>
      <View style={[styles.buttonsContainer]} >
        <Pressable
          testID='undoButton'
          onPress={()=>{grid.undo()}}
        >
          <UndoIcon width={componentHeight} height={componentHeight} />
        </Pressable>
        <Pressable
          testID='resetButton'
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
