import fs from 'fs';
import path from 'path';
import { getReadmeHashes, getCoverageColor, getCoverageBadge, getNewReadme, writeNewReadme } from '../src/editor';

describe('Tests editor', () => {
  it('should getReadmeHashes from invalid readme', () => {
    const fakeReadmeFile = path.join(__dirname, '../tests/mocks/fakeReadmeFile.md');

    const readmeHashes = getReadmeHashes(fakeReadmeFile);

    expect(readmeHashes.length).toEqual(0);
  });

  it('should getCoverageColor from both red, yellow and green', () => {
    const colorsMap: Record<any, string> = {
      90: 'brightgreen',
      80: 'yellow',
      default: 'red',
    };

    const checkColor = (threshold: number) =>
      expect(getCoverageColor(threshold)).toEqual(colorsMap[threshold] ? colorsMap[threshold] : colorsMap.default);

    checkColor(90);
    checkColor(80);
    checkColor(79);
    checkColor(10);
  });

  it('should getCoverageBadge from coverageFile', () => {
    const fakeJsonCoveragePath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');
    const brokenJsonCoveragePath = path.join(__dirname, '../tests/mocks/brokenCoverage.json');

    const fakeJsonCoverageFile = fs.readFileSync(fakeJsonCoveragePath, 'utf-8');
    const brokenJsonCoverageFile = fs.readFileSync(brokenJsonCoveragePath, 'utf-8');

    const existingCoverageBadge = getCoverageBadge(fakeJsonCoverageFile, 'bad');
    const nonExistingCoverageBadges = getCoverageBadge(fakeJsonCoverageFile, 'nonExistingHash');
    const brokenJsonCoverageBadges = getCoverageBadge(brokenJsonCoverageFile, 'nonExistingHash');
    const wrongJsonCoverageBadges = getCoverageBadge('wrong json', 'nonExistingHash');

    expect(existingCoverageBadge).toEqual('https://img.shields.io/badge/Coverage-95.45%25-brightgreen.svg');
    expect(nonExistingCoverageBadges).toBeFalsy();
    expect(brokenJsonCoverageBadges).toBeFalsy();
    expect(wrongJsonCoverageBadges).toBeFalsy();
  });

  it('should getNewReadme without coverageBadge', async () => {
    const brokenJsonCoveragePath = path.join(__dirname, '../tests/mocks/brokenCoverage.json');

    const brokenJsonCoverageFile = fs.readFileSync(brokenJsonCoveragePath, 'utf-8');

    getNewReadme(
      'fake readme data',
      brokenJsonCoverageFile,
    )([{ key: 'key', value: 'wronghash' }]).catch((error) => {
      expect(error).toEqual('There has been an error getting new coverage badges');
    });
  });

  it('should break writeNewReadme with failure', () => {
    const hasItSucceeded = writeNewReadme(path.join(__dirname, '../tests/mocks/NON_EXISTING_PATH/wrongFile.md'))(
      'new fake data',
    );

    expect(hasItSucceeded).toBeFalsy();
  });
});
