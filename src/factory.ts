type TBadgerFactory = {
  checkConfig: () => Promise<void>;
  editReadme: () => Promise<void>;
  logger: () => {
    logInfo: (message: string) => void;
    logWarn: (message: string) => void;
    logError: (message: string) => void;
  };
  getExitCodeOnError?: () => number | undefined;
};

export const badgerFactory =
  ({ checkConfig, editReadme, logger, getExitCodeOnError }: TBadgerFactory) =>
  (): Promise<void> => {
    const { logInfo, logError } = logger();

    logInfo('Istanbul Badges Readme process started');

    return checkConfig()
      .then(() => editReadme())
      .catch((error) => {
        logError(`${error}`);
        logError('Please refer to the documentation');
        logError('https://github.com/olavoparno/istanbul-badges-readme/blob/master/README.md');
      })
      .finally(() => {
        const exitCode = getExitCodeOnError?.();
        logInfo('Istanbul Badges Readme process finished');

        if (exitCode) {
          process.exit(exitCode);
        }
      });
  };
