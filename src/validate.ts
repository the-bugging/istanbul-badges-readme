import fs from 'fs';
import { getArgumentValue } from './arguments';
import { hashesConst, readmePathConst, coveragePathConst } from './constants';
import { getCoveragePath, getReadmePath, isNodeErrnoError } from './helpers';
import { logger } from './logger';

const { logInfo } = logger();

export const doesReadmeFileExistWithRightPermissions = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    try {
      // NOTE: Doing this check for the accessibility before reading/writing it
      //       is not recommended as it introduces racing conditions since other
      //       processes may change the file's state between the two call.
      //       But for simplicity and considering the context of this library,
      //       this wrong access file handling is toleralable.
      fs.accessSync(getReadmePath(readmePath), fs.constants.R_OK | fs.constants.W_OK);
      return resolve(true);
    } catch (err) {
      if (isNodeErrnoError(err)) {
        if (err.code === 'ENOENT') return reject('Readme file does not exist');
        if (err.code === 'EACCES') return reject('Readme file does not have read and write permissions');
        return reject(err.message);
      }

      return reject((err as Error).message || 'Something went wrong');
    }
  });
};

export const doesCoverageFileExist = (coveragePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const currentCoveragePath = getCoveragePath(coveragePath);
    const doesItExist = fs.existsSync(currentCoveragePath);

    if (doesItExist) return resolve(true);

    return reject(`Coverage file does not exist in ${currentCoveragePath}`);
  });
};

export const doesCoverageHashesExist = (coveragePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const coverageFile = fs.readFileSync(getCoveragePath(coveragePath));

    hashesConst.coverage.forEach((hash) => {
      if (coverageFile.includes(hash.key)) resolve(true);
    });

    return reject('Coverage file does contain the needed hashes');
  });
};

export const doesReadmeHashExist = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const readmeFile = fs.readFileSync(getReadmePath(readmePath));

    hashesConst.coverage.forEach((hash) => {
      if (readmeFile.includes(`![${hash.value}]`)) resolve(true);
    });

    return reject('Readme does not contain the needed hashes');
  });
};

export const getExitCodeOnValidationError = (): number => {
  const exitCodeArg = getArgumentValue('exitCode');
  const enableExitCode = exitCodeArg === '' || exitCodeArg === 'true';
  return enableExitCode ? 1 : 0;
};

export const checkConfig = (): Promise<void> => {
  logInfo('Info: 1. Config check process started');

  return doesReadmeFileExistWithRightPermissions(readmePathConst)
    .then(() => {
      logInfo('- Readme file exists... ✔️.');
    })
    .then(() => doesCoverageFileExist(coveragePathConst))
    .then(() => {
      logInfo('- Coverage file exists... ✔️.');
    })
    .then(() => doesCoverageHashesExist(coveragePathConst))
    .then(() => {
      logInfo('- Coverage hashes exist... ✔️.');
    })
    .then(() => doesReadmeHashExist(readmePathConst))
    .then(() => {
      logInfo('- Readme hashes exist... ✔️.');
    })
    .then(() => logInfo('Info: 1. Config check process ended'))
    .catch((err) => {
      process.exitCode = getExitCodeOnValidationError();
      // Re-throwing the error since we catch it in this scope just to defined
      // the right process exit code:
      throw err;
    });
};
