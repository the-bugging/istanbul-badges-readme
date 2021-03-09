import path from 'path';
import {
  doesReadmeFileExist,
  doesCoverageFileExist,
  getCoveragePath,
  doesCoverageHashesExist,
  doestReadmeHashExist,
} from '../src/validate';

describe('Tests validate file', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should getCoveragePath from arguments', () => {
    process.argv.push('--coverageDir=my-custom-dir');
    const args = getCoveragePath('coverageDir');

    expect(args).toEqual('my-custom-dir/coverage-summary.json');

    process.argv.pop();
  });

  it('should throw when doesReadmeFileExist does not find file', async () => {
    doesReadmeFileExist('fake-path').catch((error) => {
      expect(error).toEqual('Readme file does not exist');
    });
  });

  it('should throw when doesCoverageFileExist does not find file', async () => {
    const fakePath = 'fake-path';

    doesCoverageFileExist('fake-path').catch((error) => {
      expect(error).toEqual(`Coverage file does not exist in ${fakePath}`);
    });
  });

  it("should throw when doesCoverageHashesExist can't find a hash", async () => {
    const fakeJsonPath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');

    doesCoverageHashesExist(fakeJsonPath).catch((error) => {
      expect(error).toEqual('Coverage file does contain the needed hashes');
    });
  });

  it("should throw when doestReadmeHashExist can't find a hash", async () => {
    const fakeReadmeFile = path.join(__dirname, '../tests/mocks/fakeReadmeFile.md');

    doestReadmeHashExist(fakeReadmeFile).catch((error) => {
      expect(error).toEqual('Readme does not contain the needed hashes');
    });
  });
});
