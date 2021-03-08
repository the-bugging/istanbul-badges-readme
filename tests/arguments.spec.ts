import { getArgumentValue } from '../src/arguments';

it('should return no arguments', () => {
  const args = getArgumentValue('coverageDir');

  expect(args).toBeFalsy();
});

it('should return correct arguments', () => {
  process.argv.push('--coverageDir=coverage-custom');

  const args = getArgumentValue('coverageDir');

  expect(args).toEqual('coverage-custom');
});
