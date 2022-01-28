function findMaxValue(dataset: number[]): number {
    if (!dataset || dataset.length == 0) return null
    let max: number = dataset[0]
    for (let point of dataset) {
        if (point > max) {
            max = point
        }
    }

    return max
}


function findMinValue(dataset: number[]): number {
    if (!dataset || dataset.length == 0) return null
    let min: number = dataset[0]
    for (let point of dataset) {
        if (point < min) {
            min = point
        }
    }

    return min
}

export { findMinValue, findMaxValue }
