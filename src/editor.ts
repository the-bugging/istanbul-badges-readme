import fs from 'fs';
import { getArgumentValue } from './arguments';
import { readmePathConst, coveragePathConst, hashesConst, coverageUrlConst } from './constants';
import { getCoveragePath, getReadmePath, readFileAsync } from './helpers';
import { logger } from './logger';
import { TColors, THashes, TReport } from './types';

const { logInfo } = logger();

export const getReadmeHashes = (readmeFile: string): THashes[] => {
  logInfo('- Getting readme hashes...');

  const readmeHashes = hashesConst.coverage.map((hash) => {
    if (readmeFile.includes(`![${hash.value}]`)) {
      return hash;
    }

    return false;
  });

  const filteredHashes = readmeHashes.filter(Boolean);

  return filteredHashes as unknown as THashes[];
};

export const getCoverageColor = (coverage: number): TColors => {
  if (coverage < 80) {
    return 'red';
  }
  if (coverage < 90) {
    return 'yellow';
  }

  return 'brightgreen';
};

export const getCoverageBadge = (coverageFile: string, hashKey: string): string | boolean => {
  logInfo(`- Getting coverage badge url for ${hashKey}...`);

  try {
    const parsedCoverage: TReport = JSON.parse(coverageFile);

    if (!parsedCoverage.total || !parsedCoverage.total[hashKey]) {
      return false;
    }

    const coverage: number = parsedCoverage.total[hashKey].pct;
    const color = getCoverageColor(coverage);
    const customLabel = getArgumentValue(`${hashKey}Label`);
    const badgeAlt = customLabel ? encodeURI(customLabel) : hashKey;

    return coverageUrlConst(badgeAlt, coverage, color);
  } catch {
    return false;
  }
};

export const getNewReadme =
  (readmeFile: string, coverageFile: string) =>
  (readmeHashes: THashes[]): Promise<string> => {
    logInfo('- Getting new readme data...');

    let newReadmeFile = readmeFile;

    return new Promise((resolve, reject) => {
      readmeHashes.forEach((hash) => {
        const coverageBadge = getCoverageBadge(coverageFile, hash.key);

        if (!coverageBadge) {
          reject('There has been an error getting new coverage badges');
        }

        const pattern = `![${hash.value}]`;
        const enpatterned = (value: string) => `${pattern}(${value})`;

        const startIndex = newReadmeFile.indexOf(pattern);
        const valueToChangeStart = newReadmeFile.slice(startIndex + pattern.length);

        const valueToChangeIndex = valueToChangeStart.indexOf(')');
        const valueToChangeFinal = valueToChangeStart.substring(1, valueToChangeIndex);

        const oldBadge = enpatterned(valueToChangeFinal);
        const newBadge = enpatterned(coverageBadge as string);

        if (getArgumentValue('ci') && oldBadge !== newBadge) {
          reject("The coverage badge has changed, which isn't allowed with the `ci` argument");
        }

        newReadmeFile = newReadmeFile.replace(oldBadge, newBadge);
      });

      resolve(newReadmeFile);
    });
  };

export const writeNewReadme =
  (readmePath: string) =>
  (newReadmeData: string): boolean | void => {
    logInfo('- Writing new readme data...');
    try {
      return fs.writeFileSync(readmePath, newReadmeData, 'utf8');
    } catch {
      return false;
    }
  };

export const editReadme = async (): Promise<void> => {
  logInfo('Info: 2. Editor process started');

  const readmeFile = await readFileAsync(getReadmePath(readmePathConst), 'utf-8');
  const coverageFile = await readFileAsync(getCoveragePath(coveragePathConst), 'utf8');

  return Promise.resolve(getReadmeHashes(readmeFile))
    .then(getNewReadme(readmeFile, coverageFile))
    .then(writeNewReadme(getReadmePath(readmePathConst)))
    .then(() => logInfo('Info: 2. Editor process ended'));
};
