#!/usr/bin/env node

import { checkConfig } from './validate';
import { editReadme } from './editor';
import { logger } from './logger';
import { badgerFactory } from './factory';

export const badger = badgerFactory({ checkConfig, editReadme, logger });

badger();
