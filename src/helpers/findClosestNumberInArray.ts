function findClosestNumberInArray(arr: number[], target: number) {
    const closest = arr.reduce((prev, curr) => {
        return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
    });
    const idx = arr.indexOf(closest, 0);
    return { closest, idx };
}

export default findClosestNumberInArray;