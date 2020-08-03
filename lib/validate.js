"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfig = exports.doestReadmeHashExist = exports.doesCoverageHashesExist = exports.doesCoverageExist = exports.doesReadmeExist = exports.getCoveragePath = void 0;
var fs_1 = __importDefault(require("fs"));
var logging_1 = require("./logging");
var constants_1 = require("./constants");
var Logger = logging_1.create('Validate');
exports.getCoveragePath = function (path) {
    var coveragePath = path;
    var argPath = '';
    var args = process.argv
        .filter(function (item) {
        if (item.indexOf('coverage') >= 0) {
            return item;
        }
    })
        .toString();
    if (args) {
        argPath = args.replace('--coverageDir=', '');
    }
    if (argPath && args.length > 0) {
        coveragePath = argPath + "/coverage-summary.json";
    }
    return coveragePath;
};
exports.doesReadmeExist = function (readmePath) {
    return new Promise(function (resolve, reject) {
        var doesItExist = fs_1.default.existsSync(readmePath);
        if (doesItExist)
            return resolve(true);
        return reject('Readme file does not exist');
    });
};
exports.doesCoverageExist = function (coveragePath) {
    return new Promise(function (resolve, reject) {
        var doesItExist = fs_1.default.existsSync(exports.getCoveragePath(coveragePath));
        if (doesItExist)
            return resolve(true);
        return reject('Coverage file does not exist');
    });
};
exports.doesCoverageHashesExist = function (coveragePath) {
    return new Promise(function (resolve, reject) {
        var coverageFile = fs_1.default.readFileSync(coveragePath);
        constants_1.hashes.coverage.forEach(function (hash) {
            if (coverageFile.includes(hash.key))
                return resolve(true);
        });
        return reject('Coverage file does contain the needed hashes');
    });
};
exports.doestReadmeHashExist = function (readmePath) {
    return new Promise(function (resolve, reject) {
        var readmeFile = fs_1.default.readFileSync(readmePath);
        constants_1.hashes.coverage.forEach(function (hash) {
            if (readmeFile.includes(hash.value))
                return resolve(true);
        });
        return reject('Readme does not contain the needed hashes');
    });
};
exports.checkConfig = function () {
    Logger.info('1. Config check process started');
    return Promise.resolve(exports.doesReadmeExist(constants_1.readmePath))
        .then(function () {
        Logger.info('- Readme... Check.');
    })
        .then(function () { return exports.doesCoverageExist(constants_1.coveragePath); })
        .then(function () {
        Logger.info('- Coverage... Check.');
    })
        .then(function () { return exports.doesCoverageHashesExist(constants_1.coveragePath); })
        .then(function () {
        Logger.info('- Coverage Hashes... Check.');
    })
        .then(function () { return exports.doestReadmeHashExist(constants_1.readmePath); })
        .then(function () {
        Logger.info('- Readme Hashes... Check.');
    });
};
