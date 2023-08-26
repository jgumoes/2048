import { act, render, screen } from '@testing-library/react-native'
import Grid, { Direction } from '../grid';
import importedTestGrids from './helpers/testGrids'
import GameInfoBar from '../GameInfoBar';
import { WrappedGridView4 } from '../GameBoard';

jest.mock('react-native-gesture-handler')
describe('GameInfoBar', () => {
  test('renders', () => {
    const testGrid = new Grid({grid: importedTestGrids.resultGrids.down[0]});
    render(<GameInfoBar grid={testGrid} />);
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })
})

describe('back button count', () => {
  test.skip('displays correct count', () => {
    // Grid constructor must accept back button count first
    const testGrid = new Grid({})
  })
  test.todo('increments when pressed')
})

test('score displays and updates correctly', () => {
  const testScore = 40200
  const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0], score: testScore})
  const {rerender} = render(<GameInfoBar grid={testGrid} />)
  expect(screen.getByText(`Score: ${testScore}`)).toBeOnTheScreen()
  expect(screen.toJSON()).toMatchSnapshot();
  act(() => {testGrid.swipe(Direction.left)})
  rerender(<GameInfoBar grid={testGrid} />)
  const secondTestScore = testScore + importedTestGrids.scores.left[0]
  expect(screen.getByText(`Score: ${secondTestScore}`)).toBeOnTheScreen()
  expect(screen.toJSON()).toMatchSnapshot()
})

describe('undo button returns score and undo count to previous values', () => {
  test.todo('when props are updated')
  test.todo('when button is pressed')
})
test.todo('pressing reset displays modal')

describe('reseting the game resets the back button count and score', () => {
  test.todo('when props are updated')
  test.todo('when button is pressed and confirmed')
})