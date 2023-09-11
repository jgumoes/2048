import { act, render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'

import Grid, { Direction } from '../src/grid';
import importedTestGrids from './helpers/testGrids'

import GameBoard from '../components/GameBoard';
import { directionValueArray, makeSnapshot } from './helpers/helperValuesAndFunctions';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { GridOverlayState } from '../src/overlayState';
import { overlayTimeouts, testIDs } from '../src/globalValues';
import { overlayText } from '../components/GridOverlay';

describe('GameBoard', () => {
  const testScore = 40200
  const testUndoCount = 3
  let testGrid: Grid
  beforeEach(()=>{
    GridOverlayState.hideOverlay()
    testGrid = new Grid({grid: importedTestGrids.numberedInputs[0], score: testScore, undoCount: testUndoCount})
  })
  test('renders', async () => {
    render(
        <GameBoard grid={testGrid} />
      )
    await waitFor(()=>expect(screen.queryByTestId(testIDs.gridView)).toBeOnTheScreen())
    expect(screen.toJSON()).toMatchSnapshot()
    expect(screen.toJSON()).not.toBeNull()
  })

  test('updates score when Grid receives swipe command', async () => {
    render(<GameBoard grid={testGrid} />)
    await waitFor(()=>expect(screen.queryByTestId(testIDs.gridView)).toBeOnTheScreen())
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
    await waitFor(()=>expect(screen.queryByTestId(testIDs.gridView)).toBeOnTheScreen(), {timeout: 1000})
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
  const OverlayTitle = overlayText.resetGame.title
  const testScore = 40200
  const testUndoCount = 3
  const inputGrid = importedTestGrids.gameOverInputs.left // swipe up to keep playing
  let testGrid: Grid
  let user: UserEventInstance
  beforeEach(async ()=>{
    GridOverlayState.hideOverlay()
    testGrid = new Grid({grid: inputGrid, score: testScore, undoCount: testUndoCount})
    user = await userEvent.setup()
  })

  test('is rendered when Reset button is pressed', async () => {
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByText("Are you sure you want to reset?")).not.toBeOnTheScreen()
    expect(screen.queryByText("yes")).not.toBeOnTheScreen()
    expect(screen.queryByText("no")).not.toBeOnTheScreen()
    await user.press(screen.getByTestId('resetButton'))
    expect(screen.queryByText(OverlayTitle)).toBeOnTheScreen()
    expect(screen.queryByText("yes")).toBeOnTheScreen()
    expect(screen.queryByText("no")).toBeOnTheScreen()
  })

  test.todo("blocks Grid from recieving swipe commands")

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
    // this expect must be here because it fails in gridOverlayState.test.tsx for no reason
    expect(GridOverlayState.isHidden).toBe(true)
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
    // testGrid.swipe(Direction.left)
    render(<GameBoard grid={testGrid} />)
    await act(()=>{testGrid.swipe(Direction.left)})
    expect(screen.queryByText("Are you sure you want to reset?")).not.toBeOnTheScreen()
    // expect(screen.queryByText(`Score: ${testScore}`)).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: ${testUndoCount}`)).toBeOnTheScreen()
    await user.press(screen.getByTestId('resetButton'))
    expect(await screen.findByText(`Score: 0`, {timeout: 1000})).toBeOnTheScreen()
    expect(screen.queryByText(`Undo Count: 0`)).toBeOnTheScreen()
    expect(testGrid).not.toStrictEqual(inputGrid)
  })

  test.todo("renders when GameWon overlay is on screen and reset button is pressed")
  test.todo("renders when undoOverlay is on screen and reset button is pressed")
})

