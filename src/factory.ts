import { BadgerFactory } from './types';

export const badgerFactory =
  ({ checkConfig, editReadme, logger, getExitCodeOnError }: BadgerFactory) =>
  (): Promise<void> => {
    const { logInfo, logError } = logger();

    logInfo('Istanbul Badges Readme process started');

    return checkConfig()
      .then(() => editReadme())
      .catch((error) => {
        logError(`${error}`);
        logError('Please refer to the documentation');
        logError('https://github.com/olavoparno/istanbul-badges-readme/blob/master/README.md');

        process.exitCode = getExitCodeOnError?.() ?? 0;
      })
      .finally(() => {
        logInfo('Istanbul Badges Readme process finished');
      });
  };
