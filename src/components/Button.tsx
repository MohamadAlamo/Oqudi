import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';

type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  titleColor?: string;
  borderColor?: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor,
  titleColor,
  borderColor,
  disabled = false,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);

  // Define button and text colors based on theme and disabled state
  const themeColors = theme === 'dark' ? darkColors : lightColors;
  const effectiveBackgroundColor = disabled
    ? themeColors.disabledBackground
    : backgroundColor || themeColors.background;
  const effectiveTitleColor = disabled
    ? themeColors.disabledText
    : titleColor || themeColors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          backgroundColor: effectiveBackgroundColor,
          borderColor: borderColor || themeColors.border,
          opacity: disabled ? 0.9 : 1,
        },
      ]}
      disabled={disabled}>
      <Text style={[styles.text, {color: effectiveTitleColor}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const lightColors = {
  background: '#007bff',
  text: '#ffffff',
  border: 'white',
  disabledBackground: '#cccccc',
  disabledText: '#383642',
};

const darkColors = {
  background: '#1e1e1e',
  text: '#ffffff',
  border: '#444444',
  disabledBackground: '#413F4E',
  disabledText: '#cccccc',
};

const styles = StyleSheet.create({
  button: {
    width: 385,
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.08,
  },
});

export default Button;
