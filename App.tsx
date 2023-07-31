import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Grid from './grid';

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
function GridView4() {
  const gridSides = Dimensions.get("window").width

  const grid = new Grid({gridSize: 4})
  return(
    <View style={[styles.gridView, {height: gridSides, width: gridSides}]}>
      <View style={styles.gridRow}>
        {grid.activeGrid[0].map(value => <Tile value={value} />)}
      </View>
      <View style={styles.gridRow}>
        {grid.activeGrid[1].map(value => <Tile value={value} />)}
      </View>
      <View style={styles.gridRow}>
        {grid.activeGrid[2].map(value => <Tile value={value} />)}
      </View>
      <View style={styles.gridRow}>
        {grid.activeGrid[3].map(value => <Tile value={value} />)}
      </View>
    </View>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <GridView4 />
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
    margin: '10',
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