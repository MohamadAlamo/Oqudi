import React, {useMemo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Properties} from '../screens';
import {COLORS, ROUTES} from '../lib/constants';
import CustomHeader from '../components/CustomHeader';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import AddProperty from '../screens/properties/AddProperty';
import {ThemeState} from '../app/redux/themeSlice';
import PropertyDetails from '../screens/properties/PropertyDetails';
const Stack = createStackNavigator();

function PropertyNavigator() {
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
        initialRouteName={ROUTES.PROPERTIES}>
        <Stack.Screen
          name={ROUTES.PROPERTIES}
          component={Properties}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title="Properties"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ROUTES.ADD_PROPERTY}
          component={AddProperty}
          options={{
            headerShown: true,
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

export default PropertyNavigator;
