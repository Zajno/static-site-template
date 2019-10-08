
export default function setProperty(obj, path, value) {
    const pList = path.split('.');
    const key = pList.pop();
    const pointer = pList.reduce((accumulator, currentValue) => {
        if (accumulator[currentValue] === undefined) {
            accumulator[currentValue] = {};
        }
        return accumulator[currentValue];
    }, obj);

    pointer[key] = value;
    return obj;
}

/**
 * @param {Object} obj
 * @param {string[]} propertiesToOmit
 * @returns {Object}
 */
export function omitProperties(obj, propertiesToOmit) {
    const returnObj = Object.assign({}, obj);

    propertiesToOmit.forEach(prop => {
        setProperty(returnObj, prop, undefined);
    });

    return returnObj;
}
