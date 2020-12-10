export const testedIsMyValueString = (value: unknown): boolean => {
  return typeof value === 'string';
};

export const untestedRandomMethod = (a: (value: unknown) => void, b: unknown): void => {
  return a(b);
};
