import { BarGraph } from "./Drawing/BarGraph.js"
import { Point } from "./Interfaces/Point"
import { fix_dpi } from "./Utils/dpiCorrection.js"
let canvas = <HTMLCanvasElement>document.getElementById('panel')
let ctx = canvas.getContext('2d')


fix_dpi(canvas)

let graph = new BarGraph(canvas)
// let graph = new BarGraph(ctx, canvas.width, canvas.height)
// let dataset: Point[] = [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 8, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 100 }]
//let dataset: Point[] = [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }]
// let dataset: number[] = [10, 20, -30, 10]
let dataset: number[] = [5, 6, 10, 5, -20, 30, 20, 10, -12, 12, 5, 6, 10, 5, -20, 30, 20, 10, -12, 12]
// let dataset: number[] = [12, 3, 1, -2, 3]
// let labels: string[] = ["21-02-2022", "21-02-2022", "21-02-2022", "21-02-2022", "21-02-2022"]
let labels: string[] = ["21-02-2022", "21-03-2022", "21-04-2022", "21-05-2022", "21-06-2022", "21-02-2022", "21-03-2022", "21-04-2022", "21-05-2022", "21-06-2022", "21-02-2022", "21-03-2022", "21-04-2022", "21-05-2022", "21-06-2022", "21-02-2022", "21-03-2022", "21-04-2022", "21-05-2022", "21-06-2022"]
graph.setDataset(dataset)
graph.setDataColor("#348cf5")
graph.setTitle("Tesla")
graph.setLabels(labels)
//graph.setLabels()
graph.enableVerticalLiens(false)

graph.repaint()

console.log(Math.ceil(261352.242))
// setTimeout(function () {

//     graph.setDataset([2, 3, 1, 2, 3])
//     graph.repaint()
// }, 10000)
export { ctx }



