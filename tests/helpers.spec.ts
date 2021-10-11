import { getCoveragePath, getReadmePath, readFileAsync } from '../src/helpers';

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
    await readFileAsync('./foo/bar.biz', 'utf-8').catch((e) => expect(e).toEqual('file not found: ./foo/bar.biz'));
  });
});
