export const readmePathConst = './README.md';
export const coveragePathConst = './coverage/coverage-summary.json';
export const hashesConst = {
  coverage: [
    { key: 'branches', value: 'Branches' },
    { key: 'functions', value: 'Functions' },
    { key: 'lines', value: 'Lines' },
    { key: 'statements', value: 'Statements' },
  ],
};
export const coverageUrlConst = (alt: string, coverage: number, color: string): string =>
  `https://img.shields.io/badge/${alt}-${coverage}${encodeURI('%')}-${color}.svg`;
