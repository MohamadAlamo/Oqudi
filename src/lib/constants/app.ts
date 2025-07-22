export const CURRENCIES = {
  MYR: 'MYR',
  SAR: 'SAR',
  AED: 'AED',
} as const;

export type TCurrencies = (typeof CURRENCIES)[keyof typeof CURRENCIES];

export const SIZE_UNITS = {
  sqft: 'Square Foot',
  m2: 'm2',
};
