/* istanbul ignore file */
import { createLogger, transports } from 'winston';
import { combineLogFormats } from './format-levels';

const create = (scope: string) =>
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
