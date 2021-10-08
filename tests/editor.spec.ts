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

    expect(existingCoverageBadge).toEqual('https://img.shields.io/badge/bad-95.45%25-brightgreen.svg');
    expect(nonExistingCoverageBadges).toBeFalsy();
    expect(brokenJsonCoverageBadges).toBeFalsy();
    expect(wrongJsonCoverageBadges).toBeFalsy();
  });

  it('should getNewReadme without coverageBadge', async () => {
    const brokenJsonCoveragePath = path.join(__dirname, '../tests/mocks/brokenCoverage.json');
    const brokenJsonCoverageFile = fs.readFileSync(brokenJsonCoveragePath, 'utf-8');

    return expect(
      getNewReadme('fake readme data', brokenJsonCoverageFile)([{ key: 'key', value: 'wronghash' }]),
    ).rejects.toMatch('There has been an error getting new coverage badges');
  });

  it('should break writeNewReadme with failure', () => {
    const hasItSucceeded = writeNewReadme(path.join(__dirname, '../tests/mocks/NON_EXISTING_PATH/wrongFile.md'))(
      'new fake data',
    );

    expect(hasItSucceeded).toBeFalsy();
  });

  it('should accept custom label for hashKey', () => {
    const fakeJsonCoveragePath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');
    const fakeJsonCoverageFile = fs.readFileSync(fakeJsonCoveragePath, 'utf-8');

    process.argv.push('--badLabel=customBadLabel');

    const customBadgeLabel = getCoverageBadge(fakeJsonCoverageFile, 'bad');

    expect(customBadgeLabel).toEqual('https://img.shields.io/badge/customBadLabel-95.45%25-brightgreen.svg');
  });

  it('should have no errors using --ci when readme matches the coverage summary', () => {
    const accurateCoveragePath = path.join(__dirname, '../tests/mocks/accurateCoverage.json');
    const accurateCoverageFile = fs.readFileSync(accurateCoveragePath, 'utf-8');

    const accurateReadmePath = path.join(__dirname, '../tests/mocks/accurateReadme.md');
    const accurateReadmeFile = fs.readFileSync(accurateReadmePath, 'utf-8');

    const readmeHashes = getReadmeHashes(accurateReadmeFile);

    process.argv.push('--ci');

    return expect(getNewReadme(accurateReadmeFile, accurateCoverageFile)(readmeHashes)).resolves.toBe(
      accurateReadmeFile,
    );
  });

  it('should throw error using --ci, when readme does not match coverage summary', () => {
    const inaccurateCoveragePath = path.join(__dirname, '../tests/mocks/inaccurateCoverage.json');
    const inaccurateCoverageFile = fs.readFileSync(inaccurateCoveragePath, 'utf-8');

    const accurateReadmePath = path.join(__dirname, '../tests/mocks/accurateReadme.md');
    const accurateReadmeFile = fs.readFileSync(accurateReadmePath, 'utf-8');

    const readmeHashes = getReadmeHashes(accurateReadmeFile);

    process.argv.push('--ci');

    return expect(getNewReadme(accurateReadmeFile, inaccurateCoverageFile)(readmeHashes)).rejects.toMatch(
      "The coverage badge has changed, which isn't allowed with the `ci` argument",
    );
  });
});
