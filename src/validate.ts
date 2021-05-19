import fs from 'fs';
import { hashesConst, readmePathConst, coveragePathConst } from './constants';
import { getCoveragePath, getReadmePath } from './helpers';
import { logger } from './logger';

const { logInfo } = logger();

export const doesReadmeFileExist = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const doesItExist = fs.existsSync(readmePath);

    if (doesItExist) return resolve(true);

    return reject('Readme file does not exist');
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
    const coverageFile = fs.readFileSync(coveragePath);

    hashesConst.coverage.forEach((hash) => {
      if (coverageFile.includes(hash.key)) return resolve(true);
    });

    return reject('Coverage file does contain the needed hashes');
  });
};

export const doesReadmeHashExist = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const readmeFile = fs.readFileSync(readmePath);

    hashesConst.coverage.forEach((hash) => {
      if (readmeFile.includes(`![${hash.value}]`)) return resolve(true);
    });

    return reject('Readme does not contain the needed hashes');
  });
};

export const checkConfig = (): Promise<void> => {
  logInfo('Info: 1. Config check process started');

  return doesReadmeFileExist(getReadmePath(readmePathConst))
    .then(() => {
      logInfo('- Readme file exists... ✔️.');
    })
    .then(() => doesCoverageFileExist(getCoveragePath(coveragePathConst)))
    .then(() => {
      logInfo('- Coverage file exists... ✔️.');
    })
    .then(() => doesCoverageHashesExist(getCoveragePath(coveragePathConst)))
    .then(() => {
      logInfo('- Coverage hashes exist... ✔️.');
    })
    .then(() => doesReadmeHashExist(getReadmePath(readmePathConst)))
    .then(() => {
      logInfo('- Readme hashes exist... ✔️.');
    })
    .then(() => logInfo('Info: 1. Config check process ended'));
};
