import { getArgumentValue } from './arguments';

export const logger = (): {
  logInfo: (message: string) => void;
  logWarn: (message: string) => void;
  logError: (message: string) => void;
} => {
  const customLog =
    (level: (message?: unknown, ...optionalParams: unknown[]) => void, isSupressable: boolean) => (message: string) => {
      const isSupressed = isSupressable && getArgumentValue('silent');

      if (isSupressed) {
        return null;
      }

      return level(message);
    };

  return {
    logInfo: customLog(console.info, true),
    logWarn: customLog(console.warn, true),
    logError: customLog(console.error, false),
  };
};
