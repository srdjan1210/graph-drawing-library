function fix_dpi(canvas: HTMLCanvasElement) {
    let dpi = window.devicePixelRatio
    console.log(canvas)
    let canvasElement = document.getElementById(canvas.id)
    let style: any = {
        height(): number {
            return +window.getComputedStyle(canvasElement).getPropertyValue('height').slice(0, -2);
        },
        width(): number {
            return +window.getComputedStyle(canvasElement).getPropertyValue('width').slice(0, -2);
        }
    }
    canvas.setAttribute('height', style.height() * dpi + "px");
    canvas.setAttribute('width', style.width() * dpi + "px");
}

export { fix_dpi }