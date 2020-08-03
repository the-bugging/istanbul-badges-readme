"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineLogFormats = void 0;
/* istanbul ignore file */
const winston_1 = require("winston");
const { splat, printf, combine, colorize } = winston_1.format;
const colors = () => colorize({
    all: true,
    colors: Object.freeze({
        trace: 'green',
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    }),
});
const upperCaseLevel = winston_1.format((info) => {
    info.level = typeof info.level === 'string' ? info.level.toUpperCase() : info.level;
    return info;
});
const customFormat = () => printf(({ level, message, scope }) => `[${level}] - [${scope}]: ${message}`);
const combineLogFormats = (...formats) => combine(upperCaseLevel(), splat(), colors(), customFormat(), ...formats);
exports.combineLogFormats = combineLogFormats;
