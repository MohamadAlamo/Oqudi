import AsyncStorage from '@react-native-async-storage/async-storage';
import {IGetQueryParams, TAPIResponse} from '../../../../lib/types/api';
import {apiSlice} from '../../../redux/apiSlice';
import {TAddPropertyRequest, TAddPropertyResponse, TProperty} from './types';
import {TBaseTableResponse} from '../../../../lib/types/table';
import {UrlParamsBuilder} from '../../../../lib/helpers/api';

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useLazyGetPropertiesQuery,
} = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProperties: builder.query<
      TAPIResponse<TBaseTableResponse<TProperty>>,
      IGetQueryParams
    >({
      query: queryParams => ({
        url: `properties?${UrlParamsBuilder(queryParams)}`,
        method: 'GET',
      }),
      providesTags: ['Properties'],
    }),
    getPropertyById: builder.query<TAPIResponse<TProperty>, string>({
      query: propertyId => ({
        url: `properties/@${propertyId}`,
        method: 'GET',
      }),
      providesTags: ['Properties'],
    }),
    createProperty: builder.mutation<
      TAPIResponse<TAddPropertyResponse>,
      TAddPropertyRequest
    >({
      query: credentials => {
        const formData = new FormData();

        formData.append('name', credentials.name);
        formData.append('location', credentials.location);
        formData.append('leaseType', credentials.leaseType.toString());
        credentials.types?.length &&
          formData.append('types', credentials.types);

        if (credentials.pictures) {
          credentials.pictures.map(picture => {
            const file = {
              uri: picture,
              type: 'image/jpeg',
              name: picture,
            };
            formData.append('pictures', file);
          });
        }
        console.log(formData, 'FormData');

        return {
          url: 'properties',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Properties'],
    }),
  }),
  overrideExisting: true,
});
