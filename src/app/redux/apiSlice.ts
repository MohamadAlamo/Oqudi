import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN_KEY, SERVER_URL} from '../config';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL + '/api/',
    // baseUrl: 'https://oqudi-afd5824b7ecf.herokuapp.com/api/',

    async prepareHeaders(headers) {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      console.log(token, 'token');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tenants', 'Properties', 'Units', 'Contracts'],
  endpoints: () => ({}),
});
