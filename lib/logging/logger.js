"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
/* istanbul ignore file */
const winston_1 = require("winston");
const format_levels_1 = require("./format-levels");
const create = (scope) => winston_1.createLogger({
    level: 'info',
    defaultMeta: {
        scope,
    },
    exitOnError: false,
    transports: [
        new winston_1.transports.Console({
            format: format_levels_1.combineLogFormats(),
        }),
    ],
});
exports.create = create;
