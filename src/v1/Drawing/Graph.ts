import { findMinValue, findMaxValue } from "../Utils/minMax.js"
import { calculateXAxisPosition } from "../Utils/axisCalculation.js"

abstract class Graph {
    protected ctx: CanvasRenderingContext2D
    protected width: number
    protected height: number
    protected shouldAnimate: boolean = true
    protected readonly leftOffset: number = 10
    protected readonly bottomOffset: number = 10
    protected readonly topOffset: number = 10
    protected readonly rightoffset: number = 10
    protected readonly xlength: number
    protected readonly ylength: number
    protected readonly xbegin: number
    protected readonly ybegin: number
    protected xAxisCoor: number
    protected dataset: number[] = null
    protected labels: string[] = null
    protected yScaleFactor: number = 1

    constructor(canvasContext: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        this.ctx = canvasContext
        this.width = canvasWidth
        this.height = canvasHeight
        this.leftOffset = 1 / 10 * canvasWidth
        this.rightoffset = this.leftOffset
        this.xlength = 8 / 10 * this.width
        this.ylength = this.height - this.bottomOffset - this.topOffset
        this.xbegin = this.leftOffset
        this.ybegin = this.height - this.bottomOffset
        this.prepareCanvas()
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
        this.ctx.fillStyle = "#000000"
        this.ctx.save()
        this.ctx.fillRect(0, 0, 1, this.xAxisCoor)
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
        this.determineValueCase(minValue, maxValue)
    }

    private determineValueCase(minValue: number, maxValue: number) {
        if ((minValue >= 0 && maxValue > 0) || (minValue < 0 && maxValue <= 0))
            this.yScaleFactor = this.ylength / Math.abs(maxValue)
        else if (minValue < 0 && maxValue > 0)
            this.yScaleFactor = this.ylength / (maxValue + Math.abs(minValue))
        this.ctx.scale(1, this.yScaleFactor)
    }

    setDataset(dataset: number[]) {
        this.dataset = dataset
    }

    setLabels(labels: string[]) {
        this.labels = labels
    }

    setAnimation(value: boolean) {
        this.shouldAnimate = value
    }

    protected abstract draw()

}



export { Graph }