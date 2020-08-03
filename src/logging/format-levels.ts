/* istanbul ignore file */
import { format } from 'winston';

const { splat, printf, combine, colorize } = format;

const colors = () =>
  colorize({
    all: true,
    colors: Object.freeze({
      trace: 'green',
      info: 'blue',
      warn: 'yellow',
      error: 'red',
      fatal: 'red',
    }),
  });

const upperCaseLevel = format((info) => {
  info.level = typeof info.level === 'string' ? info.level.toUpperCase() : info.level;
  return info;
});

const customFormat = () => printf(({ level, message, scope }) => `[${level}] - [${scope}]: ${message}`);

const combineLogFormats = (...formats: any[]) =>
  combine(upperCaseLevel(), splat(), colors(), customFormat(), ...formats);

export { combineLogFormats };
