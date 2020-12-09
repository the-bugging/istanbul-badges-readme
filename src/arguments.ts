export const getArgumentValue = (argName: string): string | boolean => {
  const args = process.argv
    .filter((item) => {
      if (item.indexOf(argName) >= 0) {
        return item;
      }

      return '';
    })
    .toString();

  return args ? args.replace(`--${argName}=`, '') : false;
};
