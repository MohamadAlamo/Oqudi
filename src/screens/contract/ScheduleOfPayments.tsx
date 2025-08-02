import React, {useMemo, useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';

import Button from '../../components/Button';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../../lib/helpers/fontScaling';
interface ScheduleOfPaymentsProps {
  navigation: StackNavigationProp<any, any>;
  route: any;
}
const safeGetResponsiveSpacing = (spacing: number): number => {
  try {
    const result = getResponsiveSpacing(spacing);
    return typeof result === 'number' && !isNaN(result) ? result : spacing;
  } catch (error) {
    console.warn('Error in getResponsiveSpacing:', error);
    return spacing;
  }
};
const safeGetResponsiveFontSize = (size: number): number => {
  try {
    const result = getResponsiveFontSize(size);
    return typeof result === 'number' && !isNaN(result) ? result : size;
  } catch (error) {
    console.warn('Error in getResponsiveFontSize:', error);
    return size;
  }
};
const ScheduleOfPayments: React.FC<ScheduleOfPaymentsProps> = ({
  navigation,
  route,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async () => {};
  return (
    <View style={styles.parentContainer}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Contract Dates Section */}
          <View style={styles.dateSection}>
            <View style={styles.dateLabelsRow}>
              <Text style={styles.dateLabel}>Contract start date*</Text>
              <Text style={styles.dateLabel2}>Contract end date*</Text>
            </View>
            <View style={styles.dateRow}>
              <View style={styles.dateDisplayContainer}>
                <Text style={styles.dateText}></Text>
              </View>
              <Text style={styles.dateSeparator}>-</Text>
              <View style={styles.dateDisplayContainer}>
                <Text style={styles.dateText}></Text>
              </View>
              <Text style={styles.dateSeparator}>/</Text>
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}></Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? 'Loading...' : 'Save'}
              onPress={handleSubmit}
              backgroundColor={COLORS.primary}
              titleColor="#331800"
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
    },
    scrollView: {
      flex: 1,
    },
    container: {
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
      padding: 20,
      paddingBottom: 40,
    },
    topTextContainer: {
      alignSelf: 'flex-start',
      marginBottom: 30,
    },
    topText: {
      color: theme === 'light' ? '#ADACB1' : '#ADACB1',
      fontSize: 16,
      fontWeight: '400',
      textAlign: 'left',
    },
    // Date section styles
    dateSection: {
      width: '100%',
      marginBottom: 20,
    },
    dateLabelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    dateLabel: {
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontSize: 14,
      fontWeight: '400',
      flex: 1,
      marginHorizontal: 5,
    },
    dateLabel2: {
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontSize: 14,
      fontWeight: '400',
      flex: 1,
      marginRight: 70,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '100%',
    },
    dateDisplayContainer: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: safeGetResponsiveSpacing(16),
      paddingHorizontal: safeGetResponsiveSpacing(16),
      height: safeGetResponsiveSpacing(50),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 14,
      backgroundColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
      borderColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
    },
    dateText: {
      color: theme === 'light' ? COLORS.black : '#F4F3F2',
      fontSize: safeGetResponsiveFontSize(10),
      fontWeight: '600',
      textAlign: 'center',
    },
    dateSeparator: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 10,
      marginBottom: 30,
    },
    durationContainer: {
      paddingVertical: safeGetResponsiveSpacing(16),
      paddingHorizontal: safeGetResponsiveSpacing(16),
      height: safeGetResponsiveSpacing(50),
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 100,
      marginBottom: 0,
      borderWidth: 1,
      borderRadius: 14,
      backgroundColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
      borderColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
    },
    durationText: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: safeGetResponsiveFontSize(10),
      fontWeight: '500',
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      marginTop: 30,
    },
  });

export default ScheduleOfPayments;
