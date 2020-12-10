import { testedIsMyValueString } from '.';

describe('Tests Jest Example Methods', () => {
  it('should test testedIsMyValueString for falsy', () => {
    const value = testedIsMyValueString(1);

    expect(value).toBeFalsy();
  });

  it('should test testedIsMyValueString for truthy', () => {
    const value = testedIsMyValueString('Hi!');

    expect(value).toBeTruthy();
  });
});
