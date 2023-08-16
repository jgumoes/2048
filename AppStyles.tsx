import { StyleSheet } from 'react-native';


export const textColours = {
  white: 'rgb(249, 246, 241)',
  black: 'rgb(119, 110, 101)'
}

export const gridViewBorderRadius = 10
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(251, 248, 239)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridView: {
    backgroundColor: 'rgb(187, 173, 160)',
    justifyContent: 'space-evenly',
    borderRadius: gridViewBorderRadius,
    alignSelf: 'center'
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

export const tileBackgroundColours = StyleSheet.create({
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

export const tileTextColours = StyleSheet.create({
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