import { act, render, screen, userEvent } from '@testing-library/react-native'
import Grid, { Direction } from '../src/grid';
// import { OnlyPlace2Grid as Grid } from './helpers/gridMocks';
import importedTestGrids from './helpers/testGrids'
import GameInfoBar from '../src/GameInfoBar';

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

describe('GameInfoBar', () => {
  let testGrid: Grid;
  beforeEach(()=>{
    testGrid = new Grid({grid: importedTestGrids.resultGrids.down[0]});
  })
  test('renders', () => {
    render(<GameInfoBar grid={testGrid} />);
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })

  test('renders undo button', () => {
    render(<GameInfoBar grid={testGrid} />)
    expect(screen.getByTestId('undoButton')).toBeOnTheScreen()
  })

  test('renders reset button', () => {
    render(<GameInfoBar grid={testGrid} />)
    expect(screen.getByTestId('resetButton')).toBeOnTheScreen()
  })
})

test('score displays and updates correctly', () => {
  const testScore = 40200
  const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0], score: testScore})
  render(<GameInfoBar grid={testGrid} />)
  expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
  expect(screen.toJSON()).toMatchSnapshot();
  act(() => {testGrid.swipe(Direction.left)})
  const secondTestScore = testScore + importedTestGrids.scores.left[0]
  expect(screen.getByText(`Score: ${secondTestScore}`)).toBeOnTheScreen()
  expect(screen.toJSON()).toMatchSnapshot()
})

describe('undo button', () => {
  let testGrid: Grid;
  const startingUndoCount = 5
  const startingScore = 42069
  beforeEach(()=>{
    testGrid = new Grid({grid: importedTestGrids.numberedInputs[0], undoCount: startingUndoCount, score: startingScore})
  })
  describe('increments undo count', () => {
  
    test('when props are update', () => {
      render(<GameInfoBar grid={testGrid} /> )
      expect(screen.queryByText(`Undo Count: ${startingUndoCount}`)).toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.left); testGrid.undo();})
      expect(screen.queryByText(`Undo Count: ${startingUndoCount + 1}`)).toBeOnTheScreen()
    })

    test('when button is pressed', async () => {
      render(<GameInfoBar grid={testGrid} /> )
      expect(screen.getByText(`Undo Count: ${startingUndoCount}`)).toBeOnTheScreen()
      const user = userEvent.setup()
      act(()=>{testGrid.swipe(Direction.left)})
      await user.press(screen.getByTestId("undoButton"))
      expect(screen.getByText(`Undo Count: ${startingUndoCount + 1}`)).toBeOnTheScreen()
    })
  })

  describe('returns score to previous value', () => {

    test('when props are updated', () => {
      render(<GameInfoBar grid={testGrid} /> )
      expect(screen.queryByText(`Score: ${startingScore}`)).toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.left); testGrid.undo();})
      expect(screen.queryByText(`Score: ${startingScore}`)).toBeOnTheScreen()
    })

    test('when button is pressed', async () => {
      render(<GameInfoBar grid={testGrid} /> )
      expect(screen.queryByText(`Score: ${startingScore}`)).toBeOnTheScreen()
      const user = userEvent.setup()
      act(()=>{testGrid.swipe(Direction.left)})
      await user.press(screen.getByTestId("undoButton"))
      expect(screen.queryByText(`Score: ${startingScore}`)).toBeOnTheScreen()
    })
  })
})

test.todo('highscore changes depending on undo count') // highscore must be implemented first lol