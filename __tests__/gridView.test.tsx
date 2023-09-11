import { act, render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'

import Grid, { Direction, colorTestGrid } from '../src/grid';
import importedTestGrids from './helpers/testGrids'

import { GridView4 } from '../components/GameBoard';
import { View } from 'react-native';
import { directionValueArray, makeSnapshot } from './helpers/helperValuesAndFunctions';
import { GridOverlayState } from '../src/overlayState';
import { overlayTimeouts, testIDs } from '../src/globalValues';
import { overlayText } from '../components/GridOverlay';

function TestComponentWrapper({children}:{children: JSX.Element}) {
  return(
    <View style={[{height: 530, width: 530}]} >
      {children}
    </View>
  )
}

describe('GridView4', () => {
  beforeEach(()=>{
    GridOverlayState.hideOverlay()
  })
  test('renders', () => {
    const testGrid = new Grid({grid: colorTestGrid()});
    render(<GridView4 grid={testGrid} />, {wrapper: TestComponentWrapper});
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })

  test('updates when props update', () => {
    const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
    render(<GridView4 grid={testGrid} />)
    const screenA = makeSnapshot(screen)
    act(()=>{testGrid.swipe(Direction.left)})
    expect(screenA).not.toStrictEqual(makeSnapshot(screen))
  })
})

describe('GameLost overlay', () => {
  beforeEach(()=>{
    GridOverlayState.hideOverlay()
  })

  describe('renders', () => {
    beforeEach(()=>{
      GridOverlayState.hideOverlay()
    })
    test('when initialised with end game', async () => {
      // shouldn't occur, but better to be safe
      const testGrid = new Grid({grid: importedTestGrids.gameOverInputs.noSwipe})
      render(<GridView4 grid={testGrid} />, {wrapper: TestComponentWrapper})
      expect(await screen.findByText("Game Over")).toBeOnTheScreen()
    })
  
    test.each(directionValueArray)('when props update with a %s swipe into an end game', async (direction) => {
    // test.each([Direction.left])('when props update with a %s swipe into an end game', (direction) => {
      // this only tests that the screen renders new prop values
      // it doesn't test actual user inputs
      const testGrid = new Grid({grid: importedTestGrids.gameOverInputs[direction]})
      render(<GridView4 grid={testGrid} />)
      await waitFor(()=>expect(screen.queryByText("Game Over")).not.toBeOnTheScreen())
      expect(screen.toJSON()).toMatchSnapshot()
      await act(() => {testGrid.swipe(direction)})
      await waitFor(()=>expect(screen.queryByText("Game Over")).toBeOnTheScreen())
      expect(screen.toJSON()).toMatchSnapshot()
    })

    test.todo('after animations')
  })

  const testGridParams = {
    grid: importedTestGrids.gameOverInputs.left,
    score: 40200,
    undoCount: 69
  }
  test('resets board when "yes" is pressed', async () => {
    const testGrid = new Grid(testGridParams)
    render(<GridView4 grid={testGrid} />)
    await waitFor(()=>expect(testGrid.activeGrid).toStrictEqual(testGridParams.grid))
    act(()=>{testGrid.swipe(Direction.left)})
    const user = userEvent.setup()
    await user.press(screen.getByText("yes"))
    await waitFor(()=>expect(testGrid.activeGrid).not.toStrictEqual(testGridParams.grid))
    expect(testGrid.currentScore).toBe(0)
    expect(testGrid.undoCount).toBe(0)
  })

  test('performs undo behaviour when no is pressed', async () => {
    const testGrid = new Grid(testGridParams)
    render(<GridView4 grid={testGrid} />)
    expect(testGrid.currentScore).toBe(testGridParams.score)
    expect(testGrid.undoCount).toBe(testGridParams.undoCount)
    await waitFor(()=>expect(testGrid.activeGrid).toStrictEqual(testGridParams.grid))
    act(()=>{testGrid.swipe(Direction.left)})
    await waitFor(()=>expect(testGrid.currentScore).not.toBe(testGridParams.score))
    const user = userEvent.setup()
    await user.press(screen.getByText("no"))
    await waitFor(()=>expect(testGrid.activeGrid).toStrictEqual(testGridParams.grid))
    expect(testGrid.currentScore).toBe(testGridParams.score)
    expect(testGrid.undoCount).toBe(testGridParams.undoCount + 1)
  })
})

describe ('GameWon overlay', () => {
  const testScore = 69000
  const testUndoCount = 42
  beforeEach(()=>{
    GridOverlayState.hideOverlay()
  })
  describe('is rendered', ()=>{
    let testGrid: Grid;
    beforeEach(()=>{
      testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin, score: testScore, undoCount: testUndoCount})
    })

    test('when 2048 is reached', () => {
      render(<GridView4 grid={testGrid} />)
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.left)})
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.subtitle)).toBeOnTheScreen()
      expect(screen.queryByTestId(testIDs.confirmResetButtons)).not.toBeOnTheScreen()
      expect(screen.toJSON()).toMatchSnapshot()
    })
    test('then disappears after a short period of time', async () => {
      render(<GridView4 grid={testGrid} />)
      act(()=>{testGrid.swipe(Direction.left)})
      jest.advanceTimersByTime(overlayTimeouts.gameWon/2)
      // overlay should still be on screen when not enough time has passed
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.subtitle)).toBeOnTheScreen()
      jest.advanceTimersByTime(overlayTimeouts.gameWon)
      // await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay))
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    })

    test('then disappears when tapped', async () => {
      render(<GridView4 grid={testGrid} />)
      act(()=>{testGrid.swipe(Direction.left)})
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).toBeOnTheScreen()
      const user = userEvent.setup()
      await user.press(screen.getByText(overlayText.gameWon.title))
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    })
  })
  describe("doesn't render", ()=>{
    test("after the first time 2048 is reached", async () => {
      // i.e.  user presses back, the swipes to reach 2048 again
      const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin, score: testScore, undoCount: testUndoCount})
      render(<GridView4 grid={testGrid} />)
      act(()=>{testGrid.swipe(Direction.left)})
      const user = userEvent.setup()
      await user.press(screen.getByText(overlayText.gameWon.title))
      act(()=>{testGrid.undo()})
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      await waitFor(()=>expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen())
      act(()=>{testGrid.swipe(Direction.left)})
      expect(testGrid.isGameWon).toBe(true)
      await waitFor(()=> expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    })
    
    test("when initialised with a grid containing 2048", () => {
      const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.alreadyWon, score: testScore, undoCount: testUndoCount})
      render(<GridView4 grid={testGrid} />)
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.left)})
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    })

    test("when initialised with a grid that's already won", () => {
      const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.alreadyWon, score: testScore, undoCount: testUndoCount})
      render(<GridView4 grid={testGrid} />)
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
      // make sure it stays not rendered
      act(()=>{testGrid.swipe(Direction.left)})
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    })
  })
  test.todo("renders after animations")
})