import Grid, {NewGrid} from "../grid";
import * as importedTestGrids from '../__tests__/testGrids.json'

const run = (endAfter = 10) => {
  let cumTime = 0
  let iterations = 0
  const startTime = Date.now()
  const endTime = Date.now() + (endAfter * 1000)
  while(Date.now() < endTime){
    iterations++
    // cumTime += testNewGrid()
    cumTime += testGrid()
  }
  console.log(`newTileLocationTime results:`)
  console.log(`Total execution time: ${Date.now()-startTime} mS`)
  console.log(`Cumulative execution time: ${cumTime} mS`)
  console.log(`number of iterations: ${iterations}`)
  console.log(`average iteration time: ${cumTime/iterations} mS`)
}

const timer = (setup: (params?: any )=> any, callback: (value: any)=>void) => {
  let value = setup()
  const start = performance.now()
  callback(value)
  const end = performance.now()
  return Math.abs(end-start)
}

const testNewGrid = () => {
  let time = 0;
  [ "left", "right", "up", "down"]
    .forEach((direction)=>{
    time += timer(()=>new NewGrid(), (testGrid: NewGrid)=>{
      testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
      testGrid.addNumber(2);
      testGrid.addNumber(4);
      testGrid.addNumber(8);
      testGrid.newTileLocation()
    })
    time += timer(()=>new NewGrid(), (testGrid: NewGrid)=>{
      testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
      testGrid.addNumber(2);
      testGrid.nextLine()
      testGrid.addNumber(4);
      testGrid.nextLine()
      testGrid.addNumber(8);
      testGrid.newTileLocation()
    })
    time += timer(()=>new NewGrid(), (testGrid: NewGrid)=>{
      testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
      testGrid.addNumber(2)
      testGrid.addNumber(2)
      testGrid.nextLine()
      testGrid.addNumber(4)
      testGrid.addNumber(4)
      testGrid.addNumber(2)
      testGrid.addNumber(2)
      testGrid.nextLine()
      testGrid.addNumber(2)
      testGrid.addNumber(2)
      testGrid.addNumber(4)
      testGrid.nextLine()
      testGrid.addNumber(2)
      testGrid.addNumber(2)
      testGrid.addNumber(2)
      testGrid.addNumber(2)
      testGrid.addNumber(4)
      testGrid.addNumber(4)
      testGrid.addNumber(8)
      testGrid.addNumber(8)
      testGrid.newTileLocation()
    })
    time += timer(()=>new NewGrid(), (testGrid: NewGrid)=>{
      testGrid.setDirection(<"left" | "right" | "up" | "down">direction)
      testGrid.addNumber(2)
      testGrid.addNumber(2)
      testGrid.nextLine()
      testGrid.addNumber(4)
      testGrid.addNumber(2)
      testGrid.addNumber(4)
      testGrid.addNumber(8)
      testGrid.nextLine()
      testGrid.addNumber(8)
      testGrid.addNumber(8)
      testGrid.addNumber(8)
      testGrid.addNumber(8)
      testGrid.nextLine()
      testGrid.addNumber(64)
      testGrid.addNumber(32)
      testGrid.addNumber(32)
      testGrid.newTileLocation()
    })
  })
  return time
}

const testGrid = () => {
  let time = 0;
  [ "left", "right", "up", "down"].forEach((direction)=>{
    ["0", "1", "2", "3"].forEach((index)=>{
      time += timer(()=> {
        const initialGrid = importedTestGrids.inputs[index as keyof typeof importedTestGrids.inputs]
        return new Grid(initialGrid)
      }, (grid)=>{
        grid.swipe(direction)
      })
    })
  })
  return time
}

const testGridMulti = () => {
  let time = 0;
  [ "left", "right", "up", "down"].forEach((direction1)=>{
    [ "left", "right", "up", "down"].forEach((direction2)=>{
      ["0", "1", "2", "3"].forEach((index)=>{
        time += timer(()=> {
          const initialGrid = importedTestGrids.inputs[index as keyof typeof importedTestGrids.inputs]
          return new Grid(initialGrid)
        }, (grid)=>{
          grid.swipe(direction1)
          grid.swipe(direction2)
        })
      })
    })
  })
  return time
}

run()