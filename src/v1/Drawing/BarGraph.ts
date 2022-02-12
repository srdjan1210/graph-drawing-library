import { Graph } from "./Graph.js"

class BarGraph extends Graph {
    protected color: string = "blue"
    protected loaded: number = 0.1

    constructor(canvasContext: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        super(canvasContext, canvasWidth, canvasHeight)
    }

    protected draw() {
        if (this.dataset.length == 0) return
        let step: number = this.xlength / this.dataset.length
        let offset = 10
        let barWidth: number = step - offset
        this.ctx.fillStyle = this.color
        this.scaleYvalue()
        this.drawValueMarksOnYAxis()
        this.writeLabelsForDataValues()
        if (this.shouldAnimate) this.drawAnimatedAllPoints(step, offset, barWidth, this.loaded)
        else this.drawPointsWithoutAnimation(step, offset, barWidth)
    }

    private drawAnimatedAllPoints(step: number, offset: number, barWidth: number, coef: number) {
        if (coef >= 1) return
        window.requestAnimationFrame(() => this.drawAnimatedAllPoints(step, offset, barWidth, coef + 0.02))

        for (let i = 0; i < this.dataset.length; i++)
            this.drawSingleBar(i * step + offset, 0, barWidth, this.dataset[i] * coef)
    }

    private drawPointsWithoutAnimation(step: number, offset: number, barWidth: number) {
        for (let i = 0; i < this.dataset.length; i++)
            this.drawSingleBar(i * step + offset, 0, barWidth, this.dataset[i]);

    }

    private drawSingleBar(x: number, y: number, width: number, height: number) {
        this.ctx.fillRect(x, y, width, height)
    }

    private drawValueMarksOnYAxis() {
        let x: number = 0
        this.ctx.save()
        this.ctx.lineWidth = 1 / this.yScaleFactor
        for (let val of this.dataset) {
            this.ctx.moveTo(x - 5, val)
            this.ctx.lineTo(x + 5, val)
            this.ctx.stroke()
        }
        this.ctx.restore()
    }

    private writeLabelsForDataValues() {
        if (this.labels == null || this.labels.length <= 0) return
        this.ctx.save()
        this.ctx.font = "0.1px"

        let i: number = 0
        for (let val of this.dataset) {
            this.ctx.strokeText(this.labels[i], 0, this.dataset[i])
            i++
        }
        this.ctx.restore()
    }

}


export { BarGraph } 