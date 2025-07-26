import {IAmount, ISize} from '../../../../lib/types/app';
import {TUser} from '../auth/types';
import {TProperty} from '../properties/types';

export type TUnit = {
  _id: string;
  name: string;
  property: TProperty;
  size: ISize;
  // floor: number;
  // door: number;
  pictures: string[];
  type: TUnitTypes;
  propertyIncome: IAmount;
  status: TVacancyStatus;
  contracts: [];
  notes?: string[];
  owner: TUser;
};

export const VACANCY_STATUS = {
  vacant: 'vacant',
  rented: 'rented',
  unavailable: 'unavailable',
} as const;

export type TVacancyStatus =
  (typeof VACANCY_STATUS)[keyof typeof VACANCY_STATUS];

export type TAddPropertyResponse = {
  token: string;
};

export type TAddUnitRequest = Omit<
  TUnit,
  | '_id'
  | 'propertyIncome'
  | 'contracts'
  | 'status'
  | 'size'
  | 'property'
  | 'owner'
> & {
  size: string;
  property: string;
};

export const UNIT_TYPES = {
  residential: 'residential',
  office: 'office',
  industrial: 'industrial',
  retail: 'retail',
} as const;

export const LEASE_TYPE = {
  whole: 'whole',
  units: 'units',
} as const;

export type TUnitTypes = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES];
export type TLeaseType = (typeof LEASE_TYPE)[keyof typeof LEASE_TYPE];
