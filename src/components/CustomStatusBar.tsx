import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootState} from '../app/redux/store';
import {COLORS} from '../lib/constants';

const CustomStatusBar = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const backgroundColor =
    theme === 'dark' ? COLORS.StatusBarDark : COLORS.StatusBarLight;

  return (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={
          Platform.OS === 'android' ? backgroundColor : 'transparent'
        }
      />
      {Platform.OS === 'ios' && (
        <SafeAreaView style={{flex: 0, backgroundColor}}>
          {/* iOS Safe Area */}
        </SafeAreaView>
      )}
    </>
  );
};

export default CustomStatusBar;
