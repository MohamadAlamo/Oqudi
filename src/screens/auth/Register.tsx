import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import {useCreateUserMutation} from '../../app/services/api/auth/';
import {asyncHandler} from 'async-handler-ts';

interface RegisterProps {
  navigation: StackNavigationProp<any, any>;
}
const Register: React.FC<RegisterProps> = ({navigation}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const [inputFirstName, setInputFirstName] = useState<string>('');
  const [inputLastName, setInputLastName] = useState<string>('');
  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputAccountType = 'organization'; //organization , individual

  const passwordVisible = false;
  const [regUser] = useCreateUserMutation();

  // Validation functions
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8; // Changed to 8 characters as mentioned in placeholder
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

  const handleEmailChange = (text: string) => {
    setInputEmail(text);
    if (text.length > 0) {
      setEmailError(!validateEmail(text));
    } else {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (text: string) => {
    setInputPassword(text);
    if (text.length > 0) {
      setPasswordError(!validatePassword(text));
    } else {
      setPasswordError(false);
    }
  };

  const handleReg = async () => {
    // Clear previous API error
    setApiError('');

    // Validate inputs before API call
    const isFirstNameValid = validateName(inputFirstName);
    const isLastNameValid = validateName(inputLastName);
    const isEmailValid = validateEmail(inputEmail);
    const isPasswordValid = validatePassword(inputPassword);

    // Set validation errors
    setFirstNameError(!isFirstNameValid && inputFirstName.length > 0);
    setLastNameError(!isLastNameValid && inputLastName.length > 0);
    setEmailError(!isEmailValid && inputEmail.length > 0);
    setPasswordError(!isPasswordValid && inputPassword.length > 0);

    // Check if inputs are empty
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

    if (!inputEmail.trim()) {
      setEmailError(true);
      Alert.alert('Error', 'Email is required');
      return;
    }

    if (!inputPassword.trim()) {
      setPasswordError(true);
      Alert.alert('Error', 'Password is required');
      return;
    }

    // Check validation
    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
      !isPasswordValid
    ) {
      Alert.alert('Validation Error', 'Please fix the errors above');
      return;
    }

    setIsLoading(true);

    console.log(
      inputFirstName,
      inputLastName,
      inputEmail,
      inputPassword,
      inputAccountType,
    );

    const [result, error] = await asyncHandler(
      regUser({
        firstName: inputFirstName,
        lastName: inputLastName,
        email: inputEmail,
        password: inputPassword,
        accountType: inputAccountType,
      }).unwrap(),
    );

    setIsLoading(false);

    if (error) {
      console.log({error});
      let errorMessage = 'Registration failed. Please try again';

      // Handle different types of API errors
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 409) {
          errorMessage = 'Email already exists. Please use a different email';
        } else if (apiError.status === 400) {
          errorMessage = 'Please check your information';
        } else if (apiError.status === 500) {
          errorMessage = 'Server error. Please try again later';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Registration Failed', errorMessage);
      return;
    }

    console.log({result});
    // Navigate to Login screen
    navigation.navigate(ROUTES.LOGIN);
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
              We'll use this to create an account you don't have one yet.
            </Text>
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
              label="Password"
              value={inputPassword}
              onChangeText={handlePasswordChange}
              placeholder="Make up a password (>8 characters)"
              secureTextEntry={!passwordVisible}
              isPassword
              labelStyle={styles.label}
              placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
              error={passwordError}
              success={inputPassword.length > 0 && !passwordError}
            />

            <View style={styles.containerOr}>
              <View style={styles.line} />
              <Text style={styles.textOr}>Or sign in with</Text>
              <View style={styles.line} />
            </View>
            <SocialButton onPress={() => console.log('Button Pressed')} />
            <Button
              title={isLoading ? 'Loading...' : 'Next'}
              onPress={handleReg}
              backgroundColor={COLORS.primary}
              titleColor="#331800"
              borderColor={theme === 'dark' ? COLORS.primary : COLORS.white}
              disabled={isLoading}
            />
          </View>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.textDont}>
              By registering you accept Sukuk’s{'\n'}
              <TouchableOpacity onPress={() => console.log('Button Pressed')}>
                <Text style={styles.textSign}> Terms & Conditions</Text>
              </TouchableOpacity>
            </Text>
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
    },
    textStarted: {
      marginBottom: 20,
      marginTop: 5,
      left: 10,
      color: '#7E7D86',
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    textForget: {
      left: 15,
      color: theme === 'light' ? '#333' : COLORS.primary,
      fontWeight: '400',
      fontSize: 12,
    },
    errorText: {
      color: COLORS.Delete,
      textAlign: 'center',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      marginTop: 10,
      marginBottom: 10,
    },
    textOr: {
      color: theme === 'light' ? '#7E7D86' : '#F4F3F2',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      marginLeft: 10,
      marginRight: 10,
    },
    bottomTextContainer: {
      justifyContent: 'flex-end',
      marginBottom: Platform.OS === 'ios' ? 0 : 50,
    },
    textDont: {
      color: '#7E7D86',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
    },
    textSign: {
      color: COLORS.primary,
      alignSelf: 'center',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      marginTop: Platform.OS === 'ios' ? 5 : 0,
      marginLeft: 20,
    },
    line: {
      width: 40,
      backgroundColor: theme === 'light' ? '#7E7D86' : '#F4F3F2',
      height: 1,
    },
    containerOr: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 10,
    },
    signInContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 16,
    },
  });

export default Register;
