import { render, screen } from "@testing-library/react-native"
import App from "../App"

test.skip('App renders', () => {
  // TODO: enable when storage is implemented
  console.log(<App />)
  render(<App />)
  expect(screen.toJSON()).not.toBeNull()
  expect(screen).toMatchSnapshot()
})