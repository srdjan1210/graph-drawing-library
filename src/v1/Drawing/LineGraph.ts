import { Graph } from "./Graph.js";



class LineGraph extends Graph {

    protected loadedPoints = 0.05

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
    }


    protected draw() {
        if (this.dataset.length == 0) return
        let newDataset: number[] = this.scaleYvalue()
        let step: number = this.xlength / this.dataset.length
        this.ctx.strokeStyle = this.dataColor
        this.ctx.fillStyle = this.dataColor
        this.ctx.lineWidth = 2
        this.shouldAnimate = true
        if (this.shouldAnimate) this.drawPointsWithAnimation(newDataset, step, 0, 0)
        else this.drawPointsWithoutAnimation(newDataset, step)
    }

    protected drawPointsWithAnimation(dataset: number[], step: number, animationCoef: number, pointsNumber: number) {
        if (pointsNumber > dataset.length) return
        if (animationCoef > 1) {
            this.ctx.beginPath()
            this.ctx.arc(step + (pointsNumber - 1) * step, dataset[pointsNumber - 1], 5, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.closePath()
            animationCoef = 0.04
            pointsNumber++
        }
        window.requestAnimationFrame(() => this.drawPointsWithAnimation(dataset, step, animationCoef + 0.04, pointsNumber))
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        for (let i = 0; i <= pointsNumber; i++) {
            if (i < pointsNumber) {
                this.ctx.lineTo(step + i * step, dataset[i])
            }
            else this.ctx.lineTo((step + (i - 1) * step) + step * animationCoef, dataset[i - 1] + (dataset[i] - dataset[i - 1]) * animationCoef)
            this.ctx.stroke()
            if (animationCoef > 0.98) {
                console.log(animationCoef)


            }
        }
        this.ctx.closePath()
    }

    protected drawPointsWithoutAnimation(dataset: number[], step: number) {
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        for (let i = 0; i < dataset.length; i++) {
            this.ctx.lineTo(step + i * step, dataset[i])
            this.ctx.stroke()
            this.ctx.beginPath()
            this.ctx.arc(step + i * step, dataset[i], 3, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.closePath()
        }
        this.ctx.closePath()
    }

}

export { LineGraph }