#!/usr/bin/env node

import { checkConfig } from './validate';
import { editReadme } from './editor';
import { logger } from './logger';

const badger = (): Promise<void> => {
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

badger();
