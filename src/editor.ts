import fs from 'fs';
import { getArgumentValue } from './arguments';
import { readmePathConst, coveragePathConst, hashesConst, coverageUrlConst, badgeStyles } from './constants';
import { getCoveragePath, getReadmePath, readFileAsync, parseColorConfig } from './helpers';
import { logger } from './logger';
import { Colors, Hashes, Report } from './types';

const { logInfo } = logger();

/**
 * Gets the hashes from the readme file.
 * @param {string} readmeFile - The readme file to search for hashes.
 * @returns {Hashes[]} - An array of hashes found in the readme file.
 */
export const getReadmeHashes = (readmeFile: string): Hashes[] => {
  logInfo('- Getting readme hashes...');

  const readmeHashes = hashesConst.coverage.map((hash) => {
    if (readmeFile.includes(`![${hash.value}]`)) {
      return hash;
    }

    return false;
  });

  const filteredHashes = readmeHashes.filter(Boolean);

  return filteredHashes as unknown as Hashes[];
};

/**
 * Determines the color representation of code coverage based on coverage percentage.
 * Optionally uses a provided string to configure custom color thresholds.
 * @param {number} coverage - The code coverage percentage to evaluate.
 * @param {string | false} colorConfigString - A string to configure custom color thresholds, or false to use defaults.
 * @returns {Colors} - The color associated with the given code coverage percentage, based on either default or custom thresholds.
 */
export const getCoverageColor = (coverage: number, colorConfigString?: string | false): Colors => {
  const colorThresholds = parseColorConfig(colorConfigString);

  // Adjusting to use dynamic color thresholds from colorConfigString if provided
  if (coverage < colorThresholds.red) {
    return 'red';
  }

  if (coverage < colorThresholds.yellow) {
    return 'yellow';
  }

  return 'brightgreen';
};

export const getCoverageBadge = (coverageFile: string, hashKey: string): string | boolean => {
  logInfo(`- Getting coverage badge url for ${hashKey}...`);

  try {
    const parsedCoverage: Report = JSON.parse(coverageFile);

    if (!parsedCoverage.total || !parsedCoverage.total[hashKey]) {
      return false;
    }

    const coverage: number = parsedCoverage.total[hashKey].pct;
    const customColors = getArgumentValue('colors');
    const color = getCoverageColor(coverage, customColors);
    const customLabel = getArgumentValue(`${hashKey}Label`);
    const customBadgeStyle = getArgumentValue('style');
    const customBadgeLogo = getArgumentValue('logo');

    const badgeAlt = customLabel ? encodeURI(customLabel) : hashKey;

    const badgeStyle = badgeStyles[customBadgeStyle.toString()] ?? badgeStyles.default;

    return coverageUrlConst(badgeAlt, coverage, color, badgeStyle, customBadgeLogo);
  } catch {
    return false;
  }
};

export const getNewReadme =
  (readmeFile: string, coverageFile: string) =>
  (readmeHashes: Hashes[]): Promise<string> => {
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
  logInfo('Editor process started');

  const readmeFile = await readFileAsync(getReadmePath(readmePathConst), 'utf-8');
  const coverageFile = await readFileAsync(getCoveragePath(coveragePathConst), 'utf8');

  return Promise.resolve(getReadmeHashes(readmeFile))
    .then(getNewReadme(readmeFile, coverageFile))
    .then(writeNewReadme(getReadmePath(readmePathConst)))
    .then(() => logInfo('Editor process ended'));
};
