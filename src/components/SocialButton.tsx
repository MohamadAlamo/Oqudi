// GoogleButton.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import GoogleIcon from '../assets/icons/Google.svg';
import AppleIconLight from '../assets/icons/AppleIconLight.svg';
import AppleIconDark from '../assets/icons/AppleIconDark.svg';

import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import {COLORS} from '../lib/constants';

type SocialButtonProps = {
  onPress: () => void;
};

export const SocialButton: React.FC<SocialButtonProps> = ({onPress}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <GoogleIcon style={styles.logo} />
        <Text style={styles.btnText}>Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        {theme === 'dark' ? (
          <AppleIconDark style={styles.logo} />
        ) : (
          <AppleIconLight style={styles.logo} />
        )}
        <Text style={styles.btnText}>Apple</Text>
      </TouchableOpacity>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 14,
    marginVertical: 8,
    width: 175,
    height: 52,
    backgroundColor: 'white',
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: COLORS.black,
  },
  logo: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
  btnText: {
    color: '#24232A',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.08,
  },
});
const darkStyles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 14,
    marginVertical: 8,
    width: 175,
    height: 52,
    backgroundColor: '#24232A',
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: '#7E7D86',
  },
  logo: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
  btnText: {
    color: '#7E7D86',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.08,
  },
});
