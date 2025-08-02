import React, {useMemo, useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, Alert} from 'react-native';
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

  // Get contract dates from route params (from AddContract.tsx)
  const {startDate, endDate} = route.params || {};

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

  // Handle input changes with validation
  const handleRentalAmountChange = (text: string) => {
    const filteredText = filterNumericInput(text);
    setRentalAmount(filteredText);
    setRentalAmountTouched(true);
    if (filteredText.length > 0) {
      setRentalAmountError(!validateAmount(filteredText));
    } else {
      setRentalAmountError(true); // Show error when empty after being touched
    }
  };

  const handleServiceChargeChange = (text: string) => {
    const filteredText = filterNumericInput(text);
    setServiceCharge(filteredText);
    setServiceChargeTouched(true);
    if (filteredText.length > 0) {
      setServiceChargeError(!validateAmount(filteredText));
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
    setSecurityDeposit(filteredText);
    setSecurityDepositTouched(true);
    if (filteredText.length > 0) {
      setSecurityDepositError(!validateAmount(filteredText));
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

  // Calculate duration between dates
  const calculateDuration = (start: Date, end: Date): string => {
    if (!start || !end) return '';
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);

      if (months === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years} year${years > 1 ? 's' : ''} ${months} month${
          months > 1 ? 's' : ''
        }`;
      }
    }
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

    // Create comprehensive form data with all details
    const formData = {
      contractDates: {
        startDate: displayStartDate,
        endDate: displayEndDate,
        duration: calculateDuration(displayStartDate, displayEndDate),
        formattedStartDate: formatDate(displayStartDate),
        formattedEndDate: formatDate(displayEndDate),
      },
      rentalPaymentInvoice: {
        amount: rentalAmount,
        currency: rentalCurrency,
        numericValue: parseFloat(rentalAmount.replace(/,/g, '')),
      },
      paymentFrequency: paymentFrequency,
      serviceChargePerPayment: {
        amount: serviceCharge,
        currency: serviceCurrency,
        numericValue: parseFloat(serviceCharge.replace(/,/g, '')),
      },
      vatPerPayment: {
        percentage: vatPercentage,
        numericValue: parseFloat(vatPercentage),
      },
      securityDepositPaid: {
        amount: securityDeposit,
        currency: securityCurrency,
        numericValue: parseFloat(securityDeposit.replace(/,/g, '')),
      },
      formSubmittedAt: new Date().toISOString(),
    };

    // Console log all form data with currencies and percentage
    // console.log('=== NEW SCHEDULE FORM DATA ===');
    // console.log(
    //   'Contract Start Date:',
    //   formData.contractDates.formattedStartDate,
    // );
    // console.log('Contract End Date:', formData.contractDates.formattedEndDate);
    // console.log('Contract Duration:', formData.contractDates.duration);
    // console.log(
    //   'Rental Payment Invoice:',
    //   formData.rentalPaymentInvoice.amount,
    //   formData.rentalPaymentInvoice.currency,
    // );
    // console.log('Payment Frequency:', formData.paymentFrequency);
    // console.log(
    //   'Service Charge Per Payment:',
    //   formData.serviceChargePerPayment.amount,
    //   formData.serviceChargePerPayment.currency,
    // );
    // console.log('VAT Per Payment:', formData.vatPerPayment.percentage + '%');
    // console.log(
    //   'Security Deposit Paid:',
    //   formData.securityDepositPaid.amount,
    //   formData.securityDepositPaid.currency,
    // );
    console.log('Complete Form Data Object:', formData);
    console.log('===============================');

    setIsLoading(false);

    // Show success message
    // Alert.alert('Success', 'Schedule data has been logged to console');
    navigation.navigate(ROUTES.SCHEDULE_OF_PAYMENTS, {
      // startDate: startDate.toISOString(),
      // endDate: endDate.toISOString(),
    });
    // TODO: Navigate to next screen or save data to API
  };
  return (
    <View style={styles.parentContainer}>
      <ScrollView
        style={styles.scrollView}
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
                <Text style={styles.durationText}>
                  {calculateDuration(displayStartDate, displayEndDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Rental Payment Invoice */}
          <MoneyInput
            value={rentalAmount}
            onChangeText={handleRentalAmountChange}
            currency={rentalCurrency}
            onCurrencyChange={setRentalCurrency}
            label="Rental payment invoice*"
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
            onCurrencyChange={setServiceCurrency}
            label="Service charge per payment"
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
            onCurrencyChange={setSecurityCurrency}
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

export default NewSchedual;
