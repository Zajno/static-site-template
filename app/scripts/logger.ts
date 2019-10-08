import { ILogger, LoggerFunction, ConsoleLogger, IGenericLogger, LogLevels } from './utils/logger';
import { AlertsLogger } from './utils/alertsLogger';

export { ILogger, LogLevels, LoggerFunction };

export const Enabled = true; // process.env.NODE_ENV !== 'production';
const USE_ALERT_LOGGER = false;

export function createLogger(name = '', forceDisable = false): ILogger & IGenericLogger {
    const enabled = forceDisable ? false : Enabled;
    return USE_ALERT_LOGGER
        ? new AlertsLogger(name, enabled)
        : new ConsoleLogger(name, enabled);
}

const logger = createLogger();

export default logger;
