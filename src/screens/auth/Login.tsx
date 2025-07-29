import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {COLORS, ROUTES} from '../../lib/constants';
import Input from '../../components/input';
import Button from '../../components/Button';
import {StackNavigationProp} from '@react-navigation/stack';
import {SocialButton} from '../../components/SocialButton';
import {RootState, useAppSelector} from '../../app/redux/store';
import {useLoginUserMutation} from '../../app/services/api/auth';
import {asyncHandler} from 'async-handler-ts';
import {useSelector} from 'react-redux';
import {ThemeState} from '../../app/redux/themeSlice';
import {CommonActions} from '@react-navigation/native';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../../lib/helpers/fontScaling';

interface LoginProps {
  navigation: StackNavigationProp<any, any>;
}
const Login: React.FC<LoginProps> = ({navigation}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const [inputEmail, setInputEmail] = useState<string>(
    'Mohammedalamo@gmail.com',
  );
  const [inputPassword, setInputPassword] = useState<string>('P@ssw0rd');

  // const [inputEmail, setInputEmail] = useState<string>('');
  // const [inputPassword, setInputPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const passwordVisible = false;
  const [loginUser] = useLoginUserMutation();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
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

  const handleLogin = async () => {
    // Clear previous API error
    setApiError('');

    // Validate inputs before API call
    const isEmailValid = validateEmail(inputEmail);
    const isPasswordValid = validatePassword(inputPassword);

    // Set validation errors
    setEmailError(!isEmailValid && inputEmail.length > 0);
    setPasswordError(!isPasswordValid && inputPassword.length > 0);

    // Check if inputs are empty
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
    if (!isEmailValid || !isPasswordValid) {
      Alert.alert('Validation Error', 'Please fix the errors above');
      return;
    }

    setIsLoading(true);

    const [result, error] = await asyncHandler(
      loginUser({
        email: inputEmail,
        password: inputPassword,
      }).unwrap(),
    );

    setIsLoading(false);

    if (error) {
      console.log({error});
      let errorMessage = 'Login failed. Please try again';

      // Handle different types of API errors
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (apiError.status === 400) {
          errorMessage = 'Please check your credentials';
        } else if (apiError.status === 500) {
          errorMessage = 'Server error. Please try again later';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Login Failed', errorMessage);
      return;
    }

    console.log({result});
    // Navigate to MainApp which contains the MainNavigator with BottomTabs
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainApp',
          },
        ],
      }),
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <View style={styles.inputscontainer}>
            <Text style={styles.textStarted} allowFontScaling={false}>
              To get started, please, enter your email and password
            </Text>
            <Input
              label="Email"
              value={inputEmail}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              secureTextEntry={!passwordVisible}
              isPassword
              labelStyle={styles.label}
              placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
              error={passwordError}
              success={inputPassword.length > 0 && !passwordError}
            />

            <Text style={styles.textForget}>Forgot your password?</Text>
            <Button
              title={isLoading ? 'Loading...' : 'Next'}
              onPress={handleLogin}
              backgroundColor={COLORS.primary}
              titleColor="#331800"
              borderColor={theme === 'dark' ? COLORS.primary : COLORS.white}
              disabled={isLoading}
            />
            <View style={styles.containerOr}>
              <View style={styles.line} />
              <Text style={styles.textOr}>Or sign in with</Text>
              <View style={styles.line} />
            </View>
            {/* <SocialButton onPress={() => console.log('Button Pressed')} /> */}
          </View>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.textDont}>
              Don’t have an account?
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                <Text style={styles.textSign}> Sign up</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    avoidView: {flex: 1},
    parentContainer: {
      flex: 1,
      backgroundColor: COLORS.CardBackground,
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
      marginLeft: getResponsiveSpacing(5),
      marginBottom: getResponsiveSpacing(5),
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontFamily: 'Inter',
      fontSize: getResponsiveFontSize(14),
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: getResponsiveFontSize(20),
    },
    inputscontainer: {
      flex: 1,
      top: getResponsiveSpacing(30),
    },
    textStarted: {
      marginBottom: getResponsiveSpacing(20),
      marginTop: getResponsiveSpacing(5),
      color: '#7E7D86',
      fontSize: getResponsiveFontSize(14),
    },
    text: {
      fontSize: getResponsiveFontSize(20),
      textAlign: 'center',
      margin: getResponsiveSpacing(10),
    },
    textForget: {
      left: getResponsiveSpacing(15),
      color: theme === 'light' ? '#333' : COLORS.primary,
      fontWeight: '400',
      fontSize: getResponsiveFontSize(12),
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
      textAlign: 'center',
      fontFamily: 'Inter',
      fontSize: getResponsiveFontSize(14),
      fontStyle: 'normal',
      fontWeight: '400',
      marginLeft: getResponsiveSpacing(10),
      marginRight: getResponsiveSpacing(10),
    },
    bottomTextContainer: {
      justifyContent: 'flex-end',
      marginBottom: getResponsiveSpacing(40),
    },
    textDont: {
      color: '#7E7D86',
      textAlign: 'center',
      fontFamily: 'Inter',
      fontSize: getResponsiveFontSize(14),
      fontStyle: 'normal',
      fontWeight: '400',
    },
    textSign: {
      color: COLORS.primary,
      textAlign: 'center',
      fontFamily: 'Inter',
      fontSize: getResponsiveFontSize(14),
      fontStyle: 'normal',
      fontWeight: '400',
      marginBottom: getResponsiveSpacing(-3),
    },
    line: {
      width: getResponsiveSpacing(40),
      backgroundColor: theme === 'light' ? '#7E7D86' : '#F4F3F2',
      height: 1,
    },
    containerOr: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: getResponsiveSpacing(30),
    },
    signInContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 16,
    },
  });

// const darkStyles = StyleSheet.create({
//   avoidView: {flex: 1},
//   parentContainer: {
//     flex: 1,
//     backgroundColor: COLORS.black,
//     overflow: 'hidden',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderTopRightRadius: 12,
//     borderTopLeftRadius: 12,
//     backgroundColor: COLORS.backgroundDark,
//   },
//   label: {
//     marginLeft: 5,
//     marginBottom: 5,
//     color: '#ADACB1',
//     fontFamily: 'Inter',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '400',
//     lineHeight: 20,
//   },
//   inputscontainer: {
//     flex: 1,
//     top: 30,
//   },
//   textStarted: {
//     marginBottom: 20,
//     marginTop: 5,
//     left: 10,
//     color: '#7E7D86',
//   },
//   text: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   textForget: {
//     left: 15,
//     color: COLORS.primary,
//     fontWeight: '400',
//     fontSize: 12,
//   },
//   textOr: {
//     color: '#F4F3F2',
//     textAlign: 'center',
//     fontFamily: 'Inter',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '400',
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   bottomTextContainer: {
//     justifyContent: 'flex-end',
//     marginBottom: 40,
//   },
//   textDont: {
//     color: '#7E7D86',
//     textAlign: 'center',
//     fontFamily: 'Inter',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '400',
//   },
//   textSign: {
//     color: COLORS.primary,
//     textAlign: 'center',
//     fontFamily: 'Inter',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '400',
//     marginBottom: -3,
//   },
//   line: {
//     width: 40,
//     backgroundColor: '#F4F3F2',
//     height: 1,
//   },
//   containerOr: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginTop: 30,
//   },
//   signInContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginTop: 16,
//   },
// });

export default Login;
