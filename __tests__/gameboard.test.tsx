import { act, render, screen, userEvent } from '@testing-library/react-native'

import { Direction } from '../src/grid';
import { OnlyPlace2Grid as Grid } from './helpers/gridMocks';
import importedTestGrids from './helpers/testGrids'

import GameBoard from '../src/GameBoard';
import { makeSnapshot } from './helpers/helperValuesAndFunctions';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';

jest.mock('../src/SVGIcons', () => {
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
    expect(screen.getByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot();
    act(() => {testGrid.swipe(Direction.left)})
    const secondTestScore = testScore + importedTestGrids.scores.left[0]
    expect(screen.getByText(`Score: ${secondTestScore}`)).toBeOnTheScreen()
    expect(screen.getByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  test('updates undo count and reverts score when Undo button is pressed', async () => {
    render(<GameBoard grid={testGrid} />)
    expect(screen.getByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.left)})
    const user = userEvent.setup()
    await user.press(screen.getByTestId('undoButton'))
    expect(screen.getByText(`Undo Count: ${testUndoCount + 1}`)).toBeOnTheScreen()
    expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
  })

  test('updates undo count correctly when Undo button is pressed multiple times', async () => {
    render(<GameBoard grid={testGrid} />)
    expect(screen.getByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.left)})
    const user = userEvent.setup()
    await user.press(screen.getByTestId('undoButton'))
    expect(screen.getByText(`Undo Count: ${testUndoCount + 1}`)).toBeOnTheScreen()
    expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
    // now press it five more times without swiping
    const finalScreen = makeSnapshot(screen);
    for(let i = 0; i < 5; i++){await user.press(screen.getByTestId('undoButton'))}
    expect(screen.getByText(`Undo Count: ${testUndoCount + 1}`)).toBeOnTheScreen()
    expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
    expect(makeSnapshot(screen)).toStrictEqual(finalScreen)
  })
})

describe('ResetGame overlay', () => {
  // interactive only; no testing through props updates
  const testScore = 40200
  const testUndoCount = 3
  const inputGrid = importedTestGrids.gameOverInputs.left // swipe up to keep playing
  let testGrid: Grid
  let user: UserEventInstance
  beforeEach(()=>{
    testGrid = new Grid({grid: inputGrid, score: testScore, undoCount: testUndoCount})
    user = userEvent.setup()
  })

  test('is rendered when Reset button is pressed', async () => {
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByText("Are you sure you want to reset?")).not.toBeOnTheScreen()
    expect(screen.queryByText("yes")).not.toBeOnTheScreen()
    expect(screen.queryByText("no")).not.toBeOnTheScreen()
    await user.press(screen.getByTestId('resetButton'))
    expect(screen.queryByText("Are you sure you want to reset?")).toBeOnTheScreen()
    expect(screen.queryByText("yes")).toBeOnTheScreen()
    expect(screen.queryByText("no")).toBeOnTheScreen()
  })

  test('resets board when Yes button is pressed', async () => {
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByText(`Score: ${testScore}`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    expect(testGrid.activeGrid).toStrictEqual(inputGrid)
    const screenA = makeSnapshot(screen)
    await user.press(screen.getByTestId('resetButton'))
    await user.press(screen.getByText('yes'))
    expect(screen.queryByText(`Score: 0`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: 0`)).toBeOnTheScreen()
    expect(makeSnapshot(screen)).not.toEqual(screenA)
    expect(testGrid.activeGrid).not.toStrictEqual(inputGrid)
  })

  test("doesn't reset board when No button is pressed", async () => {
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByText(`Score: ${testScore}`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    expect(testGrid.activeGrid).toStrictEqual(inputGrid)
    const screenA = makeSnapshot(screen)
    await user.press(screen.getByTestId('resetButton'))
    await user.press(screen.getByText('no'))
    expect(screen.queryByText(`Score: ${testScore}`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    expect(makeSnapshot(screen)).toEqual(screenA)
    expect(testGrid.activeGrid).toStrictEqual(inputGrid)
  })

  test("doesn't render when game is lost, everything is just reset", async () => {
    render(<GameBoard grid={testGrid} />)
    act(()=>{testGrid.swipe(Direction.left)})
    expect(screen.queryByText("Are you sure you want to reset?")).not.toBeOnTheScreen()
    expect(screen.queryByText(`Score: ${testScore}`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    await user.press(screen.getByTestId('resetButton'))
    expect(screen.queryByText(`Score: 0`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: 0`)).toBeOnTheScreen()
    expect(testGrid).not.toStrictEqual(inputGrid)
  })
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