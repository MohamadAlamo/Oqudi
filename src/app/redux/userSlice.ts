import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TUser} from '../services/api/auth/types';

const initialState: Partial<TUser> = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      return action.payload;
    },
  },
});
export const {setUser} = userSlice.actions;
