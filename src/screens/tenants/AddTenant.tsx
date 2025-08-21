import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {ThemeState} from '../../app/redux/themeSlice';
import {useSelector} from 'react-redux';
import {COLORS, ROUTES} from '../../lib/constants';
import Input from '../../components/input';
import Button from '../../components/Button';
import {StackNavigationProp} from '@react-navigation/stack';
import {SocialButton} from '../../components/SocialButton';
import {RootState, useAppSelector} from '../../app/redux/store';
import {useCreateTenantMutation} from '../../app/services/api/tenants';
import {asyncHandler} from 'async-handler-ts';
import {useFormExitConfirmation} from '../../lib/hooks/useFormExitConfirmation';

interface AddTenantProps {
  navigation: StackNavigationProp<any, any>;
  route?: any;
}
const AddTenant: React.FC<AddTenantProps> = ({navigation, route}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputAddress, setInputAddress] = useState('');

  const [inputVatNumber, setInputVatNumber] = useState('');
  const [inputAdditional, setInputAdditional] = useState('');

  // Validation error states
  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<boolean>(false);
  const [vatNumberError, setVatNumberError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [regTenant] = useCreateTenantMutation();

  // Use form exit confirmation hook - navigate back to previous screen on discard
  useFormExitConfirmation({
    navigation,
    // No targetRoute specified - will use navigation.goBack() as fallback
  });

  // Validation functions
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return phone.trim().length >= 8; // Minimum phone number length
  };

  const validateAddress = (address: string): boolean => {
    return address.trim().length >= 4; // Minimum address length
  };

  const validateVatNumber = (vatNumber: string): boolean => {
    return vatNumber.trim().length >= 3; // Minimum VAT number length
  };

  // Handle input changes with validation
  const handleFirstNameChange = (text: string) => {
    setInputFirstName(text);
    if (text.length > 0) {
      setFirstNameError(!validateName(text));
    } else {
      setFirstNameError(false);
    }
  };

  const handleLastNameChange = (text: string) => {
    setInputLastName(text);
    if (text.length > 0) {
      setLastNameError(!validateName(text));
    } else {
      setLastNameError(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    setInputPhone(text);
    if (text.length > 0) {
      setPhoneError(!validatePhone(text));
    } else {
      setPhoneError(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setInputEmail(text);
    if (text.length > 0) {
      setEmailError(!validateEmail(text));
    } else {
      setEmailError(false);
    }
  };

  const handleAddressChange = (text: string) => {
    setInputAddress(text);
    if (text.length > 0) {
      setAddressError(!validateAddress(text));
    } else {
      setAddressError(false);
    }
  };

  const handleVatNumberChange = (text: string) => {
    setInputVatNumber(text);
    if (text.length > 0) {
      setVatNumberError(!validateVatNumber(text));
    } else {
      setVatNumberError(false);
    }
  };

  const handleAddTenant = async () => {
    // Validate inputs before API call
    const isFirstNameValid = validateName(inputFirstName);
    const isLastNameValid = validateName(inputLastName);
    const isPhoneValid = validatePhone(inputPhone);
    const isEmailValid = validateEmail(inputEmail);
    const isAddressValid = validateAddress(inputAddress);
    const isVatNumberValid =
      inputVatNumber.trim() === '' || validateVatNumber(inputVatNumber); // VAT is optional

    // Set validation errors
    setFirstNameError(!isFirstNameValid && inputFirstName.length > 0);
    setLastNameError(!isLastNameValid && inputLastName.length > 0);
    setPhoneError(!isPhoneValid && inputPhone.length > 0);
    setEmailError(!isEmailValid && inputEmail.length > 0);
    setAddressError(!isAddressValid && inputAddress.length > 0);
    setVatNumberError(!isVatNumberValid && inputVatNumber.length > 0);

    // Check if required inputs are empty
    if (!inputFirstName.trim()) {
      setFirstNameError(true);
      Alert.alert('Error', 'First name is required');
      return;
    }

    if (!inputLastName.trim()) {
      setLastNameError(true);
      Alert.alert('Error', 'Last name is required');
      return;
    }

    if (!inputPhone.trim()) {
      setPhoneError(true);
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    if (!inputEmail.trim()) {
      setEmailError(true);
      Alert.alert('Error', 'Email is required');
      return;
    }

    if (!inputAddress.trim()) {
      setAddressError(true);
      Alert.alert('Error', 'Address is required');
      return;
    }

    // Check validation
    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isPhoneValid ||
      !isEmailValid ||
      !isAddressValid ||
      !isVatNumberValid
    ) {
      Alert.alert('Validation Error', 'Please fix the errors above');
      return;
    }

    setIsLoading(true);

    const [result, error] = await asyncHandler(
      regTenant({
        name: inputFirstName + ' ' + inputLastName,
        phone: inputPhone,
        email: inputEmail,
        location: inputAddress,
        VAT_ID: inputVatNumber,
        notes: inputAdditional,
      }).unwrap(),
    );

    setIsLoading(false);

    if (error) {
      console.log({error});
      let errorMessage = 'Failed to create tenant. Please try again';

      // Handle different types of API errors
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 409) {
          errorMessage = 'Tenant with this email already exists';
        } else if (apiError.status === 400) {
          errorMessage = 'Please check your information';
        } else if (apiError.status === 500) {
          errorMessage = 'Server error. Please try again later';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Failed to Create Tenant', errorMessage);
      return;
    }

    // Check if we came from AddContract
    const returnTo = route?.params?.returnTo;
    const originalParams = route?.params?.originalParams;

    if (returnTo === 'AddContract' && result) {
      // Create tenant object from form data since API only returns token
      const newTenant = {
        _id: Date.now().toString(), // Temporary ID
        name: {
          firstName: inputFirstName,
          lastName: inputLastName,
        },
        phone: inputPhone,
        email: inputEmail,
        location: inputAddress,
        VAT_ID: inputVatNumber,
        notes: inputAdditional,
      };

      // Navigate back to AddContract with the newly created tenant
      navigation.navigate(ROUTES.ADDCONTRACT, {
        ...originalParams,
        selectedTenant: newTenant,
      });
    } else {
      // Default behavior - go to tenants list
      navigation.navigate('BottomTabs', {screen: ROUTES.TENANTS});
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <View style={styles.inputscontainer}>
            <Text style={styles.textStarted}>
              We'll use this to create a new tenant contact.
            </Text>
            <ScrollView>
              <Input
                label="First name"
                value={inputFirstName}
                onChangeText={handleFirstNameChange}
                placeholder="Enter first name"
                keyboardType="default"
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={firstNameError}
                success={inputFirstName.length > 0 && !firstNameError}
              />
              <Input
                label="Last name"
                value={inputLastName}
                onChangeText={handleLastNameChange}
                placeholder="Enter last name"
                keyboardType="default"
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={lastNameError}
                success={inputLastName.length > 0 && !lastNameError}
              />
              <Input
                label="Phone"
                value={inputPhone}
                onChangeText={handlePhoneChange}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={phoneError}
                success={inputPhone.length > 0 && !phoneError}
              />
              <Input
                label="Email"
                value={inputEmail}
                onChangeText={handleEmailChange}
                placeholder="Enter email"
                keyboardType="email-address"
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={emailError}
                success={inputEmail.length > 0 && !emailError}
              />
              <Input
                label="Address"
                value={inputAddress}
                onChangeText={handleAddressChange}
                placeholder="Enter tenant's address"
                keyboardType="default"
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={addressError}
                success={inputAddress.length > 0 && !addressError}
              />
              <Input
                label="VAT number"
                value={inputVatNumber}
                onChangeText={handleVatNumberChange}
                placeholder="Enter VAT number (optional)"
                keyboardType="number-pad"
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={vatNumberError}
                success={inputVatNumber.length > 0 && !vatNumberError}
              />
              <Input
                label="Additional information"
                value={inputAdditional}
                onChangeText={setInputAdditional}
                placeholder="Enter Additional information (optional)"
                keyboardType="default"
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
              />
            </ScrollView>
            <View style={styles.btnSave}>
              <Button
                title={isLoading ? 'Loading...' : 'Next'}
                onPress={handleAddTenant}
                backgroundColor={COLORS.primary}
                titleColor="#331800"
                borderColor={theme === 'dark' ? COLORS.primary : COLORS.white}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
// backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    avoidView: {flex: 1},
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
    label: {
      marginLeft: 5,
      marginBottom: 5,
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 20,
    },
    inputscontainer: {
      flex: 1,
      top: 30,
      width: '100%',
    },
    textStarted: {
      marginBottom: 20,
      marginTop: 5,
      left: 10,
      color: '#7E7D86',
    },
    btnSave: {
      marginBottom: 40,
      paddingBottom: 10,
    },
  });

export default AddTenant;
