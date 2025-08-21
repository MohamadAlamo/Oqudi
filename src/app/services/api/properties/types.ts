import {IAmount} from '../../../../lib/types/app';
import {TContract} from '../contracts/types';

export type TProperty = {
  _id: string;
  name: string;
  owner: any;
  pictures: string[];
  location: string;
  units: any[];
  leaseType: TLeaseType;
  propertyIncome: IAmount;
  status: TVacancyStatus;
  leasedUnits: number;
  vacantUnits: number;
  contracts: TContract[];
  size: string;
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

export type TAddPropertyRequest = {
  name: string;
  pictures: string[];
  location: string;
  types?: TUnitTypes[];
  leaseType: TLeaseType;
  size: string;
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
