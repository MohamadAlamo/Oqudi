import AsyncStorage from '@react-native-async-storage/async-storage';
import {TAPIResponse} from '../../../../lib/types/api';
import {apiSlice} from '../../../redux/apiSlice';
import {TGetTenantResponse} from './types';
import {TAddTenantRequest, TAddTenantResponse} from './types';

export const {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useDeleteTenantMutation,
} = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTenants: builder.query<TAPIResponse<TGetTenantResponse[]>, void>({
      query: () => ({
        url: 'tenants',
        method: 'GET',
      }),
      providesTags: ['Tenants'],
    }),
    createTenant: builder.mutation<
      TAPIResponse<TAddTenantResponse>,
      TAddTenantRequest
    >({
      query: credentials => ({
        url: 'tenants',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Tenants'],
    }),
    deleteTenant: builder.mutation<TAPIResponse<{message: string}>, string>({
      query: tenantId => ({
        url: `tenants/@${tenantId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tenants'],
    }),
  }),
  overrideExisting: true,
});
