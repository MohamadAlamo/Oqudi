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

  // Get all data from route params
  const {startDate, endDate, duration, formData, paymentSchedule} =
    route.params || {};

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Format currency display
  const formatCurrency = (amount: number, currency: string): string => {
    return `${currency} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    // Log the payment schedule data
    console.log('Saving payment schedule:', paymentSchedule);

    // Simulate a brief save operation
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsLoading(false);

    // Navigate back to AddContract with payment schedule data
    navigation.navigate(ROUTES.ADDCONTRACT, {
      ...route.params, // Pass through existing params (unitId, etc.)
      paymentScheduleCompleted: true,
      paymentScheduleData: paymentSchedule,
      formData: formData,
    });
  };

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
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              </View>
              <Text style={styles.dateSeparator}>-</Text>
              <View style={styles.dateDisplayContainer}>
                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
              </View>
              <Text style={styles.dateSeparator}>/</Text>
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>{duration}</Text>
              </View>
            </View>
          </View>

          {/* Payment Cards */}
          {paymentSchedule?.payments?.map((payment: any, index: number) => (
            <View key={index} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentNumber}>
                  № {payment.paymentNumber}
                </Text>
              </View>

              <View style={styles.paymentContent}>
                <View style={styles.paymentRow}>
                  <View style={styles.paymentColumn}>
                    <Text style={styles.paymentLabel}>Due date</Text>
                    <Text style={styles.paymentValue}>
                      {payment.formattedDueDate}
                    </Text>
                  </View>
                  <View style={styles.paymentColumn}>
                    <Text style={styles.paymentLabel}>Rent value</Text>
                    <Text style={styles.paymentValue}>
                      {formatCurrency(payment.baseRental, payment.currency)}
                    </Text>
                  </View>
                </View>

                <View style={styles.paymentRow}>
                  <View style={styles.paymentColumn}>
                    <Text style={styles.paymentLabel}>Services</Text>
                    <Text style={styles.paymentValue}>
                      {formatCurrency(payment.serviceCharge, payment.currency)}{' '}
                      ({paymentSchedule.vatPercentage}%)
                    </Text>
                  </View>
                  <View style={styles.paymentColumn}>
                    <Text style={styles.paymentLabel}>VAT</Text>
                    <Text style={styles.paymentValue}>
                      {formatCurrency(payment.vatAmount, payment.currency)} (
                      {paymentSchedule.vatPercentage}%)
                    </Text>
                  </View>
                </View>

                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total value</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(payment.totalAmount, payment.currency)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

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
      backgroundColor: theme === 'light' ? '#F4F3F2' : COLORS.backgroundDark,
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
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.CardBackground,
      borderColor: theme === 'light' ? COLORS.white : COLORS.CardBackground,
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
      marginBottom: 20,
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
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.CardBackground,
      borderColor: theme === 'light' ? COLORS.white : COLORS.CardBackground,
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
    // Payment card styles - Responsive
    paymentCard: {
      width: '100%',
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.CardBackground,
      borderRadius: safeGetResponsiveSpacing(16),
      marginBottom: safeGetResponsiveSpacing(20),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme === 'light' ? '#E5E5E5' : COLORS.CardBackground,
    },
    paymentHeader: {
      paddingHorizontal: safeGetResponsiveSpacing(20),
      paddingTop: safeGetResponsiveSpacing(20),
      paddingBottom: safeGetResponsiveSpacing(10),
      borderBottomWidth: 1,
      borderBottomColor: theme === 'light' ? '#E5E5E5' : '#333',
    },
    paymentNumber: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: safeGetResponsiveFontSize(18),
      fontWeight: 'bold',
    },
    paymentContent: {
      padding: safeGetResponsiveSpacing(20),
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: safeGetResponsiveSpacing(15),
    },
    paymentColumn: {
      flex: 1,
      marginRight: safeGetResponsiveSpacing(10),
    },
    paymentLabel: {
      color: theme === 'light' ? '#666' : '#ADACB1',
      fontSize: safeGetResponsiveFontSize(14),
      fontWeight: '400',
      marginBottom: safeGetResponsiveSpacing(5),
    },
    paymentValue: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: safeGetResponsiveFontSize(16),
      fontWeight: '600',
      flexWrap: 'wrap',
    },
    totalSection: {
      marginTop: safeGetResponsiveSpacing(10),
      paddingTop: safeGetResponsiveSpacing(15),
      borderTopWidth: 1,
      borderTopColor: theme === 'light' ? '#E5E5E5' : '#333',
    },
    totalLabel: {
      color: theme === 'light' ? '#666' : '#ADACB1',
      fontSize: safeGetResponsiveFontSize(16),
      fontWeight: '400',
      marginBottom: safeGetResponsiveSpacing(5),
    },
    totalValue: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: safeGetResponsiveFontSize(20),
      fontWeight: 'bold',
    },
  });

export default ScheduleOfPayments;
