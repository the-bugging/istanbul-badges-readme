/**
 * Gets the node argument value or returns false
 * @param argName the argument name without trailing hyphens i.e. --
 * @example getArgumentValue('coverageDir')
 * @returns string | false
 */
export const getArgumentValue = (argName: string): string | false => {
  const args = process.argv
    .filter((item) => {
      if (item.indexOf(argName) >= 0) {
        return item;
      }

      return '';
    })
    .toString();

  return args ? args.replace(`--${argName}=`, '').replace(/["']/g, '') : false;
};
