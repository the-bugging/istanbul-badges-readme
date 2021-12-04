import fs from 'fs';
import { getArgumentValue } from './arguments';

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
