import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Welcome,
  Login,
  Register,
  AddTenant,
  Tenants,
  AddUnit,
  AddContract,
} from '../screens';
import {COLORS, ROUTES} from '../lib/constants';
import BottomTabNavigator from './BottomTabNavigator';
import CustomHeader from '../components/CustomHeader';
import {RootState, useAppDispatch} from '../app/redux/store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_ID} from '../app/config';
import {useLazyGetAuthQuery} from '../app/services/api/auth';
import {asyncHandler} from 'async-handler-ts';
import {setUser} from '../app/redux/userSlice';
import UnitDetails from '../screens/units/UnitDetails';
import UnitsNavigator from './UnitsNavigator';
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

  const initialRouteName = user._id ? ROUTES.PROPERTIES : ROUTES.WELCOME;
  console.log({user, initialRouteName});

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        key={user._id}
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
        initialRouteName={initialRouteName}>
        <Stack.Screen
          name={ROUTES.WELCOME}
          component={Welcome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.LOGIN}
          component={Login}
          options={{
            headerShown: true,
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
            header: () => (
              <CustomHeader
                title="Register"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ROUTES.PROPERTIES}
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.TENANTS}
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.ADDTENANT}
          component={AddTenant}
          // this Add Tenent I add it here because I don't want to have bottom navigator in the screen
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Add Tenant"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />

        <Stack.Screen
          name={ROUTES.ADD_UNIT}
          component={AddUnit}
          // this Add Tenent I add it here because I don't want to have bottom navigator in the screen
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Add Unit"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ROUTES.UNIT_DETAILS}
          component={UnitDetails}
          // this Add Tenent I add it here because I don't want to have bottom navigator in the screen
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Unit Details"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />

        <Stack.Screen
          name={ROUTES.ADDCONTRACT}
          component={AddContract}
          // this Add Tenent I add it here because I don't want to have bottom navigator in the screen
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Add Contract"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
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
