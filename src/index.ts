#!/usr/bin/env node

import { checkConfig } from './validate';
import { editReadme } from './editor';

const badger = () => {
  console.log('Info: 0. Istanbul Badges Readme process started');

  return Promise.resolve(checkConfig())
    .then(() => editReadme())
    .catch((error) => {
      console.log(`Error: ${error}`);
      console.log('Error: Please refer to the documentation');
      console.log('Error: https://github.com/olavoparno/istanbul-badges-readme/blob/master/README.md');
    })
    .finally(() => {
      console.log('Info: 0. Istanbul Badges Readme process finished');
    });
};

badger();
