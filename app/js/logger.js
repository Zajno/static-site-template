
function log(...args) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    console.log(...args);
}

function warn(...args) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    console.warn(...args);
}

function error(...args) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    console.error(...args);
}
export default {
    log,
    warn,
    error,
}