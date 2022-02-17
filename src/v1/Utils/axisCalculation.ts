function calculateXAxisPosition(minValue: number, maxValue: number, height: number, topOffset: number): number {
    if (minValue == null || maxValue == null) return 0.9 * height
    if (minValue >= 0 && maxValue > 0)
        return 0.9 * height
    else if (minValue < 0 && maxValue <= 0)
        return 0.1 * height
    else if (minValue < 0 && maxValue > 0)
        return (maxValue / (maxValue + Math.abs(minValue))) * 0.9 * height
    return 0.9 * height
}

function calculateXAxisPosition2(minValue: number, maxValue: number, ylength: number, topOffset: number): number {
    if (minValue == null || maxValue == null) return topOffset + ylength
    if (minValue >= 0 && maxValue > 0) return topOffset + ylength
    if (minValue < 0 && maxValue <= 0) return topOffset
    if (minValue < 0 && maxValue > 0) return topOffset + (maxValue / (maxValue + Math.abs(minValue))) * ylength
    return topOffset + ylength
}


export { calculateXAxisPosition, calculateXAxisPosition2 }