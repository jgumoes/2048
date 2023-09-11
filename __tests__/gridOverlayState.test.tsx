import { act, render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'

import Grid, { Direction, colorTestGrid } from '../src/grid';
import importedTestGrids from './helpers/testGrids'

import GameBoard from '../components/GameBoard';
import { directionValueArray } from './helpers/helperValuesAndFunctions';
import { GridOverlayState } from '../src/overlayState';
import { overlayTimeouts, testIDs } from '../src/globalValues';
import { overlayText } from '../components/GridOverlay';

describe('GridOverlayState is hidden', ()=>{
  let isBeforeEachUsed: boolean;
  // eslint-disable-next-line prefer-const
  isBeforeEachUsed = false

  // beforeEach(() => {
  //   // this suit is to test that the GridOverlay
  //   // is being hidden. This function invalidates
  //   // these tests, and must be not be used
  //   GridOverlayState.hideOverlay()
  //   isBeforeEachUsed = true
  // })

  test("when game starts with a valid grid", ()=>{
    const testGrid = new Grid()
    render(<GameBoard grid={testGrid}/>)
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    expect(GridOverlayState.isHidden).toBe(true)
  })

  test.each(directionValueArray)("when a valid grid is swiped %s to create another valid grid", (direction)=>{
    const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
    render(<GameBoard grid={testGrid} />)
    act(()=>{testGrid.swipe(direction)})
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    expect(GridOverlayState.isHidden).toBe(true)
  })

  describe("when game is won", () => {
    test("and overlay is pressed", async ()=>{
      const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
      render(<GameBoard grid={testGrid} />)
      expect(GridOverlayState.isHidden).toBe(true)
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.down)})
      expect(GridOverlayState.isHidden).toBe(false)
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      const user = userEvent.setup()
      await user.press(await screen.findByTestId(testIDs.gridOverlay))
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(GridOverlayState.isHidden).toBe(true)
    })
  
    test("and overlay times out", async ()=>{
      const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
      render(<GameBoard grid={testGrid} />)
      // overlay shouldn't be on screen yet
      expect(GridOverlayState.isHidden).toBe(true)
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      act(()=>{testGrid.swipe(Direction.down)})
      // overlay should be on screen now
      expect(GridOverlayState.isHidden).toBe(false)
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      const partialTime = 500 // must be less than the real timeout value
      jest.advanceTimersByTime(partialTime)
      // overlay should still be on screen
      expect(GridOverlayState.isHidden).toBe(false)
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      jest.advanceTimersByTime(partialTime + overlayTimeouts.gameWon)
      // overlay should have expired now
      await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      expect(GridOverlayState.isHidden).toBe(true)
    })

    test("and UndoButton is pressed",async () => {
      const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
      render(<GameBoard grid={testGrid} />)
      expect(GridOverlayState.isHidden).toBe(true)
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      // win the game
      act(()=>{testGrid.swipe(Direction.down)})
      expect(GridOverlayState.isHidden).toBe(false)
      expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
      const user = userEvent.setup()
      await user.press(await screen.findByTestId(testIDs.undoButton))
      expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
      expect(GridOverlayState.isHidden).toBe(true)
    })

  })

  test("when undo is pressed and overlay times out", async ()=>{
    const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
    render(<GameBoard grid={testGrid} />)
    // overlay shouldn't be on screen yet
    expect(GridOverlayState.isHidden).toBe(true)
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.down)})
    const user = userEvent.setup()
    await user.press(screen.getByTestId(testIDs.undoButton))
    // overlay should be on screen now
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    const partialTime = 500 // must be less than the real timeout value
    jest.advanceTimersByTime(partialTime)
    // overlay should still be on screen
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    jest.advanceTimersByTime(partialTime + overlayTimeouts.undoButton)
    // overlay should have expired now
    await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay), {timeout: 10000})
    // await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
    expect(GridOverlayState.isHidden).toBe(true)
  })

  test("when game is lost and 'yes' is pressed", async ()=>{
    const testGrid = new Grid({grid: colorTestGrid()})
    render(<GameBoard grid={testGrid} />)
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    expect(GridOverlayState.isHidden).toBe(true)
    act(()=>{testGrid.swipe(Direction.left)})
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    expect(GridOverlayState.isHidden).toBe(false)
    const user = userEvent.setup()
    await user.press(await screen.findByText('yes'))
    await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
    expect(GridOverlayState.isHidden).toBe(true)
  })

  test("when game is lost and 'no' is pressed and times out", async ()=>{
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs.down})
    render(<GameBoard grid={testGrid} />)
    // overlay shouldn't be on screen yet
    expect(GridOverlayState.isHidden).toBe(true)
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.down)})
    // GameLost overlay should be on screen
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameLost.title)).toBeOnTheScreen()
    const user = userEvent.setup()
    await user.press(screen.getByText('no'))
    // UndoButton overlay should be on screen now
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    expect(screen.queryByText(overlayText.undoButton.title)).toBeOnTheScreen()
    const partialTime = 500 // must be less than the real timeout value
    jest.advanceTimersByTime(partialTime)
    // overlay should still be on screen
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    jest.advanceTimersByTime(partialTime + overlayTimeouts.undoButton)
    // overlay should have expired now
    await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay), {timeout: 10000})
    // await waitFor(() => expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
    expect(GridOverlayState.isHidden).toBe(true)
  })

  test("when game is lost and 'undo' is pressed and times out", async ()=>{
    // I'm not sure that I want the UndoButton overlay to render in this way
    const testGrid = new Grid({grid: importedTestGrids.gameOverInputs.down})
    render(<GameBoard grid={testGrid} />)
    // overlay shouldn't be on screen yet
    expect(GridOverlayState.isHidden).toBe(true)
    expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    act(()=>{testGrid.swipe(Direction.down)})
    // GameLost overlay should be on screen
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    expect(screen.queryByText(overlayText.gameLost.title)).toBeOnTheScreen()
    const user = userEvent.setup()
    await user.press(screen.getByTestId(testIDs.undoButton))
    // UndoButton overlay should be on screen now
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    expect(screen.queryByText(overlayText.undoButton.title)).toBeOnTheScreen()
    const partialTime = 500 // must be less than the real timeout value
    jest.advanceTimersByTime(partialTime)
    // overlay should still be on screen
    expect(GridOverlayState.isHidden).toBe(false)
    expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen()
    jest.advanceTimersByTime(partialTime + overlayTimeouts.undoButton)
    // overlay should have expired now
    // expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen()
    await waitForElementToBeRemoved(() => screen.queryByTestId(testIDs.gridOverlay), {timeout: 10000})
    expect(GridOverlayState.isHidden).toBe(true)
  })

  describe("when ResetButton is pressed", () => {
    test("and 'yes' is pressed", async ()=>{
      const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
      render(<GameBoard grid={testGrid} />)
      expect(GridOverlayState.isHidden).toBe(true)
      const user = userEvent.setup()
      await user.press(screen.getByTestId('resetButton'))
      expect(GridOverlayState.isHidden).toBe(false)
      await user.press(screen.getByText('yes'))
      expect(screen.queryByText(`Score: 0`)).toBeOnTheScreen()
      expect(screen.queryByText(`Undo Count: 0`)).toBeOnTheScreen()
      expect(GridOverlayState.isHidden).toBe(true)
    })
  
    test("and 'no' is pressed", async ()=>{
      const testGrid = new Grid({grid: importedTestGrids.gameWonInputs.swipeToWin})
      render(<GameBoard grid={testGrid} />)
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridView)).toBeOnTheScreen())
      const user = userEvent.setup()
      await user.press(await screen.findByTestId("resetButton"))
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen(), {timeout: 3000})
      await waitFor(()=>expect(GridOverlayState.isHidden).toBe(false), {timeout: 1000})
      await user.press(screen.getByText('no'))
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      expect(GridOverlayState.isHidden).toBe(true)
    })

    test("without swiping, and UndoButton is pressed and times out", async () => {
      // i.e. Grid.isUndoAllowed === false
      const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
      render(<GameBoard grid={testGrid} />)
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridView)).toBeOnTheScreen())
      const user = userEvent.setup()
      await user.press(await screen.findByTestId("resetButton"))
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
      await waitFor(()=>expect(GridOverlayState.isHidden).toBe(false))
      await user.press(await screen.findByTestId(testIDs.undoButton))
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      expect(GridOverlayState.isHidden).toBe(true)
    })

    test("with swiping, and UndoButton is pressed and times out", async () => {
      // i.e. Grid.isUndoAllowed === true
      const testGrid = new Grid({grid: importedTestGrids.numberedInputs[0]})
      render(<GameBoard grid={testGrid} />)
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridView)).toBeOnTheScreen())
      act(() => {testGrid.swipe(Direction.left)})
      const user = userEvent.setup()
      await user.press(await screen.findByTestId("resetButton"))
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).toBeOnTheScreen())
      await waitFor(()=>expect(GridOverlayState.isHidden).toBe(false))
      await user.press(await screen.findByTestId(testIDs.undoButton))
      await waitFor(()=>expect(screen.queryByTestId(testIDs.gridOverlay)).not.toBeOnTheScreen())
      expect(GridOverlayState.isHidden).toBe(true)
    })
  })
  
  test.todo("when users press back into the Grid Select screen and loads a different grid size")

  test("and beforeEach isn't being used to hide it", ()=>{
    // the beforeEach block is useful for debugging,
    // but this describe block is invalid if it's
    // calling GridOverlayState.isHidden
    expect(isBeforeEachUsed).toBe(false)
  })
})