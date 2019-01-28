
function clamp(val, min, max, cycle = false) {
    if (val < min) {
        return cycle ? max : min;
    }

    if (val > max) {
        return cycle ? min : max;
    }

    return val;
}


function arrayCompare(arr, absolute, cond) {
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

/**
 * @param {number[]} arr
 * @param {boolean} absolute
 * @returns {number}
 */
function arrayMax(arr, absolute = false) {
    return arrayCompare(arr, absolute, (e, max) => e > max);
}

/**
 * @param {number[]} arr
 * @param {boolean} absolute
 * @returns {number}
 */
function arrayMin(arr, absolute = false) {
    return arrayCompare(arr, absolute, (e, min) => e < min);
}


/**
 * @param {number[]} arr
 * @returns {number}
 */
function arrayAverage(arr, absolute = false) {
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


module.exports = {
    clamp,
    arrayMax,
    arrayMin,
    arrayAverage,
};
