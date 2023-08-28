import { act, render, screen } from '@testing-library/react-native'

import { Direction, colorTestGrid } from '../grid';
import { OnlyPlace2Grid as Grid } from './helpers/gridMocks';
import importedTestGrids from './helpers/testGrids'

import GameBoard from '../GameBoard';
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

describe('GameBoard', () => {
  const testScore = 40200
  const testUndoCount = 3
  let testGrid: Grid
  beforeEach(()=>{
    testGrid = new Grid({grid: importedTestGrids.numberedInputs[0], score: testScore, undoCount: testUndoCount})
  })
  test('renders', () => {
    render(
        <GameBoard grid={testGrid} />
      )
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })

  test('updates score when Grid receives swipe command', () => {
    render(<GameBoard grid={testGrid} />)
    expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot();
    act(() => {testGrid.swipe(Direction.left)})
    const secondTestScore = testScore + importedTestGrids.scores.left[0]
    expect(screen.getByText(`Score: ${secondTestScore}`)).toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot()
  })
  
  test.todo('updates score when user swipes x')

  test.todo('updates undo count when Undo button is pressed')

  test.todo('updates undo count correctly when Undo button is pressed multiple times')
})

describe('ResetGame overlay', () => {
  // interactive only; no testing through props updates
  test.todo('is rendered when Reset button is pressed')
  test.todo('resets board when Yes button is pressed') // remember the score and undo count
  test.todo("doesn't reset board when No button is pressed") // remember the score and undo count
})

describe('GameWon overlay', () => {
  // interactive only; no testing through props updates
  test.todo('is rendered when 2048 is reached')
  test.todo('disapears after a second')
  test.todo('disapears when tapped')
  test.todo("doesn't render when initialised with a grid containing 2048")
  test.todo("only renders the first time when 2048 is reached, user presses back, the swipes to reach 2048 again")
})

describe('ShameUser overlay', ()=>{
  // interactive only; no testing through props updates
  test.todo('renders when Undo button is pressed')
  test.todo('disappears after on second')
})