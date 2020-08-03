import fs from 'fs';
import { create } from './logging';
import { hashes, readmePath, coveragePath } from './constants';

const Logger = create('Validate');

export const getCoveragePath = (path: string): string => {
  let coveragePath: string = path;
  let argPath: string = '';

  const args = process.argv
    .filter((item) => {
      if (item.indexOf('coverage') >= 0) {
        return item;
      }
    })
    .toString();

  if (args) {
    argPath = args.replace('--coverageDir=', '');
  }

  if (argPath && args.length > 0) {
    coveragePath = `${argPath}/coverage-summary.json`;
  }

  return coveragePath;
};

export const doesReadmeExist = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const doesItExist = fs.existsSync(readmePath);

    if (doesItExist) return resolve(true);

    return reject('Readme file does not exist');
  });
};

export const doesCoverageExist = (coveragePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const doesItExist = fs.existsSync(getCoveragePath(coveragePath));

    if (doesItExist) return resolve(true);

    return reject('Coverage file does not exist');
  });
};

export const doesCoverageHashesExist = (coveragePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const coverageFile = fs.readFileSync(coveragePath);

    hashes.coverage.forEach((hash) => {
      if (coverageFile.includes(hash.key)) return resolve(true);
    });

    return reject('Coverage file does contain the needed hashes');
  });
};

export const doestReadmeHashExist = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const readmeFile = fs.readFileSync(readmePath);

    hashes.coverage.forEach((hash) => {
      if (readmeFile.includes(hash.value)) return resolve(true);
    });

    return reject('Readme does not contain the needed hashes');
  });
};

export const checkConfig = () => {
  Logger.info('1. Config check process started');

  return Promise.resolve(doesReadmeExist(readmePath))
    .then(() => {
      Logger.info('- Readme... Check.');
    })
    .then(() => doesCoverageExist(coveragePath))
    .then(() => {
      Logger.info('- Coverage... Check.');
    })
    .then(() => doesCoverageHashesExist(coveragePath))
    .then(() => {
      Logger.info('- Coverage Hashes... Check.');
    })
    .then(() => doestReadmeHashExist(readmePath))
    .then(() => {
      Logger.info('- Readme Hashes... Check.');
    })
    .finally(() => Logger.info('1. Config check process ended'));
};
