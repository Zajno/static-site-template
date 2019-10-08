import { ConsoleLogger } from './utils/logger';

/** @typedef {(import './utils/logger').LoggerInterface} LoggerInterface */

export const Enabled = process.env.NODE_ENV !== 'production';

/** @returns {LoggerInterface} */
export function createLogger(name = '') {
    return new ConsoleLogger(name, Enabled);
}

/** @type {LoggerInterface} */
const theLogger = createLogger();

export default theLogger;
