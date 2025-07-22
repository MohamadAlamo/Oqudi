import AsyncStorage from '@react-native-async-storage/async-storage';
import {TAPIResponse} from '../../../../lib/types/api';
import {apiSlice} from '../../../redux/apiSlice';
import {
  TLoginRequest,
  TLoginResponse,
  TRegResponse,
  TRegRequest,
  TUser,
} from './types';
import {ACCESS_TOKEN_KEY, USER_ID} from '../../../config';
import {store} from '../../../redux/store';
import {setUser} from '../../../redux/userSlice';

export const {
  useLoginUserMutation,
  useCreateUserMutation,
  useLazyGetAuthQuery,
} = apiSlice.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation<TAPIResponse<TLoginResponse>, TLoginRequest>({
      query: credentials => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: (_, {queryFulfilled}) => {
        queryFulfilled.then(response => {
          AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.data.token);
          AsyncStorage.setItem('accountType', response.data.data.accountType);
          console.log(response.data.data._id, 'New USER ID');

          AsyncStorage.setItem(USER_ID, response.data.data._id);

          console.log(response.data.data.accountType);
          return response.data;
        });
      },
    }),
    createUser: builder.mutation<TAPIResponse<TRegResponse>, TRegRequest>({
      query: credentials => ({
        url: 'users',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: (_, {queryFulfilled}) => {
        queryFulfilled.then(response => {
          AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.data.token);
          return response.data;
        });
      },
    }),
    getAuth: builder.query<TAPIResponse<TUser>, string>({
      query: userId => {
        return {
          url: `users/@${userId}`,
          method: 'GET',
        };
      },
      onQueryStarted: (_, {queryFulfilled}) => {
        queryFulfilled.then(response => {
          return response.data;
        });
      },
    }),
  }),

  overrideExisting: true,
});
