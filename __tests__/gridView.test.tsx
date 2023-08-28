import { act, render, screen } from '@testing-library/react-native'

import Grid, { Direction, colorTestGrid } from '../grid';
import { OnlyPlace2Grid } from './helpers/gridMocks';
import importedTestGrids from './helpers/testGrids'

import GameBoard, { GridView4 } from '../GameBoard';
import { View } from 'react-native';
import { directionValueArray } from './helpers/values';

jest.mock('../SVGIcons', () => {
  return{
    ResetSquare: () => {
      return <view />
    },
    UndoIcon: () => {
      return <view />
    }
  }
})

jest.mock('react-native-gesture-handler', () => {
  return {
    gestureHandlerRootHOC: (element: JSX.Element) => element,
    Gesture: {
      Pan: jest.fn().mockImplementation(() => {
        return new class {
          minDistance = jest.fn().mockReturnThis()
          maxPointers = jest.fn().mockReturnThis()
          onBegin = jest.fn().mockReturnThis()
          onStart = jest.fn().mockReturnThis()
        }
      })
    },
    GestureDetector: () => {
      return(<view />)
    }
  };
});

function TestComponentWrapper({children}:{children: JSX.Element}) {
  return(
    <View style={[{height: 530, width: 530}]} >
      {children}
    </View>
  )
}

describe('GridView4', () => {
  test('renders', () => {
    const testGrid = new Grid({grid: colorTestGrid()});
    render(<GridView4 grid={testGrid} />, {wrapper: TestComponentWrapper});
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })

  test('updates when props update', () => {
    const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
    render(<GridView4 grid={testGrid} />)
    const screenA = screen.toJSON()
    act(()=>{testGrid.swipe(Direction.left)})
    console.log(screen.toJSON())
    expect(screenA).not.toStrictEqual(screen.toJSON())
  })

  test.todo('updates when user swipes')
})

describe('GameLost overlay renders', () => {

  test('when initialised with end game', () => {
    // shouldn't occur, but better to be safe
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs.noSwipe})
    render(<GridView4 grid={testGrid} />, {wrapper: TestComponentWrapper})
    expect(screen.getByText("Game Over")).toBeOnTheScreen()
    expect(screen.getByText("Game Over")).toBeOnTheScreen()
  })

  test.each(directionValueArray)('when props update with a %s swipe into an end game', (direction) => {
    // this only tests that the screen renders new prop values
    // it doesn't test actual reactivity
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs[direction]})
    render(<GridView4 grid={testGrid} />, {wrapper: TestComponentWrapper})
    expect(screen.queryByText("Game Over")).not.toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot()
    act(() => {testGrid.swipe(direction)})
    // rerender(<GridView4 grid={testGrid} />)
    expect(screen.getByText("Game Over")).toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  test.todo('when user swipes %s into an end game')
  test.todo('after animations')
})

describe('GameWon overlay', () => {
  test.todo('is rendered when 2048 is reached')
  test.todo('disappears after a second')
  test.todo('disappears when tapped')
  test.todo("doesn't render when initialised with a grid containing 2048")
  test.todo("only renders once (the first time) when 2048 is reached, user presses back, the swipes to reach 2048 again")
  test.todo("renders after animations")
})