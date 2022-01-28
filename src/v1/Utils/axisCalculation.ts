function calculateXAxisPosition(minValue: number, maxValue: number, height: number): number {
    if (minValue == null || maxValue == null) return 0.9 * height
    if (minValue >= 0 && maxValue > 0)
        return 0.9 * height
    else if (minValue < 0 && maxValue <= 0)
        return 0.1 * height
    else if (minValue < 0 && maxValue > 0)
        return (maxValue / (maxValue + Math.abs(minValue))) * 0.9 * height
    return 0.9 * height
}


export { calculateXAxisPosition }