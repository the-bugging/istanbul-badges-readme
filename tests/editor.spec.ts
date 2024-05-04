import fs from 'fs';
import path from 'path';
import { getReadmeHashes, getCoverageBadge, getCoverageColor, getNewReadme, writeNewReadme } from '../src/editor';
import { parseColorConfig } from '../src/helpers';
import { defaultColorThresholds } from '../src/constants';

describe('Tests editor', () => {
  afterEach(() => {
    process.argv.pop();
  });

  it('should getReadmeHashes from invalid readme', () => {
    const fakeReadmeFile = path.join(__dirname, '../tests/mocks/fakeReadmeFile.md');

    const readmeHashes = getReadmeHashes(fakeReadmeFile);

    expect(readmeHashes.length).toEqual(0);
  });

  describe('parseColorConfig', () => {
    it('returns defaultColorThresholds with an invalid color configuration string and warns', () => {
      const inputString = 'red 70,yellow 85';
      const expectedResult = defaultColorThresholds;

      const results = parseColorConfig(inputString);

      expect(results).toEqual(expectedResult);
    });

    it('correctly parses a valid color configuration string', () => {
      const inputString = 'red:70,yellow:85';
      const expectedResult = { red: 70, yellow: 85 };
      expect(parseColorConfig(inputString)).toEqual(expectedResult);
    });

    it('ignores invalid color names', () => {
      const inputString = 'red:70,yellow:85,blue:95';
      const expectedResult = defaultColorThresholds;
      expect(parseColorConfig(inputString)).toEqual(expectedResult);
    });

    it('returns default colors for an empty string', () => {
      const inputString = '';
      const expectedResult = { red: 80, yellow: 90 };
      expect(parseColorConfig(inputString)).toEqual(expectedResult);
    });
  });

  describe('getCoverageColor', () => {
    test.each`
      coverage | expectedColor
      ${75}    | ${'red'}
      ${85}    | ${'yellow'}
      ${95}    | ${'brightgreen'}
    `('returns $expectedColor for a coverage of $coverage using default thresholds', ({ coverage, expectedColor }) => {
      expect(getCoverageColor(coverage)).toBe(expectedColor);
    });

    test('uses custom thresholds if provided', () => {
      const customConfig = 'red:70,yellow:85';
      expect(getCoverageColor(65, customConfig)).toBe('red');
      expect(getCoverageColor(75, customConfig)).toBe('yellow');
      expect(getCoverageColor(90, customConfig)).toBe('brightgreen');
    });

    test('returns brightgreen for coverage above 100', () => {
      expect(getCoverageColor(105)).toBe('brightgreen');
    });
  });

  it('should getCoverageBadge from coverageFile', () => {
    const fakeJsonCoveragePath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');
    const brokenJsonCoveragePath = path.join(__dirname, '../tests/mocks/brokenCoverage.json');

    const fakeJsonCoverageFile = fs.readFileSync(fakeJsonCoveragePath, 'utf8');
    const brokenJsonCoverageFile = fs.readFileSync(brokenJsonCoveragePath, 'utf8');

    const existingCoverageBadge = getCoverageBadge(fakeJsonCoverageFile, 'bad');
    const nonExistingCoverageBadges = getCoverageBadge(fakeJsonCoverageFile, 'nonExistingHash');
    const brokenJsonCoverageBadges = getCoverageBadge(brokenJsonCoverageFile, 'nonExistingHash');
    const wrongJsonCoverageBadges = getCoverageBadge('wrong json', 'nonExistingHash');

    expect(existingCoverageBadge).toEqual('https://img.shields.io/badge/bad-95.45%25-brightgreen.svg?style=flat');
    expect(nonExistingCoverageBadges).toBeFalsy();
    expect(brokenJsonCoverageBadges).toBeFalsy();
    expect(wrongJsonCoverageBadges).toBeFalsy();
  });

  it('should getNewReadme without coverageBadge', async () => {
    const brokenJsonCoveragePath = path.join(__dirname, '../tests/mocks/brokenCoverage.json');
    const brokenJsonCoverageFile = fs.readFileSync(brokenJsonCoveragePath, 'utf8');

    const makeGetNewReadme = getNewReadme('fake readme data', brokenJsonCoverageFile);

    await makeGetNewReadme([{ key: 'key', value: 'wronghash' }]).catch((error) => {
      expect(error).toEqual('There has been an error getting new coverage badges');
    });
  });

  it('should break writeNewReadme with failure', () => {
    const hasItSucceeded = writeNewReadme(path.join(__dirname, '../tests/mocks/NON_EXISTING_PATH/wrongFile.md'))(
      'new fake data',
    );

    expect(hasItSucceeded).toBeFalsy();
  });

  it('should accept custom label for hashKey', () => {
    const fakeJsonCoveragePath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');
    const fakeJsonCoverageFile = fs.readFileSync(fakeJsonCoveragePath, 'utf8');

    process.argv.push('--badLabel=customBadLabel');

    const customBadgeLabel = getCoverageBadge(fakeJsonCoverageFile, 'bad');

    expect(customBadgeLabel).toEqual('https://img.shields.io/badge/customBadLabel-95.45%25-brightgreen.svg?style=flat');
  });

  it('should accept custom style for the badges', () => {
    const fakeJsonCoveragePath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');
    const fakeJsonCoverageFile = fs.readFileSync(fakeJsonCoveragePath, 'utf8');

    process.argv.push('--style="for-the-badge"');

    const customBadgeLabel = getCoverageBadge(fakeJsonCoverageFile, 'bad');

    expect(customBadgeLabel).toEqual('https://img.shields.io/badge/bad-95.45%25-brightgreen.svg?style=for-the-badge');
  });

  it('should accept custom style for the badges calling default fallback for non valid style', () => {
    const fakeJsonCoveragePath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');
    const fakeJsonCoverageFile = fs.readFileSync(fakeJsonCoveragePath, 'utf8');

    process.argv.push('--style=non-valid-style');

    const customBadgeLabel = getCoverageBadge(fakeJsonCoverageFile, 'bad');

    expect(customBadgeLabel).toEqual('https://img.shields.io/badge/bad-95.45%25-brightgreen.svg?style=flat');
  });

  it('should accept custom logo for the badges', () => {
    const fakeJsonCoveragePath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');
    const fakeJsonCoverageFile = fs.readFileSync(fakeJsonCoveragePath, 'utf8');

    process.argv.push('--logo=jest');

    const customBadgeLabel = getCoverageBadge(fakeJsonCoverageFile, 'bad');

    expect(customBadgeLabel).toEqual('https://img.shields.io/badge/bad-95.45%25-brightgreen.svg?style=flat&logo=jest');
  });

  it('should have no errors using --ci when readme matches the coverage summary', async () => {
    const accurateCoveragePath = path.join(__dirname, '../tests/mocks/accurateCoverage.json');
    const accurateCoverageFile = fs.readFileSync(accurateCoveragePath, 'utf8');

    const accurateReadmePath = path.join(__dirname, '../tests/mocks/accurateReadme.md');
    const accurateReadmeFile = fs.readFileSync(accurateReadmePath, 'utf8');

    const readmeHashes = getReadmeHashes(accurateReadmeFile);

    process.argv.push('--ci');

    const makeGetNewReadme = getNewReadme(accurateReadmeFile, accurateCoverageFile);

    await makeGetNewReadme(readmeHashes)
      .then((response) => {
        expect(response).toEqual(accurateReadmeFile);
      })
      .catch((error) => expect(error).toBeTruthy());
  });

  it('should throw error using --ci, when readme does not match coverage summary', async () => {
    const inaccurateCoveragePath = path.join(__dirname, '../tests/mocks/inaccurateCoverage.json');
    const inaccurateCoverageFile = fs.readFileSync(inaccurateCoveragePath, 'utf8');

    const accurateReadmePath = path.join(__dirname, '../tests/mocks/accurateReadme.md');
    const accurateReadmeFile = fs.readFileSync(accurateReadmePath, 'utf8');

    const readmeHashes = getReadmeHashes(accurateReadmeFile);

    process.argv.push('--ci');

    const makeGetNewReadme = getNewReadme(accurateReadmeFile, inaccurateCoverageFile);

    await makeGetNewReadme(readmeHashes).catch((error) => {
      expect(error).toEqual("The coverage badge has changed, which isn't allowed with the `ci` argument");
    });
  });
});
