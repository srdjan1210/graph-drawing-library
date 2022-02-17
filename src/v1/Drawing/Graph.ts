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
    protected title: string = ""
    protected titleVisibility: boolean = true
    protected resizedNumber: number = 0
    protected readonly OFFSET_CONSTANT: number = 0.1


    // constructor(canvasContext: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
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
        this.xlength = 4 / 5 * this.width
        this.ylength = this.height - this.bottomOffset - this.topOffset
        this.xbegin = this.leftOffset
        this.ybegin = this.height - this.bottomOffset
    }

    protected initializeResizeObserver() {
        let context = this
        new ResizeObserver(function () {
            if (context.resizedNumber != 0) context.fix_dpi()
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
        let graphTopLength = this.xAxisCoor - this.topOffset
        let step = graphTopLength / 10
        this.ctx.save()
        this.ctx.fillStyle = "#6e6e6e"
        for (let i = step; i < graphTopLength; i += step)
            this.ctx.fillRect(0, i, this.xlength, 2)
        this.ctx.restore()
    }

    protected reverseScaleYAxis() {
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)

        let xAxisPosition: number = calculateXAxisPosition(minValue, maxValue, this.height)
        this.xAxisCoor = xAxisPosition
        this.ctx.setTransform(1, 0, 0, 1, this.OFFSET_CONSTANT * this.width, xAxisPosition)
        this.ctx.scale(1, -1)
    }

    protected scaleYvalue() {
        let newDataset = this.dataset

        let scaleCoeficient = this.determineValueCase()
        newDataset = this.dataset.map(el => el * scaleCoeficient)
        return newDataset
    }
    protected fix_dpi() {
        let dpi = window.devicePixelRatio;
        let canvasElement = document.getElementById(this.canvas.id)
        let style: any = {
            height(): number {
                return +window.getComputedStyle(canvasElement).getPropertyValue('height').slice(0, -2);
            },
            width(): number {
                return +window.getComputedStyle(canvasElement).getPropertyValue('width').slice(0, -2);
            }
        }
        this.canvas.setAttribute('height', style.height() * dpi + "px");
        this.canvas.setAttribute('width', style.width() * dpi + "px");
    }

    private determineValueCase() {
        let minValue: number = findMinValue(this.dataset)
        let maxValue: number = findMaxValue(this.dataset)

        if (minValue >= 0 && maxValue > 0) {
            return this.ylength / maxValue
        } else if (minValue < 0 && maxValue <= 0) {
            return this.ylength / Math.abs(minValue)
        } else if (minValue < 0 && maxValue > 0) {
            return this.ylength / (maxValue + Math.abs(minValue))
        }
    }

    protected writeTitle() {
        if (!this.titleVisibility) return

        let titlePosition = this.width / 2 - 10
        this.ctx.save()
        let fontSize = 0.4 * this.topOffset
        this.ctx.fillStyle = "#6e6e6e"
        this.ctx.font = `bold ${fontSize * window.devicePixelRatio}px Arial`
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

    protected abstract draw()

}



export { Graph }