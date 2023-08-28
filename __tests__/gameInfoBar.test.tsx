import { act, render, screen } from '@testing-library/react-native'
import { Direction } from '../src/grid';
import { OnlyPlace2Grid as Grid } from './helpers/gridMocks';
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
  const startingCount = 5
  const startingScore = 42069
  beforeEach(()=>{
    testGrid = new Grid({grid: importedTestGrids.numberedInputs[0], undoCount: startingCount, score: startingScore})
  })
  describe('increments undo count', () => {
  
    test('when props are update', () => {
      render(<GameInfoBar grid={testGrid} /> )
      expect(screen.queryByText(`Undo Count: ${startingCount}`)).toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.left); testGrid.undo();})
      expect(screen.queryByText(`Undo Count: ${startingCount + 1}`)).toBeOnTheScreen()
    })

    test.todo('when button is pressed')
  })

  describe('returns score to previous value', () => {

    test('when props are updated', () => {
      render(<GameInfoBar grid={testGrid} /> )
      expect(screen.queryByText(`Score: ${startingScore}`)).toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.left); testGrid.undo();})
      expect(screen.queryByText(`Score: ${startingScore}`)).toBeOnTheScreen()
    })

    test.todo('when button is pressed')
  })
})

describe('resetting the game resets the back button count and score', () => {
  let testGrid: Grid;
  const startingCount = 5
  const startingScore = 42069
  beforeEach(()=>{
    testGrid = new Grid({grid: importedTestGrids.numberedInputs[0], undoCount: startingCount, score: startingScore})
  })

  test('when props are updated', () => {
    render(<GameInfoBar grid={testGrid} />)
    expect(screen.queryByText(`Score: ${startingScore}`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: ${startingCount}`)).toBeOnTheScreen()
    act(()=>testGrid.reset())
    expect(screen.queryByText(`Score: 0`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: 0`)).toBeOnTheScreen()
  })
  test.todo('when button is pressed and confirmed')
})

test.todo('highscore changes depending on undo count') // highscore must be implemented first lol