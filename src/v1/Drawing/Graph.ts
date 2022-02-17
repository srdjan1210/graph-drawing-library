import { findMinValue, findMaxValue } from "../Utils/minMax.js"
import { calculateXAxisPosition } from "../Utils/axisCalculation.js"

abstract class Graph {
    protected canvas: HTMLCanvasElement
    protected ctx: CanvasRenderingContext2D
    protected width: number
    protected height: number
    protected shouldAnimate: boolean = true
    protected leftOffset: number = 10
    protected bottomOffset: number = 10
    protected topOffset: number = 30
    protected rightoffset: number = 10
    protected xlength: number
    protected ylength: number
    protected xbegin: number
    protected ybegin: number
    protected xAxisCoor: number
    protected dataset: number[]


    // constructor(canvasContext: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.initializeVariables()
        // this.ctx = canvasContext
        // this.width = canvasWidth
        // this.height = canvasHeight
        // this.leftOffset = 1 / 10 * canvasWidth
        // this.rightoffset = this.leftOffset
        // this.topOffset = 1 / 10 * canvasHeight
        // this.bottomOffset = 1 / 10 * canvasHeight
        // this.xlength = 8 / 10 * this.width
        // this.ylength = this.height - this.bottomOffset - this.topOffset
        // this.xbegin = this.leftOffset
        // this.ybegin = this.height - this.bottomOffset
        this.prepareCanvas()
    }

    protected initializeVariables() {
        let canvasWidth = this.canvas.width
        let canvasHeight = this.canvas.height
        this.width = canvasWidth
        this.height = canvasHeight
        this.leftOffset = 1 / 10 * canvasWidth
        this.rightoffset = this.leftOffset
        this.topOffset = 1 / 10 * canvasHeight
        this.bottomOffset = 1 / 10 * canvasHeight
        this.xlength = 8 / 10 * this.width
        this.ylength = this.height - this.bottomOffset - this.topOffset
        this.xbegin = this.leftOffset
        this.ybegin = this.height - this.bottomOffset
    }

    protected prepareCanvas() {
        this.restartCanvas()
        this.moveToCoordinateCenter()
        this.reverseScaleYAxis()
    }

    protected restartCanvas() {
        this.ctx.save()
        this.ctx.fillStyle = "white"
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.fillRect(0, 0, this.width, this.height)
        this.ctx.restore()

    }

    public repaint() {
        this.restartCanvas()
        this.reverseScaleYAxis()
        this.drawXAxis()
        this.drawYAxis()
        this.draw()
    }

    protected drawXAxis() {
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0, 0, this.xlength, 1)
    }

    protected drawYAxis() {
        this.ctx.save()
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0, 0, 1, this.xAxisCoor - this.topOffset)
        this.ctx.fillRect(0, 0, 1, -(this.ylength - this.xAxisCoor))
        this.ctx.restore()
    }

    protected moveToCoordinateCenter() {
        this.ctx.translate(1 / 10 * this.width, 9 / 10 * this.height)
    }

    protected reverseScaleYAxis() {
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)

        let xAxisPosition: number = calculateXAxisPosition(minValue, maxValue, this.height)
        this.xAxisCoor = xAxisPosition
        this.ctx.setTransform(1, 0, 0, 1, 1 / 10 * this.width, xAxisPosition)
        this.ctx.scale(1, -1)
    }

    protected scaleYvalue() {
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)
        let newDataset = this.dataset

        let scaleCoeficient = this.determineValueCase(minValue, maxValue)
        newDataset = this.dataset.map(el => el * scaleCoeficient)
        return newDataset
    }

    private determineValueCase(minValue: number, maxValue: number) {
        if (minValue >= 0 && maxValue > 0) {
            // this.ctx.scale(1, this.ylength / maxValue)
            return this.ylength / maxValue
        } else if (minValue < 0 && maxValue <= 0) {
            //this.ctx.scale(1, this.ylength / Math.abs(minValue))
            return this.ylength / Math.abs(minValue)
        } else if (minValue < 0 && maxValue > 0) {
            //this.ctx.scale(1, this.ylength / (maxValue + Math.abs(minValue)))
            return this.ylength / (maxValue + Math.abs(minValue))
        }
    }

    setDataset(dataset: number[]) {
        this.dataset = dataset
    }

    setAnimation(value: boolean) {
        this.shouldAnimate = value
    }

    protected abstract draw()

}



export { Graph }