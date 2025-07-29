import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../lib/constants';
import {useSelector} from 'react-redux';
import {RootState} from '../app/redux/store';
import {ThemeState} from '../app/redux/themeSlice';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../lib/helpers/fontScaling';

type PaymentFrequency = 'Monthly' | 'Quarterly' | 'Semi-annually' | 'Annually';

type PaymentFrequencySelectorProps = {
  onSelectionChange: (selected: PaymentFrequency | '') => void;
  initialSelection?: PaymentFrequency | '';
  label?: string;
  error?: boolean;
  labelStyle?: object;
};

const PAYMENT_FREQUENCIES: PaymentFrequency[] = [
  'Monthly',
  'Quarterly',
  'Semi-annually',
  'Annually',
];

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

const PaymentFrequencySelector: React.FC<PaymentFrequencySelectorProps> = ({
  onSelectionChange,
  initialSelection = '',
  label,
  error = false,
  labelStyle = {},
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const [selected, setSelected] = useState<PaymentFrequency | ''>(
    initialSelection,
  );

  useEffect(() => {
    onSelectionChange(selected);
  }, [selected, onSelectionChange]);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, labelStyle, error && styles.errorLabel]}>
          {label}
        </Text>
      )}
      <View style={styles.frequencyContainer}>
        {PAYMENT_FREQUENCIES.map(frequency => (
          <TouchableOpacity
            key={frequency}
            style={[
              styles.frequencyButton,
              selected === frequency
                ? styles.activeFrequency
                : styles.inactiveFrequency,
            ]}
            onPress={() => setSelected(frequency)}>
            <Text
              style={[
                styles.frequencyText,
                selected === frequency
                  ? styles.activeFrequencyText
                  : styles.inactiveFrequencyText,
              ]}>
              {frequency}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginVertical: safeGetResponsiveSpacing(8),
    },
    label: {
      marginLeft: safeGetResponsiveSpacing(5),
      marginBottom: safeGetResponsiveSpacing(8),
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontFamily: 'Inter',
      fontSize: safeGetResponsiveFontSize(14),
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: safeGetResponsiveFontSize(20),
    },
    errorLabel: {
      color: theme === 'light' ? COLORS.Delete : '#EE6749',
    },
    frequencyContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: safeGetResponsiveSpacing(8),
    },
    frequencyButton: {
      width: '48%',
      paddingHorizontal: safeGetResponsiveSpacing(12),
      paddingVertical: safeGetResponsiveSpacing(15),
      marginBottom: safeGetResponsiveSpacing(8),
      borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeFrequency: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    inactiveFrequency: {
      backgroundColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
      borderColor: theme === 'light' ? '#E0E0E0' : '#4B5563',
    },
    frequencyText: {
      fontSize: safeGetResponsiveFontSize(14),
      fontWeight: '500',
      textAlign: 'center',
    },
    activeFrequencyText: {
      color: COLORS.black,
    },
    inactiveFrequencyText: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
    },
  });

export default PaymentFrequencySelector;
