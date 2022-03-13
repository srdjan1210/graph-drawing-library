function determineFontSize(canvasHeight) {
    if (canvasHeight < 200) return 6
    if (canvasHeight < 600) return 10
    if (canvasHeight < 800) return 20
    return 25
}


export { determineFontSize }