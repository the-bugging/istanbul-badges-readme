import { createLogger, transports } from 'winston';
import { combineLogFormats } from './format-levels';

const create = (scope) =>
  createLogger({
    level: 'info',
    defaultMeta: {
      scope,
    },
    exitOnError: false,
    transports: [
      new transports.Console({
        format: combineLogFormats(),
      }),
    ],
  });

export { create };
