import React, {useMemo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {AddTenant, Properties, Tenants} from '../screens';
import {COLORS, ROUTES} from '../lib/constants';
import CustomHeader from '../components/CustomHeader';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import AddProperty from '../screens/properties/AddProperty';
import {ThemeState} from '../app/redux/themeSlice';
const Stack = createStackNavigator();

function TenantsNavigator() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const headerBackgroundColor =
    theme === 'dark' ? COLORS.headerDarkBackground : COLORS.white;

  const headerTitleColor = theme === 'dark' ? COLORS.white : COLORS.black;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
        }}
        initialRouteName={ROUTES.TENANTS}>
        <Stack.Screen
          name={ROUTES.TENANTS}
          component={Tenants}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Tenants"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
        {/* <Stack.Screen
          name={ROUTES.ADDTENANT}
          component={AddTenant}
          options={{
            headerShown: false,
            header: () => (
              <CustomHeader
                title="Add Tenant"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        /> */}
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

export default TenantsNavigator;
