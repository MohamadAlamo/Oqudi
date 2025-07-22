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
import UnitDetails from '../screens/units/UnitDetails';
const Stack = createStackNavigator();

function UnitsNavigator() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const headerBackgroundColor =
    theme === 'dark' ? COLORS.headerDarkBackground : COLORS.white;

  const headerTitleColor = theme === 'dark' ? COLORS.white : COLORS.black;

  return (
    <SafeAreaView style={styles.container}>
      {/* <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
        }}
        initialRouteName={ROUTES.UNIT_DETAILS}>
        <Stack.Screen
          name={ROUTES.UNIT_DETAILS}
          component={UnitDetails}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Unit details"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
      </Stack.Navigator> */}
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

export default UnitsNavigator;
