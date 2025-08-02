import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardTypeOptions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../app/redux/store';
import {COLORS} from '../lib/constants';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../lib/helpers/fontScaling';
import DownIcon from '../assets/icons/DownIcon.svg';

type Currency = 'MYR' | 'USD' | 'SAR';

type MoneyInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  success?: boolean;
  labelStyle?: object;
  onValidate?: (value: string) => boolean;
};

const CURRENCIES: Currency[] = ['MYR', 'USD', 'SAR'];

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

export const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChangeText,
  currency,
  onCurrencyChange,
  placeholder = '0',
  label,
  error = false,
  success = false,
  labelStyle = {},
  onValidate,
}) => {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const getBorderColor = (): string => {
    if (error) return COLORS.ErrorBorder;
    if (success) return COLORS.SuccessBorder;
    return theme === 'dark'
      ? COLORS.CardBackground
      : COLORS.BackgroundLightGray;
  };

  const handleCurrencySelect = (selectedCurrency: Currency) => {
    onCurrencyChange(selectedCurrency);
    setShowCurrencyModal(false);
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

        {/* Currency dropdown */}
        <TouchableOpacity
          style={styles.currencyButton}
          onPress={() => setShowCurrencyModal(true)}>
          <Text style={styles.currencyText}>{currency}</Text>
          <DownIcon width={16} height={16} />
        </TouchableOpacity>
      </View>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCurrencyModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCurrencyModal(false)}>
          <View style={styles.modalContent}>
            {CURRENCIES.map((curr, index) => (
              <View key={curr}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleCurrencySelect(curr)}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      curr === currency && styles.selectedOptionText,
                    ]}>
                    {curr}
                  </Text>
                </TouchableOpacity>
                {index < CURRENCIES.length - 1 && (
                  <View style={styles.modalSeparator} />
                )}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: safeGetResponsiveSpacing(16),
    paddingVertical: safeGetResponsiveSpacing(12),
    minWidth: 80,
    justifyContent: 'center',
  },
  currencyText: {
    color: COLORS.black,
    fontSize: safeGetResponsiveFontSize(16),
    fontWeight: '500',
    marginRight: safeGetResponsiveSpacing(8),
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 0,
    minWidth: 120,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalOptionText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 0,
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
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: safeGetResponsiveSpacing(16),
    paddingVertical: safeGetResponsiveSpacing(12),
    minWidth: 80,
    justifyContent: 'center',
  },
  currencyText: {
    color: '#F4F3F2',
    fontSize: safeGetResponsiveFontSize(16),
    fontWeight: '500',
    marginRight: safeGetResponsiveSpacing(8),
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 12,
    padding: 0,
    minWidth: 120,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalOptionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 0,
  },
});

export default MoneyInput;
