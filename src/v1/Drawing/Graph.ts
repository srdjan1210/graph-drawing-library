import { Point } from "../Interfaces/Point"

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
    protected dataset: number[]


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
        this.ctx.fillRect(0, 0, 1, this.ylength)
    }

    protected moveToCoordinateCenter() {
        this.ctx.translate(1 / 10 * this.width, 9 / 10 * this.height)
    }

    protected reverseScaleYAxis() {
        this.ctx.setTransform(1, 0, 0, 1, 1 / 10 * this.width, 9 / 10 * this.height)
        this.ctx.scale(1, -1)
    }

    protected findMaxValue(): number {
        let max: number = this.dataset[0]
        for (let point of this.dataset) {
            if (point > max) {
                max = point
            }
        }

        return max
    }

    protected scaleYvalue() {
        this.ctx.scale(1, (this.ylength / this.findMaxValue()))
    }

    setDataset(dataset: number[]) {
        this.dataset = dataset
    }

    setAnimation(value: boolean) {
        this.shouldAnimate = value
    }

    protected abstract draw();

}



export { Graph }