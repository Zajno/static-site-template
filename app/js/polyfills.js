import '@babel/polyfill';

// NodeList.forEach for IE
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (let i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// NodeList.map
if (window.NodeList && !NodeList.prototype.map) {
    NodeList.prototype.map = function (callback, thisArg) {
        thisArg = thisArg || window;
        const result = new Array(this.length);
        for (let i = 0; i < this.length; i++) {
            const item = callback.call(thisArg, this[i], i, this);
            result[i] = item;
        }

        return result;
    };
}

// Object.assign for IE
if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) { // .length of function is 2


            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            const to = Object(target);

            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (const nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true,
    });
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}
