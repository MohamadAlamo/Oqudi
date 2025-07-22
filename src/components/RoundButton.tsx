import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '../assets/icons/RoundButton.svg';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
interface AddPropertyButtonProps {
  onPress: () => void;
  Title: string;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({
  onPress,
  Title,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  return (
    <View style={styles.button}>
      <Text style={styles.text}>{Title}</Text>
      <TouchableOpacity style={styles.iconCircle} onPress={onPress}>
        <Icon />
      </TouchableOpacity>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFA500',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#24232A',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.08,
    marginRight: 10,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

const darkStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFA500',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#FFA500',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.08,
    marginRight: 10,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default AddPropertyButton;