describe('GameWon overlay', () => {
  beforeEach(()=>{
    GridOverlayState.hideOverlay()
  })
  test('is rendered correctly when 2048 is reached', async () => {
    const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.left)})
    await waitFor(()=> expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
    await waitFor(()=> expect(screen.queryByText(overlayText.gameWon.title)).toBeOnTheScreen())
    await waitFor(()=> expect(screen.queryByText(overlayText.gameWon.subtitle)).toBeOnTheScreen())
    await waitFor(()=> expect(screen.queryByTestId("ConfirmResetButtons")).not.toBeOnTheScreen())
    expect(screen.toJSON()).toMatchSnapshot()
    jest.advanceTimersByTime(overlayTimeouts.gameWon + 500)
    // swipe to win again, without the overlay
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
    act(()=>{testGrid.swipe(Direction.left)})
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    
  })

  test.todo("blocks Grid from recieving swipe commands")

  test('disapears after a period of time', async () => {
    const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.left)})
    await waitFor(()=> expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
    jest.advanceTimersByTime(overlayTimeouts.gameWon + 500)
    // overlay should have disappeared
    await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay), {timeout: overlayTimeouts.gameWon*10})
    await waitFor(()=> expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen(), {timeout: overlayTimeouts.gameWon})
    await waitFor(()=> expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen())
    await waitFor(()=> expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen())
  })

  test('has a timeout between 0.5 and 10 seconds', () => {
    // I might change this value when messing about,
    // this test is a reminder to change it back
    expect(overlayTimeouts.undoButton).toBeGreaterThanOrEqual(500)
    expect(overlayTimeouts.undoButton).toBeLessThanOrEqual(10000)
  })

  test('disappears when tapped', async () => {
    const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
    render(<GameBoard grid={testGrid} />)
    const user = userEvent.setup()
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.left)})
    await waitFor(()=>expect(screen.queryByText(overlayText.gameWon.title)).toBeOnTheScreen())
    await waitFor(()=>expect(screen.queryByText(overlayText.gameWon.subtitle)).toBeOnTheScreen())
    await user.press(screen.getByText(overlayText.gameWon.title))
    await waitFor(()=>expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen())
    await waitFor(()=>expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen())
  })

  test("doesn't render when initialised with a grid containing 2048",async () => {
    const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
    testGrid.swipe(Direction.left)
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
  })

  test("doesn't render when initialised with a grid containing higher than 2048",async () => {
    const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.alreadyWon})
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
  })

  test("only renders the first time when 2048 is reached, user presses back, the swipes to reach 2048 again",async () => {
    const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
    render(<GameBoard grid={testGrid} />)
    const user = userEvent.setup()
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    // swipe to win
    act(()=>{testGrid.swipe(Direction.left)})
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
    expect(screen.queryByText(overlayText.gameWon.title)).toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).toBeOnTheScreen()
    // undo
    await user.press(screen.getByTestId(testIDs.undoButton))
    jest.advanceTimersByTime(overlayTimeouts.undoButton * 2)
    // await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay))
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    // swipe to win again, without the overlay
    act(()=>{testGrid.swipe(Direction.left)})
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
    expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    
  })
})

