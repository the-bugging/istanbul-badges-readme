import { badger } from '../src';
import { badgerFactory } from '../src/factory';

describe('Tests istanbul badges readme', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should run mocked badger correctly from start to finish', async () => {
    const consoleSpy = jest.spyOn(console, 'info');

    const checkConfig = () => Promise.resolve();
    const editReadme = () => Promise.resolve();
    const logger = () => ({
      logInfo: (info: string) => console.info(info),
      logError: () => null,
      logWarn: () => null,
    });

    const mockedBadger = badgerFactory({ checkConfig, editReadme, logger });

    await mockedBadger();

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Info: 0. Istanbul Badges Readme process started');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Info: 0. Istanbul Badges Readme process finished');
  });

  it('should run mocked badger with error on checking config', async () => {
    const consoleSpyInfo = jest.spyOn(console, 'info');
    const consoleSpyError = jest.spyOn(console, 'error');

    const checkConfig = () => Promise.reject('Errored!');
    const editReadme = () => Promise.resolve();
    const logger = () => ({
      logInfo: (info: string) => console.info(info),
      logError: (error: string) => console.error(error),
      logWarn: () => null,
    });

    const mockedBadger = badgerFactory({ checkConfig, editReadme, logger });

    await mockedBadger();

    expect(consoleSpyInfo).toHaveBeenCalledTimes(2);
    expect(consoleSpyInfo).toHaveBeenNthCalledWith(1, 'Info: 0. Istanbul Badges Readme process started');
    expect(consoleSpyInfo).toHaveBeenNthCalledWith(2, 'Info: 0. Istanbul Badges Readme process finished');

    expect(consoleSpyError).toHaveBeenCalledTimes(3);
    expect(consoleSpyError).toHaveBeenNthCalledWith(1, 'Error: Errored!');
    expect(consoleSpyError).toHaveBeenNthCalledWith(2, 'Error: Please refer to the documentation');
    expect(consoleSpyError).toHaveBeenNthCalledWith(
      3,
      'Error: https://github.com/olavoparno/istanbul-badges-readme/blob/master/README.md',
    );
  });

  it('should run badger correctly from start to finish', async () => {
    const consoleSpy = jest.spyOn(console, 'info');

    await badger();

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Info: 0. Istanbul Badges Readme process started');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Info: 0. Istanbul Badges Readme process finished');
  });

  it('should run badger correctly from start to finish', async () => {
    const consoleSpy = jest.spyOn(console, 'info');

    await badger();

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Info: 0. Istanbul Badges Readme process started');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Info: 0. Istanbul Badges Readme process finished');
  });
});
