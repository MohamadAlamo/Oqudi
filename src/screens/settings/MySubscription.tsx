import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {COLORS} from '../../lib/constants';
import {RootState} from '../../app/redux/store';
import {useSelector} from 'react-redux';
import {ThemeState} from '../../app/redux/themeSlice';

const MySubscription = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>Hello My Subscription</Text>
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
    scrollView: {
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
      minHeight: Dimensions.get('window').height,
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      color: theme === 'light' ? COLORS.black : COLORS.white,
    },
  });

export default MySubscription;
