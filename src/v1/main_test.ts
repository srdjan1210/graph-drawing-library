import { BarGraph } from "./Drawing/BarGraph.js"
import { LineGraph } from "./Drawing/LineGraph.js"
import { Graph } from "./Drawing/Graph.js"
let canvas = <HTMLCanvasElement>document.getElementById('panel')
let ctx = canvas.getContext('2d')



let graph: Graph = new LineGraph(canvas)
// let graph = new BarGraph(ctx, canvas.width, canvas.height)
// let dataset: Point[] = [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 8, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 100 }]
//let dataset: Point[] = [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }]
// let dataset: number[] = [10, 20, -30, 10]
let dataset: number[] = [5, 6, 10, 5, -20]
graph.setDataset(dataset)
graph.setDataColor("red")
graph.setTitle("Tesla")
graph.repaint()

setTimeout(function () {
    graph.stopResizeObserver()
    graph = new BarGraph(canvas)
    graph.setTitle("Tesla")
    graph.setDataset([2, 3, 1, 2, 3])
    graph.setAnimation(true)
    graph.repaint()
}, 5000)
export { ctx }