describe('UndoButton overlay', ()=>{
  let testGrid: Grid;
  beforeEach(()=>{
    GridOverlayState.hideOverlay()
    testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
  })

  test.todo("blocks Grid from recieving swipe commands")

  describe('renders', () => {
    let losingGrid: Grid
    beforeEach(()=>{
      losingGrid = new Grid({grid: importedTestGrids.gameOverInputs.left})
    })
    test('when Undo button is pressed', async () => {
      render(<GameBoard grid={testGrid} />)
      act(()=>{testGrid.swipe(Direction.left)})
      const user = userEvent.setup()
      await user.press(screen.getByTestId(testIDs.undoButton))
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
      expect(screen.getByText(overlayText.undoButton.title)).toBeOnTheScreen()
      expect(screen.getByText(overlayText.undoButton.subtitle)).toBeOnTheScreen()
    })
  
    test('when GameLost overlay is on screen and undo button is pressed', async () => {
      render(<GameBoard grid={losingGrid} />)
      act(()=>{losingGrid.swipe(Direction.left)})
      await screen.findByTestId(testIDs.gridOverlay)
      const user = userEvent.setup()
      await user.press(screen.getByTestId(testIDs.undoButton))
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
      await waitFor(() => expect(screen.getByText(overlayText.undoButton.title)).toBeOnTheScreen())
      await waitFor(() => expect(screen.getByText(overlayText.undoButton.subtitle)).toBeOnTheScreen())
      await waitFor(() => expect(screen.getByText(`Undo Count: 1`)).toBeOnTheScreen())
    })

    test("when GameLost overlay is on screen and 'no' is pressed", async () => {
      render(<GameBoard grid={losingGrid} />)
      act(()=>{losingGrid.swipe(Direction.left)})
      console.log(losingGrid.activeGrid)
      await screen.findByTestId(testIDs.gridOverlay)
      console.log(screen.toJSON())
      const user = userEvent.setup()
      await user.press(screen.getByText("no"))
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      expect(screen.getByText(overlayText.undoButton.title)).toBeOnTheScreen()
      expect(screen.getByText(overlayText.undoButton.subtitle)).toBeOnTheScreen()
    })
  })

  describe("doesn't render", ()=>{
    test('because the grid has just been loaded', async () => {
      render(<GameBoard grid={testGrid} />)
      const user = userEvent.setup()
      await user.press(screen.getByTestId(testIDs.undoButton))
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.undoButton.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.undoButton.subtitle)).not.toBeOnTheScreen()
    })

    test('when GameWon overlay is on screen', async () => {
      const winningGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
      render(<GameBoard grid={winningGrid} />)
      act(()=>{winningGrid.swipe(Direction.left)})
      await waitFor(() => screen.findByTestId(testIDs.gridOverlay))
      await waitFor(() => expect(screen.getByText(overlayText.gameWon.title)).toBeOnTheScreen())
      expect(screen.getByText(overlayText.gameWon.subtitle)).toBeOnTheScreen()
      const user = userEvent.setup()
      await user.press(screen.getByTestId(testIDs.undoButton))
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      expect(screen.queryByText(overlayText.undoButton.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.undoButton.subtitle)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.gameWon.subtitle)).not.toBeOnTheScreen()
    })

    test("because the grid hasn't changed since the last button press", async () => {
      // const screen = render(<GameBoard grid={testGrid} />)
      render(<GameBoard grid={testGrid} />)
      await act(()=>{testGrid.swipe(Direction.left)})
      const user = userEvent.setup()
      await user.press(screen.getByTestId(testIDs.undoButton))
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
      jest.advanceTimersByTime(overlayTimeouts.undoButton + 500)
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen(), {timeout: overlayTimeouts.undoButton*10})
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      // press again without swiping
      await user.press(screen.getByTestId(testIDs.undoButton))
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      expect(screen.queryByText(overlayText.undoButton.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.undoButton.subtitle)).not.toBeOnTheScreen()
      // make sure it isn't triggered by a swipe
      // i.e. the overlay isn't queued pending a swipe
      await act(()=>{testGrid.swipe(Direction.left)})
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      // expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      await waitFor(() => expect(screen.queryByText(overlayText.undoButton.title)).not.toBeOnTheScreen())
      await waitFor(() => expect(screen.queryByText(overlayText.undoButton.subtitle)).not.toBeOnTheScreen())
    })

    test("when ResetGame overlay is on screen and user has already swiped", async () => {
      // i.e. grid.isUndoAllowed is true
      render(<GameBoard grid={testGrid} />)
      act(()=>{testGrid.swipe(Direction.left)})
      const user = userEvent.setup()
      await user.press(screen.getByTestId(testIDs.resetButton))
      await waitFor(()=>{
        expect(screen.getByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      })
      expect(screen.getByText(overlayText.resetGame.title)).toBeOnTheScreen()
      expect(testGrid.isUndoAllowed).toBe(true)
      await user.press(screen.getByTestId(testIDs.undoButton))
      await waitFor(()=>{
        // screen.getByTestId(testIDs.gridOverlay)
        expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      })
      // await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay))
      expect(screen.queryByText(overlayText.undoButton.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.undoButton.subtitle)).not.toBeOnTheScreen()
      await waitFor(() => expect(GridOverlayState.isHidden).toBe(true))
    })

    test("when ResetGame overlay is on screen and user hasn't already swiped", async () => {
      // i.e. grid.isUndoAllowed is false
      render(<GameBoard grid={testGrid} />)
      const user = userEvent.setup()
      await user.press(screen.getByTestId(testIDs.resetButton))
      await waitFor(()=>{
        expect(screen.getByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      })
      expect(screen.getByText(overlayText.resetGame.title)).toBeOnTheScreen()
      expect(testGrid.isUndoAllowed).toBe(false)
      await user.press(screen.getByTestId(testIDs.undoButton))
      await waitFor(()=>{
        // screen.getByTestId(testIDs.gridOverlay)
        expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      })
      // await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay))
      expect(screen.queryByText(overlayText.undoButton.title)).not.toBeOnTheScreen()
      expect(screen.queryByText(overlayText.undoButton.subtitle)).not.toBeOnTheScreen()
      await waitFor(() => expect(GridOverlayState.isHidden).toBe(true))
    })
  })

  test('disappears after some time', async () => {
    // testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
    render(<GameBoard grid={testGrid} />)
    act(()=>{testGrid.swipe(Direction.left)})
    const user = userEvent.setup()
    await user.press(screen.getByTestId(testIDs.undoButton))
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
    expect(screen.getByText(overlayText.undoButton.title)).toBeOnTheScreen()
    expect(screen.getByText(overlayText.undoButton.subtitle)).toBeOnTheScreen()
    expect(screen.queryByTestId(testIDs.confirmResetButtons)).not.toBeOnTheScreen()
    jest.advanceTimersByTime(overlayTimeouts.undoButton * 2)
    await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay), {timeout: overlayTimeouts.undoButton*10})
    // expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.undoButton.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.undoButton.subtitle)).not.toBeOnTheScreen()
  })

  test('has a timeout between 1 and 5 seconds', () => {
    // I might change this value when messing about,
    // this test is a reminder to change it back
    expect(overlayTimeouts.undoButton).toBeGreaterThanOrEqual(1000)
    expect(overlayTimeouts.undoButton).toBeLessThanOrEqual(5000)
  })

  test("doesn't disappear when pressed", async () => {
    render(<GameBoard grid={testGrid} />)
    act(()=>{testGrid.swipe(Direction.left)})
    const user = userEvent.setup()
    await user.press(screen.getByTestId(testIDs.undoButton))
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
    expect(screen.getByText(overlayText.undoButton.title)).toBeOnTheScreen()
    expect(screen.getByText(overlayText.undoButton.subtitle)).toBeOnTheScreen()
    await user.press(screen.getByText(overlayText.undoButton.title))
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    expect(screen.getByText(overlayText.undoButton.title)).toBeOnTheScreen()
    expect(screen.getByText(overlayText.undoButton.subtitle)).toBeOnTheScreen()
  })
})

