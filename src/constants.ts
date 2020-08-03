export const readmePath = './README.md';
export const coveragePath = './coverage/coverage-summary.json';
export const hashes = {
  coverage: [
    { key: 'branches', value: 'Branches' },
    { key: 'functions', value: 'Functions' },
    { key: 'lines', value: 'Lines' },
    { key: 'statements', value: 'Statements' },
  ],
};
export const coverageUrl = (coverage: number, color: string): string =>
  `https://img.shields.io/badge/Coverage-${coverage}${encodeURI('%')}-${color}.svg`;
