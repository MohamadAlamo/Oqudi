import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Settings, Profile, MyContract, MySubscription} from '../screens';
import {COLORS, ROUTES} from '../lib/constants';
import CustomHeader from '../components/CustomHeader';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
const Stack = createStackNavigator();

function SettingsNavigator() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const headerBackgroundColor =
    theme === 'dark' ? COLORS.headerDarkBackground : COLORS.white;

  const headerTitleColor = theme === 'dark' ? COLORS.white : COLORS.black;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
        initialRouteName={ROUTES.SETTINGS}>
        <Stack.Screen
          name={ROUTES.SETTINGS}
          component={Settings}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Settings"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ROUTES.PROFILE}
          component={Profile}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Profile"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ROUTES.MYCONTRACT}
          component={MyContract}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="My Contract"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ROUTES.MY_SUBSCRIPTION}
          component={MySubscription}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="My Subscription"
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

export default SettingsNavigator;
