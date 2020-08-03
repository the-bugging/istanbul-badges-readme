#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = require("./logging");
var validate_1 = require("./validate");
var editor_1 = require("./editor");
var Logger = logging_1.create('Entry');
var badger = function () {
    Logger.info('0. Istanbul Badges Readme process started');
    return Promise.resolve(validate_1.checkConfig())
        .then(function () { return editor_1.editReadme(); })
        .catch(function (error) {
        Logger.error(error);
        Logger.error('Please refer to the documentation');
    })
        .finally(function () {
        Logger.info('Istanbul Badges Readme process finished');
    });
};
badger();
