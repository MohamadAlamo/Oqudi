import {SIZE_UNITS, TCurrencies} from '../constants/app';

export interface IAmount {
  value: number;
  currency: TCurrencies;
}

export interface ISize {
  unit: keyof typeof SIZE_UNITS;
  value: number;
}
