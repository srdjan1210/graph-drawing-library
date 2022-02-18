import { findMinValue, findMaxValue } from "../Utils/minMax.js"
import { calculateXAxisPosition } from "../Utils/axisCalculation.js"
import { fix_dpi } from "../Utils/dpiCorrection.js"

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
    protected title: string = ""
    protected titleVisibility: boolean = true
    protected resizedNumber: number = 0
    protected dataColor: string = "blue"
    protected horizontalLinesEnabled: boolean = true
    protected readonly HORIZONTAL_LINES_COUNT: number = 11
    protected readonly OFFSET_CONSTANT: number = 0.05


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.initializeVariables()
        this.initializeResizeObserver()
        this.prepareCanvas()
    }

    protected initializeVariables() {
        let canvasWidth = this.canvas.width
        let canvasHeight = this.canvas.height
        this.width = canvasWidth
        this.height = canvasHeight
        this.leftOffset = this.OFFSET_CONSTANT * canvasWidth
        this.rightoffset = this.leftOffset
        this.topOffset = this.OFFSET_CONSTANT * canvasHeight
        this.bottomOffset = this.OFFSET_CONSTANT * canvasHeight
        this.xlength = (1 - 2 * this.OFFSET_CONSTANT) * this.width
        this.ylength = this.height - this.bottomOffset - this.topOffset
        this.xbegin = this.leftOffset
        this.ybegin = this.height - this.bottomOffset
    }

    protected initializeResizeObserver() {
        let context = this
        new ResizeObserver(function () {
            if (context.resizedNumber != 0) fix_dpi(context.canvas)
            context.initializeVariables()
            context.resizedNumber++
            context.repaint()
        }).observe(this.canvas)
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
        this.drawHorizontalLines()
        this.writeTitle()
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
        this.ctx.fillRect(0, 0, 1, -(Math.abs(this.ylength - (this.xAxisCoor - this.topOffset))))
        this.ctx.restore()
    }

    protected moveToCoordinateCenter() {
        this.ctx.translate(1 / 10 * this.width, 9 / 10 * this.height)
    }

    protected drawHorizontalLines() {
        if (!this.horizontalLinesEnabled) return

        let xAxisPositionCoef: number = (this.xAxisCoor - this.topOffset) / this.ylength
        let linesAboveZero: number = Math.floor(xAxisPositionCoef * this.HORIZONTAL_LINES_COUNT)
        let linesBelowZero: number = this.HORIZONTAL_LINES_COUNT - linesAboveZero

        this.drawHorizontalLinesAboveZero(linesAboveZero, this.xAxisCoor - this.topOffset)
        this.drawHorizontalLinesBelowZero(linesBelowZero, this.ylength + this.topOffset - this.xAxisCoor)
    }

    private drawHorizontalLinesAboveZero(count: number, yLenAboveZero: number) {
        let step = yLenAboveZero / count
        this.ctx.save()
        this.ctx.fillStyle = "darkgray"
        for (let y = step; y <= yLenAboveZero; y += step)
            this.ctx.fillRect(0, y, this.xlength, 1)
        this.ctx.restore()
    }

    private drawHorizontalLinesBelowZero(count: number, yLenBelowZero: number) {
        let step = yLenBelowZero / count
        this.ctx.save()
        this.ctx.fillStyle = "darkgray"
        for (let y = step; y <= yLenBelowZero; y += step)
            this.ctx.fillRect(0, -y, this.xlength, 1)
        this.ctx.restore()
    }

    protected reverseScaleYAxis() {
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)

        let xAxisPosition: number = calculateXAxisPosition(minValue, maxValue, this.ylength, this.topOffset)
        this.xAxisCoor = xAxisPosition
        this.ctx.setTransform(1, 0, 0, 1, this.OFFSET_CONSTANT * this.width, xAxisPosition)
        this.ctx.scale(1, -1)
    }

    protected scaleYvalue() {
        let scaleCoeficient = this.determineValueCase()
        return this.dataset.map(el => el * scaleCoeficient)
    }


    private determineValueCase() {
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)

        if (minValue >= 0 && maxValue > 0) return this.ylength / maxValue
        if (minValue < 0 && maxValue <= 0) return this.ylength / Math.abs(minValue)
        if (minValue < 0 && maxValue > 0) return this.ylength / (maxValue + Math.abs(minValue))
    }

    protected writeTitle() {
        if (!this.titleVisibility) return

        let titlePosition = this.width / 2 - 10
        this.ctx.save()
        //let fontSize = 0.4 * this.topOffset
        this.ctx.fillStyle = "#6e6e6e"
        // this.ctx.font = `bold ${fontSize * window.devicePixelRatio}px Arial`
        this.ctx.font = `bold 15px Arial`
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.scale(1, 1)
        this.ctx.fillText(this.title, titlePosition + 0.5, this.topOffset / 2 + 0.5)
        this.ctx.restore()
    }

    setDataset(dataset: number[]) {
        this.dataset = dataset
    }

    setAnimation(value: boolean) {
        this.shouldAnimate = value
    }

    setTitle(title: string) {
        this.title = title
    }

    setTitleVisible(visibility: boolean) {
        this.titleVisibility = visibility
    }

    setDataColor(color: string) {
        this.dataColor = color
    }

    enableHorizontalLines(enabled: boolean) {
        this.horizontalLinesEnabled = enabled
    }

    protected abstract draw()

}



export { Graph }