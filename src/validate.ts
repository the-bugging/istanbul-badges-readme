import fs from 'fs';
import { hashesConst, readmePathConst, coveragePathConst } from './constants';

export const getCoveragePath = (path: string): string => {
  let coveragePath: string = path;
  let argPath = '';

  const args = process.argv
    .filter((item) => {
      if (item.indexOf('coverage') >= 0) {
        return item;
      }

      return '';
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

export const doesReadmeFileExist = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const doesItExist = fs.existsSync(readmePath);

    if (doesItExist) return resolve(true);

    return reject('Readme file does not exist');
  });
};

export const doesCoverageFileExist = (coveragePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const doesItExist = fs.existsSync(getCoveragePath(coveragePath));

    if (doesItExist) return resolve(true);

    return reject('Coverage file does not exist');
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

export const doestReadmeHashExist = (readmePath: string): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    const readmeFile = fs.readFileSync(readmePath);

    hashesConst.coverage.forEach((hash) => {
      if (readmeFile.includes(`![${hash.value}]`)) return resolve(true);
    });

    return reject('Readme does not contain the needed hashes');
  });
};

export const checkConfig = (): Promise<void> => {
  console.log('Info: 1. Config check process started');

  return doesReadmeFileExist(readmePathConst)
    .then(() => {
      console.log('- Readme file exists... ✔️.');
    })
    .then(() => doesCoverageFileExist(coveragePathConst))
    .then(() => {
      console.log('- Coverage file exists... ✔️.');
    })
    .then(() => doesCoverageHashesExist(coveragePathConst))
    .then(() => {
      console.log('- Coverage hashes exist... ✔️.');
    })
    .then(() => doestReadmeHashExist(readmePathConst))
    .then(() => {
      console.log('- Readme hashes exist... ✔️.');
    })
    .then(() => console.log('Info: 1. Config check process ended'));
};
