import { ConsoleLogger } from './utils/logger';

/** @typedef {(import './utils/logger').LoggerInterface} LoggerInterface */

const isProd = process.env.NODE_ENV === 'production';

/** @type {LoggerInterface} */
const theLogger = new ConsoleLogger('', !isProd);

export default theLogger;
