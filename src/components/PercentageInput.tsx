import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../app/redux/store';
import {COLORS} from '../lib/constants';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../lib/helpers/fontScaling';

type PercentageInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  success?: boolean;
  labelStyle?: object;
  onValidate?: (value: string) => boolean;
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

export const PercentageInput: React.FC<PercentageInputProps> = ({
  value,
  onChangeText,
  placeholder = '0',
  label,
  error = false,
  success = false,
  labelStyle = {},
  onValidate,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const getBorderColor = (): string => {
    if (error) return COLORS.ErrorBorder;
    if (success) return COLORS.SuccessBorder;
    return theme === 'dark'
      ? COLORS.CardBackground
      : COLORS.BackgroundLightGray;
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, labelStyle, error && styles.errorLabel]}>
          {label}
        </Text>
      )}
      <View style={[styles.container, {borderColor: getBorderColor()}]}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
          keyboardType="numeric"
        />

        {/* Divider line */}
        <View style={styles.divider} />

        {/* Percentage symbol */}
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>%</Text>
        </View>
      </View>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: safeGetResponsiveSpacing(8),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: safeGetResponsiveSpacing(50),
    borderRadius: 14,
    backgroundColor: COLORS.BackgroundLightGray,
    borderColor: COLORS.BackgroundLightGray,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.black,
    fontSize: safeGetResponsiveFontSize(16),
    paddingHorizontal: safeGetResponsiveSpacing(16),
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#D1D5DB',
    marginHorizontal: safeGetResponsiveSpacing(8),
  },
  percentageContainer: {
    paddingHorizontal: safeGetResponsiveSpacing(16),
    paddingVertical: safeGetResponsiveSpacing(12),
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: COLORS.black,
    fontSize: safeGetResponsiveFontSize(16),
    fontWeight: '500',
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
  wrapper: {
    width: '100%',
    marginVertical: safeGetResponsiveSpacing(8),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: safeGetResponsiveSpacing(50),
    borderRadius: 14,
    backgroundColor: COLORS.CardBackground,
    borderColor: COLORS.CardBackground,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#F4F3F2',
    fontSize: safeGetResponsiveFontSize(16),
    paddingHorizontal: safeGetResponsiveSpacing(16),
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#4B5563',
    marginHorizontal: safeGetResponsiveSpacing(8),
  },
  percentageContainer: {
    paddingHorizontal: safeGetResponsiveSpacing(16),
    paddingVertical: safeGetResponsiveSpacing(12),
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: '#F4F3F2',
    fontSize: safeGetResponsiveFontSize(16),
    fontWeight: '500',
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

export default PercentageInput;
