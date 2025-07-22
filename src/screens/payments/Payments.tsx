import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../lib/constants';
import {RootState} from '../../app/redux/store';
import {useSelector} from 'react-redux';
import {ThemeState} from '../../app/redux/themeSlice';
const Payments = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>Hello, this is Payments Screen</Text>
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      color: theme === 'light' ? '#24232A' : '#F4F3F2',
    },
  });

export default Payments;
