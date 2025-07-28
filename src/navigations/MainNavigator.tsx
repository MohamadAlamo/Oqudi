import React, {useMemo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS, ROUTES} from '../lib/constants';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import {ThemeState} from '../app/redux/themeSlice';
import CustomHeader from '../components/CustomHeader';
import BottomTabNavigator from './BottomTabNavigator';
import ContractNavigator from './ContractNavigator';
import UnitsNavigator from './UnitsNavigator';
import AddTenant from '../screens/tenants/AddTenant';
import AddProperty from '../screens/properties/AddProperty';
import PropertyDetails from '../screens/properties/PropertyDetails';

const Stack = createStackNavigator();

function MainNavigator() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const headerBackgroundColor =
    theme === 'dark' ? COLORS.headerDarkBackground : COLORS.white;
  const headerTitleColor = theme === 'dark' ? COLORS.white : COLORS.black;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          headerShown: false,
        }}
        initialRouteName="BottomTabs">
        {/* Main app with bottom tabs */}
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Contract flow - no bottom tabs */}
        <Stack.Screen
          name="ContractFlow"
          component={ContractNavigator}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        {/* Units flow - no bottom tabs */}
        <Stack.Screen
          name="UnitsFlow"
          component={UnitsNavigator}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        {/* Tenant screens - no bottom tabs */}
        <Stack.Screen
          name={ROUTES.ADDTENANT}
          component={AddTenant}
          options={{
            headerShown: true,
            gestureEnabled: false, // Disable swipe back to prevent data loss
            gestureResponseDistance: 0, // Disable gesture response completely
            gestureDirection: 'horizontal',
            header: () => (
              <CustomHeader
                title="Add Tenant"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />

        {/* Property screens - no bottom tabs */}
        <Stack.Screen
          name={ROUTES.ADD_PROPERTY}
          component={AddProperty}
          options={{
            headerShown: true,
            gestureEnabled: false, // Disable swipe back to prevent data loss
            gestureResponseDistance: 0, // Disable gesture response completely
            gestureDirection: 'horizontal',
            header: () => (
              <CustomHeader
                title="Add Property"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />

        <Stack.Screen
          name={ROUTES.PROPERTY_DETAILS}
          component={PropertyDetails}
          options={{
            headerShown: true,
            gestureEnabled: true, // Enable swipe back
            header: () => (
              <CustomHeader
                title="Property Details"
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

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.white,
    },
  });

export default MainNavigator;
