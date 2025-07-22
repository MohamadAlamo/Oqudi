import {IFilter} from './table';

export type TAPIResponse<T = any> = {
  data: T;
  feedback: TFeedback;
};

export type TFeedback = {
  message: string;
  type: 'success' | 'warning' | 'error';
};

export interface IGetQueryParams {
  filters?: IFilter[];
  limit?: number;
  page?: number;
  sort?: string;
}
