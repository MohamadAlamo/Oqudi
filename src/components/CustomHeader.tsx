import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../app/redux/store';
import {ThemeState} from '../app/redux/themeSlice';
import {COLORS} from '../lib/constants'; // Import your COLORS constant

interface CustomHeaderProps {
  title: string;
  backgroundColor: string;
  titleColor: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  backgroundColor,
  titleColor,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  return (
    <View style={styles.parentContainer}>
      <View style={[styles.headerContainer, {backgroundColor}]}>
        <Text style={[styles.headerTitle, {color: titleColor}]}>{title}</Text>
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    parentContainer: {
      overflow: 'hidden',
      backgroundColor: theme === 'light' ? COLORS.black : COLORS.CardBackground,
      height: 82,
    },
    headerContainer: {
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: COLORS.white,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    headerTitle: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontStyle: 'normal',
      fontWeight: '700',
      color: '#24232A',
    },
  });

export default CustomHeader;
