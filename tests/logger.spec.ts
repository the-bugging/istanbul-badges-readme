import { logger } from '../src/logger';

describe('Tests logger helper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log everything correctly', () => {
    const infoSpy = jest.spyOn(console, 'info');
    const warnSpy = jest.spyOn(console, 'warn');
    const errorSpy = jest.spyOn(console, 'error');

    const log = logger();

    log.logInfo('informed!');
    log.logWarn('warned!');
    log.logError('errored!');

    expect(infoSpy).toHaveBeenCalledWith('informed!');
    expect(warnSpy).toHaveBeenCalledWith('warned!');
    expect(errorSpy).toHaveBeenCalledWith('errored!');
  });

  it('should not log with --silent arguments expect for console.error', () => {
    process.argv.push('--silent');

    const infoSpy = jest.spyOn(console, 'info');
    const warnSpy = jest.spyOn(console, 'warn');
    const errorSpy = jest.spyOn(console, 'error');

    const log = logger();

    log.logInfo('informed!');
    log.logWarn('warned!');
    log.logError('errored!');

    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('errored!');
  });
});
