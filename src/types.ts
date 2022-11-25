export type Hashes = {
  key: string;
  value: string;
};

export type Report = {
  [total: string]: Record<string, Record<string, number>>;
};

export type Colors = 'red' | 'yellow' | 'brightgreen';

export type BadgeStyles = 'plastic' | 'flat' | 'flat-square' | 'for-the-badge';

export type BadgerFactory = {
  checkConfig: () => Promise<void>;
  editReadme: () => Promise<void>;
  logger: () => {
    logInfo: (message: string) => void;
    logWarn: (message: string) => void;
    logError: (message: string) => void;
  };
  getExitCodeOnError?: () => number | undefined;
};
