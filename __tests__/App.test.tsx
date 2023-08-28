import { render, screen } from "@testing-library/react-native"
import App from "../App"

jest.mock('expo-status-bar', ()=>{
  return({
    StatusBar: () => {
      <view />
    }
  })
})

jest.mock('react-native-gesture-handler', ()=>{
  return({
    GestureHandlerRootView: () => {
      <view />
    },
    gestureHandlerRootHOC: (element: JSX.Element) => element
  })
})

test('App renders', () => {
  render(<App />)
  expect(screen.toJSON()).not.toBeNull()
  expect(screen).toMatchSnapshot()
})