/**
 * @callback LoggerFunction
 * @param {...any[]} args
 */

/** @typedef {Object} LoggerInterface
 * @property {LoggerFunction} log
 * @property {LoggerFunction} warn
 * @property {LoggerFunction} error
 */

const CONSOLE = console;

function addArg(func, value) {
    return (...args) => func(value, ...args);
}

/** @implements {LoggerInterface} */
export class ConsoleLogger {
    /** @param {string} name */
    constructor(name, enabled = true) {
        this._name = name;

        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }
    }

    enable(overrideName = null) {
        this._name = overrideName || this._name;

        this.log = this._name
            ? addArg(CONSOLE.log, this._name)
            : CONSOLE.log;
        this.warn = this._name
            ? addArg(CONSOLE.warn, this._name)
            : CONSOLE.warn;
        this.error = this._name
            ? addArg(CONSOLE.error, this._name)
            : CONSOLE.error;
    }

    disable() {
        this.log = () => {};
        this.warn = () => {};
        this.error = () => {};
    }

    flush() { }
}

export class BufferedConsoleLogger {
    /** @param {string} name */
    constructor(name) {
        this._name = name || '';
        this._logs = [];
        this._level = 1;
        this._log = CONSOLE.log;
    }

    log(...args) {
        this._logs.push('\t--->', ...args);
    }

    warn(...args) {
        this._logs.push('\t---> [WARN]', ...args);
        this._raiseLevel(2);
    }

    error(...args) {
        this._logs.push('\t---> [ERROR]', ...args);
        this._raiseLevel(3);
    }

    flush() {
        if (this._logs.length > 0) {
            this._log(this._name, ...this._logs);
            this._logs.length = 0;
        }
    }

    _raiseLevel(l) {
        if (l > this._level) {
            this._level = l;
            if (l >= 3) {
                this._log = CONSOLE.error;
            } else if (l >= 2) {
                this._log = CONSOLE.warn;
            }
        }
    }
}
