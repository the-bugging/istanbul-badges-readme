import { badger } from '../src';
import { badgerFactory } from '../src/factory';

describe('Tests istanbul badges readme', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const consoleInfoFn = jest.fn();
  const consoleErrorFn = jest.fn();

  it('should run mocked badger correctly from start to finish', async () => {
    const checkConfig = () => Promise.resolve();
    const editReadme = () => Promise.resolve();
    const logger = () => ({
      logInfo: consoleInfoFn,
      logError: () => null,
      logWarn: () => null,
    });

    const mockedBadger = badgerFactory({ checkConfig, editReadme, logger });

    await mockedBadger();

    expect(consoleInfoFn).toHaveBeenCalledTimes(2);
    expect(consoleInfoFn).toHaveBeenNthCalledWith(1, 'Istanbul Badges Readme process started');
    expect(consoleInfoFn).toHaveBeenNthCalledWith(2, 'Istanbul Badges Readme process finished');
  });

  it('should run mocked badger with error on checking config', async () => {
    const checkConfig = () => Promise.reject('Errored!');
    const editReadme = () => Promise.resolve();
    const logger = () => ({
      logInfo: consoleInfoFn,
      logError: consoleErrorFn,
      logWarn: () => null,
    });

    const mockedBadger = badgerFactory({ checkConfig, editReadme, logger });

    await mockedBadger();

    expect(consoleInfoFn).toHaveBeenCalledTimes(2);
    expect(consoleInfoFn).toHaveBeenNthCalledWith(1, 'Istanbul Badges Readme process started');
    expect(consoleInfoFn).toHaveBeenNthCalledWith(2, 'Istanbul Badges Readme process finished');

    expect(consoleErrorFn).toHaveBeenCalledTimes(3);
    expect(consoleErrorFn).toHaveBeenNthCalledWith(1, 'Errored!');
    expect(consoleErrorFn).toHaveBeenNthCalledWith(2, 'Please refer to the documentation');
    expect(consoleErrorFn).toHaveBeenNthCalledWith(
      3,
      'https://github.com/the-bugging/istanbul-badges-readme/blob/master/README.md',
    );
  });

  it('should run badger correctly from start to finish', async () => {
    console.info = consoleInfoFn;

    await badger();

    expect(consoleInfoFn).toHaveBeenCalledTimes(2);
    expect(consoleInfoFn).toHaveBeenNthCalledWith(1, 'Istanbul Badges Readme process started');
    expect(consoleInfoFn).toHaveBeenNthCalledWith(2, 'Istanbul Badges Readme process finished');
  });

  it('should run badger with optional exitCode on error', async () => {
    process.argv.push('--coverageDir="fake-non-exitent-path"');

    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => null as unknown as never);

    const checkConfig = () => Promise.reject('Errored!');
    const editReadme = () => Promise.resolve();
    const logger = () => ({
      logInfo: consoleInfoFn,
      logError: consoleErrorFn,
      logWarn: () => null,
    });
    const getExitCodeOnError = () => 1;

    const mockedBadger = badgerFactory({ checkConfig, editReadme, logger, getExitCodeOnError });

    await mockedBadger()
      .catch(() => {
        expect(consoleErrorFn).toHaveBeenCalledTimes(3);
        expect(consoleErrorFn).toHaveBeenNthCalledWith(
          1,
          'File not found at: fake-non-exitent-path/coverage-summary.json',
        );
        expect(consoleErrorFn).toHaveBeenNthCalledWith(2, 'Please refer to the documentation');
        expect(consoleErrorFn).toHaveBeenNthCalledWith(
          3,
          'https://github.com/the-bugging/istanbul-badges-readme/blob/master/README.md',
        );
        expect(processExitSpy).toHaveBeenCalledWith(getExitCodeOnError());
      })
      .finally(() => {
        expect(consoleInfoFn).toHaveBeenCalledWith('Istanbul Badges Readme process finished');
      });
  });
});
