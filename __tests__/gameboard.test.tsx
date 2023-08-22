import { render, screen } from '@testing-library/react-native'

import Grid from '../grid';

import * as importedTestGrids from './testGrids.json'
import GameBoard, { GridView4 } from '../GameBoard';

jest.disableAutomock()

describe('GridView4', () => {
  test('renders correctly', () => {
    const testGrid = new Grid({grid: importedTestGrids.resultGrids.down[0]});
    render(<GridView4 grid={testGrid} />);
    expect(screen.toJSON()).toMatchSnapshot()
  })
})