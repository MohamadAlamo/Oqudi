import {UrlParamsBuilder} from '../../../../lib/helpers/api';
import {IGetQueryParams, TAPIResponse} from '../../../../lib/types/api';
import {TBaseTableResponse} from '../../../../lib/types/table';
import {apiSlice} from '../../../redux/apiSlice';
import {TAddUnitRequest, TUnit} from './types';

export const {
  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
} = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUnits: builder.query<
      TAPIResponse<TBaseTableResponse<TUnit>>,
      Partial<IGetQueryParams>
    >({
      query: queryParams => ({
        url: `units?${UrlParamsBuilder(queryParams)}`,
        method: 'GET',
      }),
      providesTags: ['Units'],
    }),
    getUnitById: builder.query<TAPIResponse<TUnit>, string>({
      query: unitId => ({
        url: `units/@${unitId}`,
        method: 'GET',
      }),
      providesTags: ['Units'],
    }),
    createUnit: builder.mutation<TAPIResponse<TUnit>, TAddUnitRequest>({
      query: credentials => {
        const formData = new FormData();

        formData.append('name', credentials.name);
        // formData.append('floor', credentials.floor);
        formData.append('type', credentials.type);
        // formData.append('door', credentials.door);
        formData.append('size', credentials.size + ',m2');
        formData.append('property', credentials.property);

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
          url: 'units',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Units'],
    }),
    updateUnit: builder.mutation<TAPIResponse<TUnit>, Partial<TAddUnitRequest>>(
      {
        query: credentials => {
          const formData = new FormData();

          formData.append('name', credentials.name);
          // formData.append('floor', credentials.floor);
          formData.append('type', credentials.type);
          // formData.append('door', credentials.door);
          formData.append('size', credentials.size);

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
            url: 'units',
            method: 'POST',
            body: formData,
          };
        },
        invalidatesTags: ['Units'],
      },
    ),
  }),
  overrideExisting: true,
});
