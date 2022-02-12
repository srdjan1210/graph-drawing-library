import { BarGraph } from "./Drawing/BarGraph.js"
import { Point } from "./Interfaces/Point"
let canvas = <HTMLCanvasElement>document.getElementById('panel')
let ctx = canvas.getContext('2d')

let graph = new BarGraph(ctx, canvas.width, canvas.height)
// let dataset: Point[] = [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 8, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 100 }]
//let dataset: Point[] = [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }, { x: 4, y: 10 }]
// let dataset: number[] = [10, 20, -30, 10]
let dataset: number[] = [5, 1, 10, 11, -5]
let labels: string[] = ["label1", "label2", "label3", "label4", "label5",]
graph.setDataset(dataset)
graph.setLabels(labels)
graph.repaint()


setTimeout(() => {
    graph = new BarGraph(ctx, canvas.width, canvas.height)
    graph.setDataset(dataset)
    graph.setLabels(labels)
    graph.repaint()
}, 3000)

export { ctx }



