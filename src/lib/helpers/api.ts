import {IGetQueryParams} from '../types/api';

/**
 * Joins an array of URL params into a single string.
 * Filters out any falsy values.
 *
 * @param {...string} params - The params to join.
 * @return {string} The joined params.
 */
export const urlParamsJoiner = (...params: (string | undefined)[]): string =>
  params.filter(Boolean).join('&');

export const UrlParamsBuilder = (params: Partial<IGetQueryParams>) => {
  const limit = params.limit ? `limit=${params.limit}` : undefined;
  const sort = params?.sort ? `sort=${params.sort}` : undefined;
  const page = params?.page ? `page=${params.page}` : undefined;
  const filters = params?.filters?.length
    ? 'filters=' + JSON.stringify(params.filters)
    : undefined;

  return urlParamsJoiner(limit, sort, page, filters);
};
