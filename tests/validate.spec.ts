import fs from 'fs';
import path from 'path';
import {
  doesReadmeFileExistWithRightPermissions,
  doesCoverageFileExist,
  doesCoverageHashesExist,
  doesReadmeHashExist,
  getExitCodeOnValidationError,
} from '../src/validate';

describe('Tests validate file', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw when doesReadmeFileExistWithRightPermissions does not find file', async () => {
    const fsSpy = jest.spyOn(fs, 'accessSync').mockImplementation(() => {
      const error: NodeJS.ErrnoException = new Error();
      error.code = 'ENOENT';
      throw error;
    });

    await expect(
      //
      doesReadmeFileExistWithRightPermissions('fake-path'),
    ).rejects.toEqual('Readme file does not exist');

    expect(fsSpy).toHaveBeenNthCalledWith(1, 'fake-path', fs.constants.R_OK | fs.constants.W_OK);
  });

  it('should throw when doesReadmeFileExistWithRightPermissions does find file the file but it does not have read & write permissions', async () => {
    const fsMock = jest.spyOn(fs, 'accessSync').mockImplementation(() => {
      const error: NodeJS.ErrnoException = new Error();
      error.code = 'EACCES';
      throw error;
    });

    await expect(
      //
      doesReadmeFileExistWithRightPermissions('fake-path'),
    ).rejects.toEqual('Readme file does not have read and write permissions');

    expect(fsMock).toHaveBeenNthCalledWith(1, 'fake-path', fs.constants.R_OK | fs.constants.W_OK);
  });

  test('doesReadmeFileExistWithRightPermissions should rethrow any other fs error there is not related with file permissions nor find issues', async () => {
    const fsSpy = jest.spyOn(fs, 'accessSync').mockImplementation(() => {
      const error: NodeJS.ErrnoException = new Error('something');
      error.code = 'EBUSY';
      throw error;
    });

    await expect(
      //
      doesReadmeFileExistWithRightPermissions('fake-path'),
    ).rejects.toEqual('something');

    expect(fsSpy).toHaveBeenNthCalledWith(1, 'fake-path', fs.constants.R_OK | fs.constants.W_OK);
  });

  test('doesReadmeFileExistWithRightPermissions should rethrow any other error there is not related with fs module', async () => {
    const fsSpy = jest.spyOn(fs, 'accessSync');

    fsSpy.mockImplementation(() => {
      throw new Error('something');
    });

    await expect(
      //
      doesReadmeFileExistWithRightPermissions('fake-path'),
    ).rejects.toEqual('something');

    fsSpy.mockImplementation(() => {
      throw new Error();
    });

    await expect(
      //
      doesReadmeFileExistWithRightPermissions('fake-path'),
    ).rejects.toEqual('Something went wrong');

    expect(fsSpy).toHaveBeenNthCalledWith(2, 'fake-path', fs.constants.R_OK | fs.constants.W_OK);
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

  test.each([
    [0, ' is not supplied', undefined],
    [1, ' is supplied', ''],
    [0, '=false', 'false'],
    [1, '=true', 'true'],
  ])('getExitCodeOnValidationError should return %d when --exitCode%s', (expectedExitCode, _, exitCodeArgValue) => {
    if (exitCodeArgValue !== undefined) {
      process.argv.push(`--exitCode=${exitCodeArgValue}`);
    }

    expect(getExitCodeOnValidationError()).toBe(expectedExitCode);

    afterEach(() => {
      process.argv.pop();
    });
  });
});
