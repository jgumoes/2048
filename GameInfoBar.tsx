import { Text, View, Modal, StyleSheet } from 'react-native';
import Grid from './grid';
import { RectButton, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import ResetSquare from './assets/restart-square.svg'
import UndoIcon from './assets/undo.svg'
import React, { useState } from 'react';

const ResetBoardModal = ({onYes, onNo}: {onYes: () => void, onNo: () => void}) => {
  return(
    <View style={styles.resetBoardModal}>
      <Text style={styles.resetBoardModalText}>Are you sure you want to reset?</Text>
      <View>
        <RectButton onPress={onNo}>
        <Text style={styles.resetBoardModalText}>no</Text>
        </RectButton>
        <RectButton onPress={onYes}>
        <Text style={styles.resetBoardModalText}>yes</Text>
        </RectButton>
      </View>
    </View>
  )
}

const WrappedResetBoardModal = gestureHandlerRootHOC(ResetBoardModal)

export default function GameInfoBar({grid}: {grid: Grid}) {
  const [showResetBoardModal, setShowResetBoardModal] = useState(false)
  const onResetSquarePress = () => setShowResetBoardModal(true)

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
        <WrappedResetBoardModal onNo={onNoCallback} onYes={onYesCallback} />
      </Modal>
      <View>
        <Text>Score: {grid.currentScore}</Text>
        <Text>Undo Button Count: {grid.undoCount}</Text>
      </View>
      <RectButton onPress={()=>{grid.undo()}} >
        {/* <Text>{grid.undoCount}</Text> */}
        <UndoIcon width={100} height={100} />
      </RectButton>
      <RectButton onPress={onResetSquarePress} >
        <ResetSquare width={100} height={100} />
      </RectButton>
    </View>
  )
}

const styles = StyleSheet.create({
  gameInfoBar: {
    flexDirection: 'row'
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
  backButtonContainer: {
    flexDirection: "row",
    alignItems: 'center',
    // borderColor: '#1C274C',
    borderColor: '#000000',
    borderWidth: 10,
    borderStyle: 'solid',
  }
})
