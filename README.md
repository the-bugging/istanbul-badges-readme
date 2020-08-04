# Istanbul Badges Readme

> Creates README badges from istanbul coverage report

| Statements                                                                    | Branches                                                               | Functions                                                                    | Lines                                                                   |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-94.85%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-87.04%25-yellow.svg) | ![Functions](https://img.shields.io/badge/Coverage-92.03%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-95.2%25-brightgreen.svg) |

---

## Table of Contents

- [Example Markup](<#example-markup-(paste-it-anywhere-in-your-README.md)>)
- [Example Running](#example-running)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Using as a part of your githooks](#using-as-a-part-of-your-githooks)
- [License](#license)

---

## Example markup (paste it anywhere in your README.md)

```markdown
| Statements                | Branches                | Functions                | Lines                |
| ------------------------- | ----------------------- | ------------------------ | -------------------- |
| ![Statements](#branches#) | ![Branches](#branches#) | ![Functions](#branches#) | ![Lines](#branches#) |
```

- The table is **optional**, the only markups that matters are the following:

1. `![Statements]`
1. `![Branches]`
1. `![Functions]`
1. `![Lines]`

---

## Example running

![Example](./assets/readme-gif.gif)

---

### Requirements

- **\*Must** have at least one of the [before mentioned markup items](<#example-markup-(paste-it-anywhere-in-your-README.md)>);
- You should have **json-summary** as a **coverageReporter** in your tests configuration;
- For example, if you are using Jest, configuration should either be within `package.json` or inside your jest config file i.e. `jest.config.js` or `jestconfig.json` as shown below:

```json
  "coverageReporters": ["json-summary"]
```

---

## Installation

```bash
  npm i -D istanbul-badges-readme
```

---

## Usage

- Simply run it from the CLI as follows:

```bash
  npm run istanbul-badges-readme
```

- With custom coverage directory:

```bash
  npm run istanbul-badges-readme --coverageDir="./my-custom-coverage-directory"
```

- Or add it to your **package.json** scripts as follows:

```json
"scripts": {
  "make-badges": "istanbul-badges-readme",
}
```

---

## Using as a part of your githooks

- If you want to have this run on the **pre-commit** hook and update the commit in place, just install husky and add the `pre-commit` script to your package.json.

1. Install Husky.

```bash
  npm install -D husky
```

2. Add your **pre-commit** script:

```json
  "husky": {
    "hooks": {
      "pre-commit": "npm run test && istanbul-badges-readme && git add 'README.md'"
    }
  }
```

3. Git Commit and Push. Just use your workflow as usual. If your tests fail, no commit. If they pass, update the README.md and add the file to the commit. Nice!

---

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://olavoparno.github.io"><img src="https://avatars1.githubusercontent.com/u/7513162?v=4" width="70px;" alt="Olavo Parno"/><br /><sub><b>Olavo Parno</b></sub></a><br /><a href="#ideas-olavoparno" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/olavoparno/jest-badges-readme/commits?author=olavoparno" title="Code">💻</a> <a href="https://github.com/olavoparno/jest-badges-readme/commits?author=olavoparno" title="Tests">⚠️</a></td><td align="center"><a href="https://github.com/nothingismagick"><img src="https://avatars1.githubusercontent.com/u/35242872?v=4" width="70px;" alt="nothingismagick"/><br /><sub><b>nothingismagick</b></sub></a><br /><a href="#ideas-nothingismagick" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/olavoparno/jest-badges-readme/issues?q=author%3Anothingismagick" title="Bug reports">🐛</a> <a href="#content-nothingismagick" title="Content">🖋</a></td><td align="center"><a href="http://www.fallenclient.co.uk"><img src="https://avatars2.githubusercontent.com/u/326470?v=4" width="70px;" alt="Dave Fisher"/><br /><sub><b>Dave Fisher</b></sub></a><br /><a href="https://github.com/olavoparno/jest-badges-readme/issues?q=author%3Afallenclient" title="Bug reports">🐛</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

---

## License

Istanbul Badges Readme is [MIT licensed](./LICENSE).
