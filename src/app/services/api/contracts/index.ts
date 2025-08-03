import {TAPIResponse} from '../../../../lib/types/api';
import {apiSlice} from '../../../redux/apiSlice';
import {
  TCreateContractRequest,
  TCreateContractResponse,
  TContract,
} from './types';

export const {
  useCreateContractMutation,
  useGetContractsQuery,
  useLazyGetContractsQuery,
} = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createContract: builder.mutation<
      TAPIResponse<TCreateContractResponse>,
      TCreateContractRequest
    >({
      query: credentials => ({
        url: 'contracts',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Contracts'],
    }),
    getContracts: builder.query<TAPIResponse<TContract[]>, void>({
      query: () => ({
        url: 'contracts',
        method: 'GET',
      }),
      providesTags: ['Contracts'],
    }),
  }),
  overrideExisting: true,
});
