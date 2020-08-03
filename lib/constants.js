"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverageUrl = exports.hashes = exports.coveragePath = exports.readmePath = void 0;
exports.readmePath = './README.md';
exports.coveragePath = './coverage/coverage-summary.json';
exports.hashes = {
    coverage: [
        { key: 'branches', value: 'Branches' },
        { key: 'functions', value: 'Functions' },
        { key: 'lines', value: 'Lines' },
        { key: 'statements', value: 'Statements' },
    ],
};
exports.coverageUrl = (coverage, color) => `https://img.shields.io/badge/Coverage-${coverage}${encodeURI('%')}-${color}.svg`;
