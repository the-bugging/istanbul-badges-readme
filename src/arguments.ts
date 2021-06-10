export const getArgumentValue = (argName: string): string | false => {
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