describe("GameLost overlay", () => {
  beforeEach(()=>{
    GridOverlayState.hideOverlay()
  })

  test.todo("blocks Grid from recieving swipe commands")

  test("renders when gameboard loads with lost game", async () => {
    // this shouldn't happen, but it's worth testing this behaviour
    // just in case of some unforseable bug
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs.noSwipe})
    expect(testGrid.isGameOver).toBe(true)
    expect(GridOverlayState.isHidden).toBe(true)
    render(<GameBoard grid={testGrid} />)
    expect(testGrid.isGameOver).toBe(true)
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
    expect(screen.queryByText(overlayText.gameLost.title)).toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameLost.subtitle)).toBeOnTheScreen()
    expect(screen.queryByTestId(testIDs.confirmResetButtons))
    expect(screen.toJSON()).toMatchSnapshot()
  })

  test.each(directionValueArray)('renders when game is swiped %s into a losing game', async (direction) => {
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs[direction]})
    render(<GameBoard grid={testGrid} />)
    expect(testGrid.isGameOver).toBe(false)
    await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
    expect(screen.queryByText(overlayText.gameLost.title)).not.toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameLost.subtitle)).not.toBeOnTheScreen()
    expect(screen.queryByTestId(testIDs.confirmResetButtons)).not.toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot()
    await act(() => {testGrid.swipe(direction)})
    expect(testGrid.isGameOver).toBe(true)
    await waitFor(()=> expect(screen.getByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
    expect(screen.queryByText(overlayText.gameLost.title)).toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameLost.subtitle)).toBeOnTheScreen()
    expect(screen.queryByTestId(testIDs.confirmResetButtons)).toBeOnTheScreen()
    expect(screen.toJSON()).toMatchSnapshot()
    })
})