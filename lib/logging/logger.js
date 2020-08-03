"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var winston_1 = require("winston");
var format_levels_1 = require("./format-levels");
var create = function (scope) {
    return winston_1.createLogger({
        level: 'info',
        defaultMeta: {
            scope: scope,
        },
        exitOnError: false,
        transports: [
            new winston_1.transports.Console({
                format: format_levels_1.combineLogFormats(),
            }),
        ],
    });
};
exports.create = create;
