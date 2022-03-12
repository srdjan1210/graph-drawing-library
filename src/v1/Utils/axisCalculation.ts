function calculateXAxisPosition(minValue: number, maxValue: number, ylength: number, topOffset: number): number {
    if (minValue == null || maxValue == null) return topOffset + ylength
    if (minValue >= 0 && maxValue > 0) return topOffset + ylength
    if (minValue < 0 && maxValue <= 0) return topOffset
    if (minValue < 0 && maxValue > 0) return topOffset + (maxValue / (maxValue + Math.abs(minValue))) * ylength
    return topOffset + ylength
}


export { calculateXAxisPosition }