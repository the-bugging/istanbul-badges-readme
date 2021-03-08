type TBadgerFactory = {
  checkConfig: () => Promise<void>;
  editReadme: () => Promise<void>;
  logger: () => {
    logInfo: (message: string) => void;
    logWarn: (message: string) => void;
    logError: (message: string) => void;
  };
};

export const badgerFactory = ({ checkConfig, editReadme, logger }: TBadgerFactory) => (): Promise<void> => {
  const { logInfo, logError } = logger();

  logInfo('Info: 0. Istanbul Badges Readme process started');

  return checkConfig()
    .then(() => editReadme())
    .catch((error) => {
      logError(`Error: ${error}`);
      logError('Error: Please refer to the documentation');
      logError('Error: https://github.com/olavoparno/istanbul-badges-readme/blob/master/README.md');
    })
    .finally(() => {
      logInfo('Info: 0. Istanbul Badges Readme process finished');
    });
};
