"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfig = exports.doestReadmeHashExist = exports.doesCoverageHashesExist = exports.doesCoverageFileExist = exports.doesReadmeFileExist = exports.getCoveragePath = void 0;
const fs_1 = __importDefault(require("fs"));
const logging_1 = require("./logging");
const constants_1 = require("./constants");
const Logger = logging_1.create('Validate');
exports.getCoveragePath = (path) => {
    let coveragePath = path;
    let argPath = '';
    const args = process.argv
        .filter((item) => {
        if (item.indexOf('coverage') >= 0) {
            return item;
        }
    })
        .toString();
    if (args) {
        argPath = args.replace('--coverageDir=', '');
    }
    if (argPath && args.length > 0) {
        coveragePath = `${argPath}/coverage-summary.json`;
    }
    return coveragePath;
};
exports.doesReadmeFileExist = (readmePath) => {
    return new Promise((resolve, reject) => {
        const doesItExist = fs_1.default.existsSync(readmePath);
        if (doesItExist)
            return resolve(true);
        return reject('Readme file does not exist');
    });
};
exports.doesCoverageFileExist = (coveragePath) => {
    return new Promise((resolve, reject) => {
        const doesItExist = fs_1.default.existsSync(exports.getCoveragePath(coveragePath));
        if (doesItExist)
            return resolve(true);
        return reject('Coverage file does not exist');
    });
};
exports.doesCoverageHashesExist = (coveragePath) => {
    return new Promise((resolve, reject) => {
        const coverageFile = fs_1.default.readFileSync(coveragePath);
        constants_1.hashes.coverage.forEach((hash) => {
            if (coverageFile.includes(hash.key))
                return resolve(true);
        });
        return reject('Coverage file does contain the needed hashes');
    });
};
exports.doestReadmeHashExist = (readmePath) => {
    return new Promise((resolve, reject) => {
        const readmeFile = fs_1.default.readFileSync(readmePath);
        constants_1.hashes.coverage.forEach((hash) => {
            if (readmeFile.includes(`![${hash.value}]`))
                return resolve(true);
        });
        return reject('Readme does not contain the needed hashes');
    });
};
exports.checkConfig = () => {
    Logger.info('1. Config check process started');
    return Promise.resolve(exports.doesReadmeFileExist(constants_1.readmePath))
        .then(() => {
        Logger.info('- Readme... Check.');
    })
        .then(() => exports.doesCoverageFileExist(constants_1.coveragePath))
        .then(() => {
        Logger.info('- Coverage... Check.');
    })
        .then(() => exports.doesCoverageHashesExist(constants_1.coveragePath))
        .then(() => {
        Logger.info('- Coverage Hashes... Check.');
    })
        .then(() => exports.doestReadmeHashExist(constants_1.readmePath))
        .then(() => {
        Logger.info('- Readme Hashes... Check.');
    })
        .then(() => Logger.info('1. Config check process ended'));
};
