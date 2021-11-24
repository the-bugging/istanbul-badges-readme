import path from 'path';
import {
  doesReadmeFileExist,
  doesCoverageFileExist,
  doesCoverageHashesExist,
  doesReadmeHashExist,
} from '../src/validate';

describe('Tests validate file', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw when doesReadmeFileExist does not find file', async () => {
    await doesReadmeFileExist('fake-path').catch((error) => {
      expect(error).toEqual('Readme file does not exist');
    });
  });

  it('should throw when doesCoverageFileExist does not find file', async () => {
    const fakePath = 'fake-path';

    await doesCoverageFileExist('fake-path').catch((error) => {
      expect(error).toEqual(`Coverage file does not exist in ${fakePath}`);
    });
  });

  it("should throw when doesCoverageHashesExist can't find a hash", async () => {
    const fakeJsonPath = path.join(__dirname, '../tests/mocks/fakeBadCoverage.json');

    await doesCoverageHashesExist(fakeJsonPath).catch((error) => {
      expect(error).toEqual('Coverage file does contain the needed hashes');
    });
  });

  it("should throw when doesReadmeHashExist can't find a hash", async () => {
    const fakeReadmeFile = path.join(__dirname, '../tests/mocks/fakeReadmeFile.md');

    await doesReadmeHashExist(fakeReadmeFile).catch((error) => {
      expect(error).toEqual('Readme does not contain the needed hashes');
    });
  });
});
