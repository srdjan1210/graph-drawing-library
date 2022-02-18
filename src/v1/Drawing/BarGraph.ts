import { Graph } from "./Graph.js"

class BarGraph extends Graph {
    protected loaded: number = 0.1

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
    }

    protected draw() {
        if (this.dataset.length == 0) return
        let step: number = this.xlength / this.dataset.length
        let offset = 10
        let barWidth: number = step - offset
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
            this.drawSingleBar(i * step + offset, 0, barWidth, dataset[i]);

    }

    private drawSingleBar(x: number, y: number, width: number, height: number) {
        this.ctx.fillRect(x, y, width, height)
    }

}


export { BarGraph } 