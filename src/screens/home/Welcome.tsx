import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {COLORS, ROUTES} from '../../lib/constants';
import {RootState} from '../../app/redux/store';
import {useSelector} from 'react-redux';
interface WelcomeProps {
  navigation: StackNavigationProp<any, any>;
}

const Welcome: React.FC<WelcomeProps> = ({navigation}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  // const logoSource =
  //   theme === 'dark'
  //     ? require('../../assets/img/LogoLight.png')
  //     : require('../../assets/img/LogoDark.png');

  const [logo, setLogo] = useState(require('../../assets/img/LogoLight.png'));

  useEffect(() => {
    if (theme === 'dark') {
      setLogo(require('../../assets/img/LogoDark.png'));
    } else {
      setLogo(require('../../assets/img/LogoLight.png'));
    }
  }, [theme]);
  return (
    <View style={styles.container}>
      <Image resizeMode="contain" source={logo} style={styles.logo} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>
      <TouchableOpacity
        style={styles.signInContainer}
        onPress={() => navigation.navigate(ROUTES.REGISTER)}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginContainer}
        onPress={() => navigation.navigate(ROUTES.LOGIN)}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  timeContainer: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  timeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 21,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  image: {
    width: 18,
    height: 27,
    aspectRatio: 1.5,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 221,
    width: 160,
    height: 160,
    aspectRatio: 1,
  },
  welcomeContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  welcomeText: {
    color: '#24232A',
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  signInContainer: {
    alignSelf: 'center',
    marginTop: 24,
    width: '100%',
    maxWidth: 358,
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#24232A',
    borderRadius: 14,
  },
  signInText: {
    color: '#24232A',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
  },
  loginContainer: {
    alignSelf: 'center',
    marginTop: 8,
    width: '100%',
    maxWidth: 358,
    paddingVertical: 17,
    paddingHorizontal: 20,
    backgroundColor: '#EFA949',
    borderRadius: 14,
  },
  loginText: {
    color: '#331800',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundDark,
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  timeContainer: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  timeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 21,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  image: {
    width: 18,
    height: 27,
    aspectRatio: 1.5,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 221,
    width: 160,
    height: 160,
    aspectRatio: 1,
  },
  welcomeContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  welcomeText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  signInContainer: {
    alignSelf: 'center',
    marginTop: 24,
    width: '100%',
    maxWidth: 358,
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: COLORS.backgroundDark,
    borderColor: COLORS.primary,
    borderRadius: 14,
  },
  signInText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
  },
  loginContainer: {
    alignSelf: 'center',
    marginTop: 8,
    width: '100%',
    maxWidth: 358,
    paddingVertical: 17,
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  loginText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
  },
});
export default Welcome;
