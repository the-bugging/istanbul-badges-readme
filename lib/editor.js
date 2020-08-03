"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editReadme = exports.editReadmeHashes = exports.getReadmeHashes = void 0;
var fs_1 = __importDefault(require("fs"));
var logging_1 = require("./logging");
var constants_1 = require("./constants");
var Logger = logging_1.create('Editor');
exports.getReadmeHashes = function (readmePath) {
    var readmeFile = fs_1.default.readFileSync(readmePath);
    var readmeHashes = constants_1.hashes.coverage.map(function (hash) {
        if (readmeFile.includes(hash.key)) {
            Logger.info("- Editing hash for " + hash.value);
            return hash;
        }
        return false;
    });
    return readmeHashes.filter(Boolean);
};
exports.editReadmeHashes = function (readmePath) { return function (readmeHashes) {
    var readmeFile = fs_1.default.readFileSync(readmePath);
    console.log('readmeHashes', readmeHashes);
}; };
exports.editReadme = function () {
    Logger.info('2. Editor process started');
    return Promise.resolve(exports.getReadmeHashes(constants_1.readmePath))
        .then(exports.editReadmeHashes(constants_1.readmePath))
        .then(function () { });
};
