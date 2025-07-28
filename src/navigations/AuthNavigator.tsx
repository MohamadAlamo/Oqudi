import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Welcome, Login, Register} from '../screens';
import {COLORS, ROUTES} from '../lib/constants';
import MainNavigator from './MainNavigator';
import CustomHeader from '../components/CustomHeader';
import {RootState, useAppDispatch} from '../app/redux/store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_ID} from '../app/config';
import {useLazyGetAuthQuery} from '../app/services/api/auth';
import {asyncHandler} from 'async-handler-ts';
import {setUser} from '../app/redux/userSlice';
const Stack = createStackNavigator();

function AuthNavigator() {
  const {theme, user} = useSelector((state: RootState) => ({
    theme: state.theme.theme,
    user: state.user,
  }));
  const dispatch = useAppDispatch();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const headerBackgroundColor =
    theme === 'dark' ? COLORS.headerDarkBackground : COLORS.white;

  const headerTitleColor = theme === 'dark' ? COLORS.white : COLORS.black;

  const [getAuth] = useLazyGetAuthQuery();
  async function AuthoriseUser() {
    const userId = await AsyncStorage.getItem(USER_ID);
    if (!userId) return;
    const [authUser, error] = await asyncHandler(getAuth(userId).unwrap());
    if (authUser) dispatch(setUser(authUser.data));
  }
  useEffect(() => {
    AuthoriseUser();
  }, []);

  const initialRouteName = user._id ? 'MainApp' : ROUTES.WELCOME;
  console.log({user, initialRouteName});

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        key={user._id}
        screenOptions={{
          gestureEnabled: true,
        }}
        initialRouteName={initialRouteName}>
        <Stack.Screen
          name={ROUTES.WELCOME}
          component={Welcome}
          options={{
            headerShown: false,
            gestureEnabled: false, // No swipe back from welcome
          }}
        />

        <Stack.Screen
          name={ROUTES.LOGIN}
          component={Login}
          options={{
            headerShown: true,
            gestureEnabled: true, // Enable swipe back from login
            header: () => (
              <CustomHeader
                title="Login"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />

        <Stack.Screen
          name={ROUTES.REGISTER}
          component={Register}
          options={{
            headerShown: true,
            gestureEnabled: true, // Enable swipe back from register
            header: () => (
              <CustomHeader
                title="Register"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />

        {/* Main app after authentication */}
        <Stack.Screen
          name="MainApp"
          component={MainNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false, // No swipe back from main app
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default AuthNavigator;
