import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';

import Button from '../../components/Button';
import MoneyInput from '../../components/MoneyInput';
import PercentageInput from '../../components/PercentageInput';
import PaymentFrequencySelector from '../../components/PaymentFrequencySelector';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../../lib/helpers/fontScaling';
import {
  buildPaymentSchedule,
  ScheduleInputs,
} from '../../lib/helpers/paymentCalculator';
interface NewSchedualProps {
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
const NewSchedual: React.FC<NewSchedualProps> = ({navigation, route}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  console.log(route.params, 'route.params ');

  // Get contract dates and duration from route params (from AddContract.tsx)
  const {startDate, endDate, duration} = route.params || {};

  // Fallback dates for UI display (will be replaced by actual dates from AddContract)
  const displayStartDate = startDate ? new Date(startDate) : new Date();
  const displayEndDate = endDate
    ? new Date(endDate)
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  // Form state
  const [rentalAmount, setRentalAmount] = useState('');
  const [rentalCurrency, setRentalCurrency] = useState<'MYR' | 'USD' | 'SAR'>(
    'USD',
  );
  const [paymentFrequency, setPaymentFrequency] = useState<
    'Monthly' | 'Quarterly' | 'Semi-annually' | 'Annually' | ''
  >('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [serviceCurrency, setServiceCurrency] = useState<'MYR' | 'USD' | 'SAR'>(
    'USD',
  );
  const [vatPercentage, setVatPercentage] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [securityCurrency, setSecurityCurrency] = useState<
    'MYR' | 'USD' | 'SAR'
  >('USD');

  // Error states
  const [rentalAmountError, setRentalAmountError] = useState<boolean>(false);
  const [serviceChargeError, setServiceChargeError] = useState<boolean>(false);
  const [vatPercentageError, setVatPercentageError] = useState<boolean>(false);
  const [securityDepositError, setSecurityDepositError] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validation functions
  const validateAmount = (amount: string): boolean => {
    const numericValue = parseFloat(amount.replace(/,/g, ''));
    return !isNaN(numericValue) && numericValue > 0;
  };

  const validatePercentage = (percentage: string): boolean => {
    const numericValue = parseFloat(percentage);
    return !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;
  };

  // Track if user has interacted with each field
  const [rentalAmountTouched, setRentalAmountTouched] = useState(false);
  const [serviceChargeTouched, setServiceChargeTouched] = useState(false);
  const [vatPercentageTouched, setVatPercentageTouched] = useState(false);
  const [securityDepositTouched, setSecurityDepositTouched] = useState(false);

  // Filter input to only allow numbers, decimals, and commas
  const filterNumericInput = (text: string): string => {
    // Allow numbers, decimal point, and comma for thousands separator
    return text.replace(/[^0-9.,]/g, '');
  };

  // Format number with commas for thousands separator
  const formatNumberWithCommas = (text: string): string => {
    // Remove existing commas first
    const cleanText = text.replace(/,/g, '');

    // If empty or just a decimal point, return as is
    if (!cleanText || cleanText === '.') return cleanText;

    // Split by decimal point
    const parts = cleanText.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine with decimal part if it exists
    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  // Currency synchronization handlers
  const handleRentalCurrencyChange = (newCurrency: 'MYR' | 'USD' | 'SAR') => {
    setRentalCurrency(newCurrency);
    setServiceCurrency(newCurrency);
    setSecurityCurrency(newCurrency);
  };

  const handleServiceCurrencyChange = (newCurrency: 'MYR' | 'USD' | 'SAR') => {
    setRentalCurrency(newCurrency);
    setServiceCurrency(newCurrency);
    setSecurityCurrency(newCurrency);
  };

  const handleSecurityCurrencyChange = (newCurrency: 'MYR' | 'USD' | 'SAR') => {
    setRentalCurrency(newCurrency);
    setServiceCurrency(newCurrency);
    setSecurityCurrency(newCurrency);
  };

  // Handle input changes with validation
  const handleRentalAmountChange = (text: string) => {
    const filteredText = filterNumericInput(text);
    const formattedText = formatNumberWithCommas(filteredText);
    setRentalAmount(formattedText);
    setRentalAmountTouched(true);
    if (formattedText.length > 0) {
      setRentalAmountError(!validateAmount(formattedText));
    } else {
      setRentalAmountError(true); // Show error when empty after being touched
    }
  };

  const handleServiceChargeChange = (text: string) => {
    const filteredText = filterNumericInput(text);
    const formattedText = formatNumberWithCommas(filteredText);
    setServiceCharge(formattedText);
    setServiceChargeTouched(true);
    if (formattedText.length > 0) {
      setServiceChargeError(!validateAmount(formattedText));
    } else {
      setServiceChargeError(true); // Show error when empty after being touched
    }
  };

  const handleVatPercentageChange = (text: string) => {
    const filteredText = filterNumericInput(text);
    setVatPercentage(filteredText);
    setVatPercentageTouched(true);
    if (filteredText.length > 0) {
      setVatPercentageError(!validatePercentage(filteredText));
    } else {
      setVatPercentageError(true); // Show error when empty after being touched
    }
  };

  const handleSecurityDepositChange = (text: string) => {
    const filteredText = filterNumericInput(text);
    const formattedText = formatNumberWithCommas(filteredText);
    setSecurityDeposit(formattedText);
    setSecurityDepositTouched(true);
    if (formattedText.length > 0) {
      setSecurityDepositError(!validateAmount(formattedText));
    } else {
      setSecurityDepositError(true); // Show error when empty after being touched
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Simple payment schedule calculation using utility functions
  const calculatePaymentSchedule = () => {
    const scheduleInputs: ScheduleInputs = {
      rentalAmount,
      serviceCharge,
      vatPercentage,
      securityDeposit,
      paymentFrequency: paymentFrequency as
        | 'Monthly'
        | 'Quarterly'
        | 'Semi-annually'
        | 'Annually',
      duration: duration,
      startDate: startDate,
      currency: rentalCurrency,
    };

    return buildPaymentSchedule(scheduleInputs);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    // Validate inputs before submission
    const isRentalAmountValid = validateAmount(rentalAmount);
    const isServiceChargeValid = validateAmount(serviceCharge);
    const isVatPercentageValid = validatePercentage(vatPercentage);
    const isSecurityDepositValid = validateAmount(securityDeposit);

    // Set validation errors
    setRentalAmountError(!isRentalAmountValid && rentalAmount.length > 0);
    setServiceChargeError(!isServiceChargeValid && serviceCharge.length > 0);
    setVatPercentageError(!isVatPercentageValid && vatPercentage.length > 0);
    setSecurityDepositError(
      !isSecurityDepositValid && securityDeposit.length > 0,
    );

    // Check if inputs are empty
    if (!rentalAmount.trim()) {
      setRentalAmountError(true);
      Alert.alert('Error', 'Rental payment invoice is required');
      setIsLoading(false);
      return;
    }

    if (!paymentFrequency) {
      Alert.alert('Error', 'Payment frequency is required');
      setIsLoading(false);
      return;
    }

    if (!serviceCharge.trim()) {
      setServiceChargeError(true);
      Alert.alert('Error', 'Service charge per payment is required');
      setIsLoading(false);
      return;
    }

    if (!vatPercentage.trim()) {
      setVatPercentageError(true);
      Alert.alert('Error', 'VAT per payment is required');
      setIsLoading(false);
      return;
    }

    if (!securityDeposit.trim()) {
      setSecurityDepositError(true);
      Alert.alert('Error', 'Security deposit paid is required');
      setIsLoading(false);
      return;
    }

    // Check validation
    if (
      !isRentalAmountValid ||
      !isServiceChargeValid ||
      !isVatPercentageValid ||
      !isSecurityDepositValid
    ) {
      Alert.alert('Validation Error', 'Please fix the errors above');
      setIsLoading(false);
      return;
    }

    // Calculate payment schedule
    const paymentScheduleData = calculatePaymentSchedule();

    // Create comprehensive form data with all details
    const formData = {
      contractDates: {
        startDate: displayStartDate,
        endDate: displayEndDate,
        duration: duration, // Use duration from route params
        formattedStartDate: formatDate(displayStartDate),
        formattedEndDate: formatDate(displayEndDate),
      },
      TotalRentalInvoice: {
        amount: rentalAmount,
        currency: rentalCurrency,
        numericValue: parseFloat(rentalAmount.replace(/,/g, '')),
      },
      paymentFrequency: paymentFrequency,
      TotalServiceCharge: {
        amount: serviceCharge,
        currency: serviceCurrency,
        numericValue: parseFloat(serviceCharge.replace(/,/g, '')),
      },
      TotalVatPer: {
        percentage: vatPercentage,
        numericValue: parseFloat(vatPercentage),
      },
      TotalSecurityDeposit: {
        amount: securityDeposit,
        currency: securityCurrency,
        numericValue: parseFloat(securityDeposit.replace(/,/g, '')),
      },
      formSubmittedAt: new Date().toISOString(),
      // Add calculated payment schedule data
      paymentSchedule: paymentScheduleData,
    };

    // Console log all form data with payment calculations
    // console.log('=== PAYMENT SCHEDULE CALCULATION ===');
    // console.log('Number of Payments:', paymentScheduleData.numberOfPayments);
    // console.log('Payment Frequency:', paymentScheduleData.paymentFrequency);
    // console.log(
    //   'Total Contract Value:',
    //   paymentScheduleData.totalContractValue,
    // );
    // console.log('Grand Total (with VAT):', paymentScheduleData.grandTotal);
    // console.log('Security Deposit:', paymentScheduleData.securityDeposit);
    // console.log('Individual Payments:', paymentScheduleData.payments);
    // console.log('Complete Form Data Object:', formData);
    // console.log('===============================');

    setIsLoading(false);

    // Navigate to ScheduleOfPayments with all calculated data and original params
    navigation.navigate(ROUTES.SCHEDULE_OF_PAYMENTS, {
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      formData: formData,
      // paymentSchedule: paymentScheduleData,
      // Pass all original route params to preserve unit and tenant data
      ...route.params,
    });
    // TODO: Navigate to next screen or save data to API
  };
  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.parentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.topTextContainer}>
              <Text style={styles.topText}>
                This tool will help you to generate a schedule of all the rents
                due using a simple tool
              </Text>
            </View>

            {/* Contract Dates Section */}
            <View style={styles.dateSection}>
              <View style={styles.dateLabelsRow}>
                <Text style={styles.dateLabel}>Contract start date*</Text>
                <Text style={styles.dateLabel2}>Contract end date*</Text>
              </View>
              <View style={styles.dateRow}>
                <View style={styles.dateDisplayContainer}>
                  <Text style={styles.dateText}>
                    {formatDate(displayStartDate)}
                  </Text>
                </View>
                <Text style={styles.dateSeparator}>-</Text>
                <View style={styles.dateDisplayContainer}>
                  <Text style={styles.dateText}>
                    {formatDate(displayEndDate)}
                  </Text>
                </View>
                <Text style={styles.dateSeparator}>/</Text>
                <View style={styles.durationContainer}>
                  <Text style={styles.durationText}>{duration}</Text>
                </View>
              </View>
            </View>

            {/* Rental Payment Invoice */}
            <MoneyInput
              value={rentalAmount}
              onChangeText={handleRentalAmountChange}
              currency={rentalCurrency}
              onCurrencyChange={handleRentalCurrencyChange}
              label="Rental payment invoice (Annual)*"
              placeholder="0,000"
              error={rentalAmountError}
              success={rentalAmount.length > 0 && !rentalAmountError}
              onValidate={validateAmount}
            />

            {/* Payment Frequency */}
            <PaymentFrequencySelector
              onSelectionChange={setPaymentFrequency}
              initialSelection={paymentFrequency}
              label="Payment frequency*"
            />

            {/* Service Charge Per Payment */}
            <MoneyInput
              value={serviceCharge}
              onChangeText={handleServiceChargeChange}
              currency={serviceCurrency}
              onCurrencyChange={handleServiceCurrencyChange}
              label="Service charge per payment (Annual)"
              placeholder="0,000"
              error={serviceChargeError}
              success={serviceCharge.length > 0 && !serviceChargeError}
              onValidate={validateAmount}
            />

            {/* VAT Per Payment */}
            <PercentageInput
              value={vatPercentage}
              onChangeText={handleVatPercentageChange}
              label="VAT per payment"
              placeholder="%"
              error={vatPercentageError}
              success={vatPercentage.length > 0 && !vatPercentageError}
              onValidate={validatePercentage}
            />

            {/* Security Deposit Paid */}
            <MoneyInput
              value={securityDeposit}
              onChangeText={handleSecurityDepositChange}
              currency={securityCurrency}
              onCurrencyChange={handleSecurityCurrencyChange}
              label="Security deposit paid"
              placeholder="0,00"
              error={securityDepositError}
              success={securityDeposit.length > 0 && !securityDepositError}
              onValidate={validateAmount}
            />

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? 'Loading...' : 'Schedule of payment'}
                onPress={handleSubmit}
                backgroundColor={COLORS.primary}
                titleColor="#331800"
                disabled={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    avoidView: {
      flex: 1,
    },
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
    },
    scrollView: {
      flex: 1,
    },
    scrollContentContainer: {
      flexGrow: 1,
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

export default NewSchedual;
