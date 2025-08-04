import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {RootState} from '../app/redux/store';
import {COLORS} from '../lib/constants';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../lib/helpers/fontScaling';

type DatePickerProps = {
  value: Date;
  onDateChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  labelStyle?: object;
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

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  label,
  placeholder = 'Select date',
  error = false,
  labelStyle = {},
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const getBorderColor = (): string => {
    if (error) return '#EE6749';
    return theme === 'dark'
      ? COLORS.CardBackground
      : COLORS.BackgroundLightGray;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      onDateChange(selectedDate);
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, labelStyle, error && styles.errorLabel]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.container, {borderColor: getBorderColor()}]}
        onPress={openPicker}>
        <Text style={styles.dateText}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: safeGetResponsiveSpacing(16),
    paddingHorizontal: safeGetResponsiveSpacing(16),
    height: safeGetResponsiveSpacing(60),
    borderRadius: 14,
    backgroundColor: COLORS.BackgroundLightGray,
    borderColor: COLORS.BackgroundLightGray,
    justifyContent: 'center',
  },
  dateText: {
    color: COLORS.black,
    fontSize: safeGetResponsiveFontSize(10),
    fontWeight: '600',
    textAlign: 'center',
  },
  wrapper: {
    marginVertical: safeGetResponsiveSpacing(4),
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
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: safeGetResponsiveSpacing(16),
    paddingHorizontal: safeGetResponsiveSpacing(16),
    height: safeGetResponsiveSpacing(60),
    borderRadius: 14,
    backgroundColor: COLORS.CardBackground,
    borderColor: COLORS.CardBackground,
    justifyContent: 'center',
  },
  dateText: {
    color: '#F4F3F2',
    fontSize: safeGetResponsiveFontSize(10),
    fontWeight: '600',
    textAlign: 'center',
  },
  wrapper: {
    marginVertical: safeGetResponsiveSpacing(4),
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

export default DatePicker;
