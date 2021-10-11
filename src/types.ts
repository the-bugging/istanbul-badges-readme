export type THashes = {
  key: string;
  value: string;
};

export type TReport = {
  [total: string]: Record<string, Record<string, number>>;
};

export type TColors = 'red' | 'yellow' | 'brightgreen';

export type TBadgeStyles = 'plastic' | 'flat' | 'flat-square' | 'for-the-badge';
