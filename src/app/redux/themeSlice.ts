import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Appearance} from 'react-native';

export type ThemeState = 'light' | 'dark' | 'system';

interface State {
  theme: ThemeState;
}

const initialState: State = {
  theme: (Appearance.getColorScheme() as ThemeState) || 'system',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeState>) => {
      state.theme = action.payload;
    },
    syncWithSystemTheme: state => {
      const systemTheme = Appearance.getColorScheme();
      if (systemTheme) {
        state.theme = systemTheme;
      }
    },
  },
});
export const {setTheme, syncWithSystemTheme} = themeSlice.actions;

export default themeSlice.reducer;
