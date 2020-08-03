"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineLogFormats = void 0;
/* istanbul ignore file */
var winston_1 = require("winston");
var splat = winston_1.format.splat, printf = winston_1.format.printf, combine = winston_1.format.combine, colorize = winston_1.format.colorize;
var colors = function () {
    return colorize({
        all: true,
        colors: Object.freeze({
            trace: 'green',
            info: 'blue',
            warn: 'yellow',
            error: 'red',
            fatal: 'red',
        }),
    });
};
var upperCaseLevel = winston_1.format(function (info) {
    info.level = typeof info.level === 'string' ? info.level.toUpperCase() : info.level;
    return info;
});
var customFormat = function () { return printf(function (_a) {
    var level = _a.level, message = _a.message, scope = _a.scope;
    return "[" + level + "] - [" + scope + "]: " + message;
}); };
var combineLogFormats = function () {
    var formats = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        formats[_i] = arguments[_i];
    }
    return combine.apply(void 0, __spreadArrays([upperCaseLevel(), splat(), colors(), customFormat()], formats));
};
exports.combineLogFormats = combineLogFormats;
