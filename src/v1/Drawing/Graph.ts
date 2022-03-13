import { findMinValue, findMaxValue } from "../Utils/minMax.js"
import { calculateXAxisPosition } from "../Utils/axisCalculation.js"
import { fix_dpi } from "../Utils/dpiCorrection.js"
import { determineFontSize } from "../Utils/letterHeight.js"

abstract class Graph {
    protected canvas: HTMLCanvasElement
    protected ctx: CanvasRenderingContext2D
    protected width: number
    protected height: number
    protected shouldAnimate: boolean = false
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
    protected labelsColor: string = "gray"
    protected titleColor: string = "#6e6e6e"
    protected horizontalLinesEnabled: boolean = true
    protected verticalLinesEnabled: boolean = true
    protected labels: string[] = []
    protected readonly HORIZONTAL_LINES_COUNT: number = 11
    protected readonly OFFSET_CONSTANT: number = 0.15



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
        this.leftOffset = this.OFFSET_CONSTANT * canvasHeight
        this.rightoffset = this.leftOffset
        this.topOffset = this.OFFSET_CONSTANT * canvasHeight
        this.bottomOffset = this.OFFSET_CONSTANT * canvasHeight
        this.xlength = this.width - this.leftOffset - this.rightoffset
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
        this.drawVerticalLines()
        this.writeTitle()
        this.writeSideValues()
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
        this.ctx.translate(this.leftOffset, this.height - this.topOffset)
    }

    protected drawHorizontalLines() {
        if (!this.horizontalLinesEnabled) return

        let xAxisPositionCoef: number = (this.xAxisCoor - this.topOffset) / this.ylength
        let linesAboveZero: number = Math.floor(xAxisPositionCoef * this.HORIZONTAL_LINES_COUNT)
        let linesBelowZero: number = this.HORIZONTAL_LINES_COUNT - linesAboveZero

        this.drawHorizontalLinesInDirection(linesAboveZero, this.xAxisCoor - this.topOffset, 1)
        this.drawHorizontalLinesInDirection(linesBelowZero, this.ylength + this.topOffset - this.xAxisCoor, -1)
    }

    private drawHorizontalLinesInDirection(count: number, yLen, direction: number) {
        let step = yLen / count
        this.ctx.save()
        this.ctx.fillStyle = "darkgray"
        for (let y = step; y <= yLen; y += step)
            this.ctx.fillRect(0, direction * y, this.xlength, 1)
        this.ctx.restore()
    }

    private drawVerticalLines() {
        if (!this.verticalLinesEnabled) return
        let step: number = this.xlength / this.dataset.length
        this.ctx.save()
        this.ctx.fillStyle = "#a8a8a8"
        for (let i = 0; i < this.dataset.length; i++) {
            this.ctx.fillRect(i * step, this.xAxisCoor - this.topOffset, 1, -this.ylength)
        }
        this.ctx.restore()
    }


    protected reverseScaleYAxis() {
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)

        let xAxisPosition: number = calculateXAxisPosition(minValue, maxValue, this.ylength, this.topOffset)
        this.xAxisCoor = xAxisPosition
        this.ctx.setTransform(1, 0, 0, 1, this.leftOffset, xAxisPosition)
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
        this.ctx.fillStyle = this.titleColor
        this.ctx.font = `bold 15px Arial`
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.scale(1, 1)
        this.ctx.fillText(this.title, titlePosition + 0.5, this.topOffset / 2 + 0.5)
        this.ctx.restore()
    }

    protected writeSideValues() {
        this.ctx.save()
        this.ctx.setTransform(1, 0, 0, 1, this.leftOffset, this.xAxisCoor)

        let xAxisPositionCoef: number = (this.xAxisCoor - this.topOffset) / this.ylength
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)

        this.determineTextSizeAndWrite(0, 0)
        this.writeSideValuesAboveZero(xAxisPositionCoef, maxValue)
        this.writeSideValueBelowZero(xAxisPositionCoef, minValue)

        this.ctx.restore()
    }

    private writeSideValuesAboveZero(xAxisPositionCoef: number, maxValue: number) {
        let linesAboveZero: number = Math.floor(xAxisPositionCoef * this.HORIZONTAL_LINES_COUNT)
        if (linesAboveZero == 0) return;

        let realStep: number = (this.xAxisCoor - this.topOffset) / linesAboveZero
        let valueStep: number = maxValue / linesAboveZero
        let valueForWriting: number = valueStep

        for (let y = realStep; y <= (this.xAxisCoor - this.topOffset); y += realStep) {
            this.determineTextSizeAndWrite(valueForWriting, -y)
            valueForWriting += valueStep
        }
    }

    private writeSideValueBelowZero(xAxisPositionCoef: number, minValue: number) {
        let linesBelowZero: number = this.HORIZONTAL_LINES_COUNT - Math.floor(xAxisPositionCoef * this.HORIZONTAL_LINES_COUNT)
        if (linesBelowZero == 0) return;

        let realStep: number = (this.ylength - this.xAxisCoor + this.topOffset) / linesBelowZero
        let valueStep: number = minValue / linesBelowZero
        let valueForWriting: number = valueStep

        for (let y = realStep; y <= (this.ylength - this.xAxisCoor + this.topOffset); y += realStep) {
            this.determineTextSizeAndWrite(valueForWriting, y)
            valueForWriting += valueStep
        }
    }

    private determineTextSizeAndWrite(value: number, y: number) {
        let text: string = value.toFixed(2)
        this.ctx.save()
        let textHeight: number = determineFontSize(this.height)
        this.ctx.fillStyle = this.labelsColor
        this.ctx.font = `bold ${textHeight}px Arial`

        let textWidth: number = this.ctx.measureText(text).width

        this.ctx.fillText(text, -10 - textWidth, y + textHeight * 0.4)
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

    setTitleColor(color: string) {
        this.titleColor = color
    }

    setLabelsColor(color: string) {
        this.labelsColor = color
    }

    setDataColor(color: string) {
        this.dataColor = color
    }

    enableHorizontalLines(enabled: boolean) {
        this.horizontalLinesEnabled = enabled
    }

    enableVerticalLiens(enabled: boolean) {
        this.verticalLinesEnabled = enabled
    }

    setLabels(labels: string[]) {
        this.labels = labels
    }

    protected abstract draw()

}



export { Graph }