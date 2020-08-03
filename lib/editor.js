"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editReadme = exports.writeNewReadme = exports.getNewReadme = exports.getCoverageBadge = exports.getCoverageColor = exports.getReadmeHashes = void 0;
const fs_1 = __importDefault(require("fs"));
const logging_1 = require("./logging");
const constants_1 = require("./constants");
const Logger = logging_1.create('Tamperer');
exports.getReadmeHashes = (readmeFile) => {
    Logger.info('- Getting readme hashes...');
    const readmeHashes = constants_1.hashes.coverage.map((hash) => {
        if (readmeFile.includes(`![${hash.value}]`)) {
            return hash;
        }
        return false;
    });
    const filteredHashes = readmeHashes.filter(Boolean);
    return filteredHashes;
};
exports.getCoverageColor = (coverage) => {
    if (coverage < 80) {
        return 'red';
    }
    if (coverage < 90) {
        return 'yellow';
    }
    return 'brightgreen';
};
exports.getCoverageBadge = (coverageFile, hashKey) => {
    Logger.info(` - Getting coverage badge url for ${hashKey}...`);
    try {
        const parsedCoverage = JSON.parse(coverageFile);
        if (!parsedCoverage.total && parsedCoverage.total[hashKey]) {
            return false;
        }
        const coverage = parsedCoverage.total[hashKey].pct;
        const color = exports.getCoverageColor(coverage);
        return constants_1.coverageUrl(coverage, color);
    }
    catch (_a) {
        return false;
    }
};
exports.getNewReadme = (readmeFile, coverageFile) => (readmeHashes) => {
    Logger.info('- Getting new readme data...');
    let newReadmeFile = readmeFile;
    return new Promise((resolve, reject) => {
        readmeHashes.forEach((hash) => {
            const coverageBadge = exports.getCoverageBadge(coverageFile, hash.key);
            if (!coverageBadge) {
                reject('There has been an error getting new coverage badges');
            }
            const pattern = `![${hash.value}]`;
            const startIndex = newReadmeFile.indexOf(pattern);
            const valueToChangeStart = newReadmeFile.slice(startIndex + pattern.length);
            const valueToChangeIndex = valueToChangeStart.indexOf(')');
            const valueToChangeFinal = valueToChangeStart.substring(1, valueToChangeIndex);
            const newUrl = `${coverageBadge}`;
            newReadmeFile = newReadmeFile.replace(valueToChangeFinal, newUrl);
        });
        resolve(newReadmeFile);
    });
};
exports.writeNewReadme = (readmePath) => (newReadmeData) => {
    Logger.info('- Writing new readme data...');
    try {
        fs_1.default.writeFileSync(readmePath, newReadmeData, 'utf8');
    }
    catch (_a) {
        return false;
    }
};
exports.editReadme = () => {
    Logger.info('2. Editor process started');
    const readmeFile = fs_1.default.readFileSync(constants_1.readmePath, 'utf-8');
    const coverageFile = fs_1.default.readFileSync(constants_1.coveragePath, 'utf8');
    return Promise.resolve(readmeFile)
        .then(exports.getReadmeHashes)
        .then(exports.getNewReadme(readmeFile, coverageFile))
        .then(exports.writeNewReadme(constants_1.readmePath))
        .then(() => Logger.info('2. Editor process ended'));
};
