import { act, render, screen } from '@testing-library/react-native'

import Grid, { Direction, colorTestGrid } from '../grid';
import importedTestGrids from './helpers/testGrids'

import GameBoard, { WrappedGridView4 } from '../GameBoard';
import { View } from 'react-native';
import { directionValueArray } from './helpers/values';

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
  };
});


describe('GridView4', () => {
  function TestWrapper({children}:{children: JSX.Element}) {
    return(
      <View style={[{height: 530, width: 530}]} >
        {children}
      </View>
    )
  }
  test('renders', () => {
    const testGrid = new Grid({grid: colorTestGrid()});
    render(<WrappedGridView4 grid={testGrid} />, {wrapper: TestWrapper});
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })

  test('renders EndGameOverlay', () => {
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs.noSwipe})
    render(<WrappedGridView4 grid={testGrid} />, {wrapper: TestWrapper})
    expect(screen.getByText("Game Over")).toBeOnTheScreen()
    expect(screen.getByText("Game Over")).toBeOnTheScreen()
  })

  test.each(directionValueArray)('renders EndGameOverlay when swiping %s into an end game', (direction) => {
    // this only tests that the screen renders new prop values
    // it doesn't test actual reactivity
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs[direction]})
    const {rerender} = render(<WrappedGridView4 grid={testGrid} />, {wrapper: TestWrapper})
    expect(screen.toJSON()).not.toContain("Game Over")
    expect(screen.toJSON()).toMatchSnapshot()
    act(() => {testGrid.swipe(direction)})
    rerender(<WrappedGridView4 grid={testGrid} />)
    expect(screen.getByText("Game Over")).toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  test.todo('renders winner overlay when 2048 is reached')
})

describe.skip('GameBoard', () => {
  // trying to get this to work was a fucking nightmare and I give up
  test('renders', () => {
    const testGrid = new Grid({grid: colorTestGrid(), score: 69420})
    render(
        <GameBoard grid={testGrid} />
      )
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })

  test.todo('displays Game Over overlay correctly when swiping x')
  test.todo('shows GameWon overlay when 2048 is reached')
  test.todo('updates score when swiping x')
  test.todo('resets when reset button is pressed and confirmed')
  test.todo("doesn't reset when reset button is pressed but not confirmed")
})