
export function clamp(val: number, min: number, max: number, cycle = false): number {
    if (val < min) {
        return cycle ? max : min;
    }

    if (val > max) {
        return cycle ? min : max;
    }

    return val;
}

function arrayCompare(arr: number[], absolute: boolean, cond: (n: number, max: number) => boolean): number {
    if (!Array.isArray(arr) || arr.length <= 0) {
        return null;
    }

    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        const e = absolute ? Math.abs(arr[i]) : arr[i];
        if (cond(e, max)) {
            max = e;
        }
    }

    return max;
}

export function arrayMax(arr: number[], absolute = false): number {
    return arrayCompare(arr, absolute, (e, max) => e > max);
}

export function arrayMin(arr: number[], absolute = false): number {
    return arrayCompare(arr, absolute, (e, min) => e < min);
}

export function arrayAverage(arr: number[], absolute = false): number {
    if (!Array.isArray(arr) || arr.length <= 0) {
        return 0;
    }

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        const e = absolute ? Math.abs(arr[i]) : arr[i];
        sum += e;
    }

    return sum / arr.length;
}
