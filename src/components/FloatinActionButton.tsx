import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import {COLORS} from '../lib/constants';
type ButtonProps = {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
};

export const FloatinActionButton: React.FC<ButtonProps> = ({onPress, text}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button]}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const lightStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFA726',
    borderRadius: 18,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 44,
    color: COLORS.black,
    bottom: 3,
    left: 1,
  },
});
const darkStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFA726',
    borderRadius: 18,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 44,
    color: COLORS.black,
  },
});

export default FloatinActionButton;
