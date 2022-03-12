import { Graph } from "./Graph"
import { Bar } from "../Interfaces/Bar"
import { determineFontSize } from "../Utils/letterHeight"

class BarGraph extends Graph {
    protected loaded: number = 0.1
    protected datasetBars: Bar[] = []
    protected barOffsetCof: number = 0.1

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
    }

    repaint() {
        super.repaint()
        this.drawBottomLabels()
    }

    protected draw() {
        if (this.dataset.length == 0) return
        this.datasetBars = []
        let step: number = this.xlength / this.dataset.length
        let offset = step * this.barOffsetCof
        console.log(offset)
        let barWidth: number = step - 2 * offset
        this.ctx.fillStyle = this.dataColor
        let scaledValues = this.scaleYvalue()
        if (this.shouldAnimate) this.drawAnimatedAllPoints(scaledValues, step, offset, barWidth, this.loaded)
        else this.drawPointsWithoutAnimation(scaledValues, step, offset, barWidth)
    }

    private drawAnimatedAllPoints(dataset: number[], step: number, offset: number, barWidth: number, coef: number) {
        if (coef >= 1) return
        window.requestAnimationFrame(() => this.drawAnimatedAllPoints(dataset, step, offset, barWidth, coef + 0.02))

        for (let i = 0; i < dataset.length; i++)
            this.drawSingleBar(i * step + offset, 0, barWidth, dataset[i] * coef)
    }

    private drawPointsWithoutAnimation(dataset: number[], step: number, offset: number, barWidth: number) {
        for (let i = 0; i < dataset.length; i++)
            this.drawSingleBar(i * step + offset, 0, barWidth, dataset[i])

    }

    private drawSingleBar(x: number, y: number, width: number, height: number) {
        this.ctx.fillRect(x, y, width, height)
        let newBar = {
            xstart: x,
            xend: x + width
        }
        this.datasetBars.push(newBar)
    }

    private drawBottomLabels() {
        if (this.labels.length == 0) return
        let step: number = this.xlength / this.dataset.length
        for (let i = 0; i < this.labels.length; i++)
            this.drawLabelAtPosition(this.labels[i], i, step)
    }
    /*
    
    
        IN PROGRESS.....
    
    */
    private drawLabelAtPosition(label: string, i: number, step: number) {
        this.ctx.save()
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.translate(this.leftOffset, this.ylength + this.topOffset)
        this.ctx.fillStyle = "black"

        let textHeight = determineFontSize(this.height)
        this.ctx.font = `bold ${Math.floor(textHeight)}px Arial`
        let textWidth: number = this.ctx.measureText(label).width

        if (textWidth > step - 20)
            this.drawCurvedLabel(label, textWidth, textHeight, i, step)
        else
            this.ctx.fillText(label, i * step + 10 + ((step - 20) - textWidth) / 2, this.bottomOffset / 2, step - 20)

        this.ctx.restore()
    }

    private drawCurvedLabel(label: string, textWidth: number, textHeight: number, i: number, step: number) {
        let toLeft = 25
        let x = 10 + step / 2 + toLeft
        let upperOffset: number = Math.sqrt(Math.pow(textWidth, 2) - Math.pow(x, 2))
        let angle: number = Math.asin(upperOffset / textWidth)

        this.ctx.save()
        this.ctx.translate(i * step - toLeft, upperOffset + textHeight)
        this.ctx.rotate(-angle)
        this.ctx.fillText(label, 0, 0)
        this.ctx.restore()
    }
    /*
    *******
    *******
    *******
    */

}


export { BarGraph } 