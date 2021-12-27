import logger, { setMode, createLogger, ILogger } from '@zajno/common/lib/logger';
import { EnableLogger } from './env';

setMode(EnableLogger ? 'console' : false);

export default logger;

logger.log(`${process.env.APP_NAME} v${process.env.APP_VERSION}:${process.env.APP_HASH}`);

export { createLogger, ILogger };
