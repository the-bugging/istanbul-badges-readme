import { getCoveragePath, getExitCodeOnError, getReadmePath, readFileAsync } from '../src/helpers';

describe('test helpers file', () => {
  afterEach(() => {
    process.argv.pop();
  });
  it('should getCoveragePath from arguments', () => {
    process.argv.push('--coverageDir=my-custom-dir');
    const args = getCoveragePath('coverageDir');

    expect(args).toEqual('my-custom-dir/coverage-summary.json');
  });

  it('should getReadmePath from arguments', () => {
    process.argv.push('--readmeDir=my-custom-dir');
    const args = getReadmePath('readmeDir');

    expect(args).toEqual('my-custom-dir/README.md');
  });

  it('should fail to read an async file', async () => {
    await readFileAsync('./foo/bar.biz', 'utf-8').catch((e) => expect(e).toEqual('File not found at: ./foo/bar.biz'));
  });

  it('should handle optional exitCode usage with a NaN', () => {
    process.argv.push('--exitCode=sasa');
    const exitCode = getExitCodeOnError();

    expect(exitCode).toBeUndefined();
  });

  it('should handle optional exitCode usage with a valid exit number', () => {
    process.argv.push('--exitCode=1');
    const exitCode = getExitCodeOnError();

    expect(exitCode).toEqual(1);
  });
});
