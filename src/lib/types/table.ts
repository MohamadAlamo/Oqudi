export type IFilter = Record<
  string,
  {
    operator:
      | 'equals'
      | 'not-equal'
      | 'greater'
      | 'less-than'
      | 'greater-equal'
      | 'less-equal'
      | 'null'
      | 'not-null'
      | 'between'
      | 'contains';
    value: unknown;
  }
>;

export type TBaseRow<T> = T & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TBaseTableResponse<T = any> = {
  docs: TBaseRow<T>[];
  limit: number;
  page: number;
  totalDocs: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};
