import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import Hide from '../assets/icons/Hide.svg';
import Show from '../assets/icons/Show.svg';
import Check from '../assets/icons/Check.svg';
import Error from '../assets/icons/Error.svg';
import {SvgProps} from 'react-native-svg';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import {COLORS} from '../lib/constants';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
  getResponsiveDimensions,
} from '../lib/helpers/fontScaling';

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: boolean;
  success?: boolean;
  icon?: React.ReactElement<SvgProps>;
  isPassword?: boolean;
  label?: string;
  placeholderTextColor?: string;
  borderColor?: string;
  labelStyle?: object;
  onValidate?: (value: string) => boolean;
  numberOfLines?: number;
  maxLength?: number;
  multiline?: boolean;
};

// Safe helper functions with fallbacks
const safeGetResponsiveFontSize = (size: number): number => {
  try {
    const result = getResponsiveFontSize(size);
    return typeof result === 'number' && !isNaN(result) ? result : size;
  } catch (error) {
    console.warn('Error in getResponsiveFontSize:', error);
    return size;
  }
};

const safeGetResponsiveSpacing = (spacing: number): number => {
  try {
    const result = getResponsiveSpacing(spacing);
    return typeof result === 'number' && !isNaN(result) ? result : spacing;
  } catch (error) {
    console.warn('Error in getResponsiveSpacing:', error);
    return spacing;
  }
};

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  error = false,
  success = false,
  icon,
  isPassword = false,
  label,
  placeholderTextColor = '#000',
  borderColor = COLORS.Success,
  labelStyle = {},
  onValidate,
  numberOfLines = 1,
  maxLength = 100,
  multiline = false,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const isInputError = onValidate ? !onValidate(value) : error;
  const isInputSuccess = onValidate ? onValidate(value) : success;

  const getBorderColor = (): string => {
    if (isInputError) return COLORS.Error;
    if (isInputSuccess) return COLORS.Success;
    return theme === 'dark'
      ? COLORS.CardBackground
      : COLORS.BackgroundLightGray;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text
          style={[styles.label, labelStyle, isInputError && styles.errorLabel]}>
          {label}
        </Text>
      )}
      <View style={[styles.container, {borderColor: getBorderColor()}]}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isPassword && !passwordVisible}
          keyboardType={keyboardType}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          multiline={multiline}
        />
        {icon && <View style={styles.icon}>{icon}</View>}
        {!isPassword && isInputSuccess && (
          <View style={styles.icon}>
            <Check width={30} height={30} />
          </View>
        )}
        {!isPassword && isInputError && (
          <View style={styles.icon}>
            <Error width={30} height={30} />
          </View>
        )}
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.icon}>
            {passwordVisible ? (
              <Show width={24} height={24} />
            ) : (
              <Hide width={24} height={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: safeGetResponsiveSpacing(12),
    paddingHorizontal: safeGetResponsiveSpacing(16),
    height: safeGetResponsiveSpacing(60),
    borderRadius: 14,
    backgroundColor: COLORS.BackgroundLightGray,
    borderColor: COLORS.BackgroundLightGray,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.black,
    fontSize: safeGetResponsiveFontSize(16),
  },
  icon: {padding: safeGetResponsiveSpacing(5)},
  wrapper: {
    marginHorizontal: safeGetResponsiveSpacing(0),
    marginVertical: safeGetResponsiveSpacing(8),
  },
  label: {
    marginLeft: safeGetResponsiveSpacing(5),
    marginBottom: safeGetResponsiveSpacing(5),
    color: '#24232A',
    fontFamily: 'Inter',
    fontSize: safeGetResponsiveFontSize(14),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: safeGetResponsiveFontSize(20),
  },
  errorLabel: {
    color: COLORS.Delete,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: safeGetResponsiveSpacing(12),
    paddingHorizontal: safeGetResponsiveSpacing(16),
    height: safeGetResponsiveSpacing(60),
    borderRadius: 14,
    backgroundColor: COLORS.CardBackground,
    borderColor: COLORS.CardBackground,
  },
  input: {
    flex: 1,
    height: safeGetResponsiveSpacing(60),
    color: '#F4F3F2',
    fontSize: safeGetResponsiveFontSize(16),
  },
  icon: {padding: safeGetResponsiveSpacing(5)},
  wrapper: {
    marginHorizontal: safeGetResponsiveSpacing(0),
    marginVertical: safeGetResponsiveSpacing(8),
  },
  label: {
    marginLeft: safeGetResponsiveSpacing(5),
    marginBottom: safeGetResponsiveSpacing(5),
    color: '#ADACB1',
    fontFamily: 'Inter',
    fontSize: safeGetResponsiveFontSize(14),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: safeGetResponsiveFontSize(20),
  },
  errorLabel: {
    color: '#EE6749',
  },
});

export default Input;
