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

  // Parse duration string to get total months
  const parseDurationToMonths = (durationStr: string): number => {
    if (!durationStr) return 12; // Default to 1 year

    let totalMonths = 0;
    const yearMatch = durationStr.match(/(\d+)\s*year/i);
    const monthMatch = durationStr.match(/(\d+)\s*month/i);
    const dayMatch = durationStr.match(/(\d+)\s*day/i);

    if (yearMatch) {
      totalMonths += parseInt(yearMatch[1]) * 12;
    }
    if (monthMatch) {
      totalMonths += parseInt(monthMatch[1]);
    }
    if (dayMatch) {
      // Convert days to months (approximate)
      totalMonths += Math.ceil(parseInt(dayMatch[1]) / 30);
    }

    return totalMonths || 12; // Default to 12 months if parsing fails
  };

  // Get payment interval in months based on frequency
  const getPaymentIntervalMonths = (frequency: string): number => {
    switch (frequency) {
      case 'Monthly':
        return 1;
      case 'Quarterly':
        return 3;
      case 'Semi-annually':
        return 6;
      case 'Annually':
        return 12;
      default:
        return 1;
    }
  };

  // Calculate payment schedule
  const calculatePaymentSchedule = () => {
    const totalMonths = parseDurationToMonths(duration || '1 year');
    const intervalMonths = getPaymentIntervalMonths(paymentFrequency);
    const numberOfPayments = Math.ceil(totalMonths / intervalMonths);

    // Parse amounts
    const totalRentalAmount = parseFloat(rentalAmount.replace(/,/g, '')) || 0;
    const serviceChargeAmount =
      parseFloat(serviceCharge.replace(/,/g, '')) || 0;
    const vatPercent = parseFloat(vatPercentage) || 0;
    const securityDepositAmount =
      parseFloat(securityDeposit.replace(/,/g, '')) || 0;

    // Calculate base rental per payment
    const baseRentalPerPayment = totalRentalAmount / numberOfPayments;

    // Calculate subtotal (base rental + service charge)
    const subtotalPerPayment = baseRentalPerPayment + serviceChargeAmount;

    // Calculate VAT amount
    const vatAmountPerPayment = subtotalPerPayment * (vatPercent / 100);

    // Calculate total per payment
    const totalPerPayment = subtotalPerPayment + vatAmountPerPayment;

    // Generate payment schedule with dates
    const payments = [];
    const contractStartDate = new Date(startDate);

    for (let i = 0; i < numberOfPayments; i++) {
      const paymentDate = new Date(contractStartDate);
      paymentDate.setMonth(paymentDate.getMonth() + i * intervalMonths);

      // For the last payment, adjust if there's any rounding difference
      const isLastPayment = i === numberOfPayments - 1;
      let adjustedTotal = totalPerPayment;

      if (isLastPayment) {
        // Calculate what the total should be vs what we've calculated
        const calculatedTotal = totalPerPayment * numberOfPayments;
        const expectedTotal =
          totalRentalAmount +
          serviceChargeAmount * numberOfPayments +
          (totalRentalAmount + serviceChargeAmount * numberOfPayments) *
            (vatPercent / 100);
        const difference =
          expectedTotal - totalPerPayment * (numberOfPayments - 1);
        adjustedTotal = difference;
      }

      payments.push({
        paymentNumber: i + 1,
        dueDate: paymentDate,
        formattedDueDate: formatDate(paymentDate),
        baseRental: parseFloat(baseRentalPerPayment.toFixed(2)),
        serviceCharge: serviceChargeAmount,
        subtotal: parseFloat(subtotalPerPayment.toFixed(2)),
        vatAmount: parseFloat(vatAmountPerPayment.toFixed(2)),
        totalAmount: parseFloat(adjustedTotal.toFixed(2)),
        currency: rentalCurrency,
      });
    }

    return {
      numberOfPayments,
      totalContractValue: totalRentalAmount,
      totalServiceCharges: serviceChargeAmount * numberOfPayments,
      totalVATAmount: parseFloat(
        (subtotalPerPayment * numberOfPayments * (vatPercent / 100)).toFixed(2),
      ),
      grandTotal: parseFloat(
        (
          totalRentalAmount +
          serviceChargeAmount * numberOfPayments +
          (totalRentalAmount + serviceChargeAmount * numberOfPayments) *
            (vatPercent / 100)
        ).toFixed(2),
      ),
      securityDeposit: securityDepositAmount,
      payments,
      paymentFrequency,
      contractDuration: duration,
      vatPercentage: vatPercent,
    };
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
      // Add calculated payment schedule data
      paymentSchedule: paymentScheduleData,
    };

    // Console log all form data with payment calculations
    console.log('=== PAYMENT SCHEDULE CALCULATION ===');
    console.log('Number of Payments:', paymentScheduleData.numberOfPayments);
    console.log('Payment Frequency:', paymentScheduleData.paymentFrequency);
    console.log(
      'Total Contract Value:',
      paymentScheduleData.totalContractValue,
    );
    console.log('Grand Total (with VAT):', paymentScheduleData.grandTotal);
    console.log('Security Deposit:', paymentScheduleData.securityDeposit);
    console.log('Individual Payments:', paymentScheduleData.payments);
    console.log('Complete Form Data Object:', formData);
    console.log('===============================');

    setIsLoading(false);

    // Navigate to ScheduleOfPayments with all calculated data
    navigation.navigate(ROUTES.SCHEDULE_OF_PAYMENTS, {
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      formData: formData,
      paymentSchedule: paymentScheduleData,
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
                <Text style={styles.durationText}>{duration}</Text>
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
