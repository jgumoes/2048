import { render, screen } from "@testing-library/react-native"
import App from "../App"
import { StyleProp, ViewStyle } from "react-native"

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

jest.mock('expo-status-bar', ()=>{
  return({
    StatusBar: () => {
      <view />
    }
  })
})

jest.mock('react-native-gesture-handler', ()=>{
  return({
    GestureHandlerRootView: ({children, style}: {children: JSX.Element, style: StyleProp<ViewStyle>}) => {
      return(<view>{children}</view>)
    },
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
    GestureDetector: ({children}: {children: JSX.Element}) => {
      return(<view>{children}</view>)
    }
  })
})

jest.spyOn(global.Math, 'random').mockReturnValue(0);

test.skip('App renders', () => {
  // TODO: enable when storage is implemented
  console.log(<App />)
  render(<App />)
  expect(screen.toJSON()).not.toBeNull()
  expect(screen).toMatchSnapshot()
})