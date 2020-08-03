#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./logging");
const validate_1 = require("./validate");
const editor_1 = require("./editor");
const Logger = logging_1.create('Entry');
const badger = () => {
    Logger.info('0. Istanbul Badges Readme process started');
    return Promise.resolve(validate_1.checkConfig())
        .then(() => editor_1.editReadme())
        .catch((error) => {
        Logger.error(error);
        Logger.error('Please refer to the documentation');
    })
        .finally(() => {
        Logger.info('0. Istanbul Badges Readme process finished');
    });
};
badger();
