import fs from 'fs';
import { logger } from './logger';
import { getArgumentValue } from './arguments';
import { defaultColorThresholds } from './constants';

const { logWarn } = logger();

export const getCoveragePath = (path: string): string => {
  let coveragePath: string = path;
  const argPath = getArgumentValue('coverageDir');

  if (argPath) {
    coveragePath = `${argPath}/coverage-summary.json`;
  }

  return coveragePath;
};

export const getReadmePath = (path: string): string => {
  let readmePath: string = path;
  const argPath = getArgumentValue('readmeDir');

  if (argPath) {
    readmePath = `${argPath}/README.md`;
  }

  return readmePath;
};

export const readFileAsync = async (path: string, encode: BufferEncoding): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encode, (err, data) => {
      if (err) reject(`File not found at: ${path}`);
      resolve(data);
    });
  });
};

/**
 * Asserts that the given `error` was created by Node internals.
 * @param error The error object.
 * @returns `true` if given error object is a NodeJS error.
 */
export const isNodeErrnoError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

/**
 * Handles optional exitCode on eventual application throw.
 * @returns `number` for chosen exit code or undefined
 */
export const getExitCodeOnError = (): number | undefined => {
  const argExitCode = +getArgumentValue('exitCode');

  return argExitCode && !isNaN(argExitCode) ? argExitCode : undefined;
};

/**
 * Parses a string representing colors and their corresponding numeric values into an object.
 * The input string should be formatted as "color:value", with multiple color-value pairs separated by commas.
 * This function specifically expects "red", "yellow", and "brightgreen" as the only valid colors in the string.
 *
 * @param optional {string | false} colorConfigString - The string representation of colors and their values to parse.
 * @returns {{ red: number; yellow: number; brightgreen: number }} An object with keys "red", "yellow", and "brightgreen",
 *          each mapped to their numeric value as specified in the input string.
 * @example parseColorConfig('red:70,yellow:85,brightgreen:95') => { red: 70, yellow: 85, brightgreen: 95 }
 */
export const parseColorConfig = (
  colorConfigString?: string | false,
): {
  red: number;
  yellow: number;
} => {
  if (!colorConfigString) {
    return defaultColorThresholds;
  }

  // checks if colorConfigString is in the correct format color:numberThreshold separated by commas
  if (!/^((red|yellow):[0-9]+,?)+$/.test(colorConfigString)) {
    logWarn(
      `Invalid color configuration string provided: "${colorConfigString}". Using default color thresholds instead.`,
    );

    return defaultColorThresholds;
  }

  return colorConfigString.split(',').reduce((acc, colorPair) => {
    const [color, value] = colorPair.split(':');
    if (color === 'red' || color === 'yellow') {
      acc[color] = parseInt(value, 10);
    }
    return acc;
  }, {} as { red: number; yellow: number });
};
