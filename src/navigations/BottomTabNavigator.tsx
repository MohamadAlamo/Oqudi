import React from 'react';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';
import {RouteProp, NavigationProp} from '@react-navigation/native';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Properties, Tenants, Payments} from '../screens';
import {COLORS, ROUTES} from '../lib/constants';
import CustomHeader from '../components/CustomHeader';
import PropertyIconLight from '../assets/icons/PropertyIconLight.svg';
import PropertyIconFocused from '../assets/icons/PropertyIconFocused.svg';
import PropertyIconDark from '../assets/icons/PropertyIconDark.svg';
import TenantsIconLight from '../assets/icons/TenantsIconLight.svg';
import TenantsIconFocused from '../assets/icons/TenantsIconFocused.svg';
import TenantsIconDark from '../assets/icons/TenantsIconDark.svg';
import PaymentsIconLight from '../assets/icons/PaymentsIconLight.svg';
import PaymentsIconFocused from '../assets/icons/PaymentsIconFocused.svg';
import PaymentsIconDark from '../assets/icons/PaymentsIconDark.svg';
import SettingsIconLight from '../assets/icons/SettingsIconLight.svg';
import SettingsIconFocused from '../assets/icons/SettingsIconFocused.svg';
import SettingsIconDark from '../assets/icons/SettingsIconDark.svg';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import SettingsNavigator from './SettingsNavigator';
import PropertyNavigator from './PropertyNavigator';
import TenantsNavigator from './TenantsNavigator';
import PaymentsNavigator from './PaymentsNavigator';
import UnitsNavigator from './UnitsNavigator';

const Tab = createBottomTabNavigator();

type BottomTabParamList = {
  Properties: undefined;
  Tenants: undefined;
  Payments: undefined;
  Settings: undefined;
};

interface TabBarIconProps {
  focused: boolean;
  lightIcon: React.ElementType;
  darkIcon: React.ElementType;
  focusedIcon: React.ElementType;
  width?: number;
  height?: number;
  theme: 'light' | 'dark' | 'system';
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  focused,
  lightIcon,
  darkIcon,
  focusedIcon,
  width = 97.5,
  height = 50,
  theme,
}) => {
  let Icon;

  if (focused) {
    Icon = focusedIcon;
  } else {
    Icon = theme === 'dark' ? darkIcon : lightIcon;
  }

  return <Icon width={width} height={height} />;
};

const getHeaderBackgroundColor = (
  routeName: keyof BottomTabParamList,
  theme: 'light' | 'dark' | 'system',
) => {
  if (theme === 'dark') {
    return COLORS.BottomTabNavigatorDark;
  }
  switch (routeName) {
    case 'Properties':
      return COLORS.white;
    case 'Tenants':
      return COLORS.white;
    case 'Payments':
      return COLORS.white;
    case 'Settings':
      return COLORS.BackgroundLight;
    default:
      return COLORS.white;
  }
};
const getTitleColor = (theme: 'light' | 'dark' | 'system'): string => {
  return theme === 'dark' ? COLORS.white : COLORS.black;
};

function BottomTabNavigator() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const screenOptions = ({
    route,
  }: {
    route: RouteProp<BottomTabParamList, keyof BottomTabParamList>;
    navigation: NavigationProp<BottomTabParamList>;
  }): BottomTabNavigationOptions => {
    const backgroundColor = getHeaderBackgroundColor(route.name, theme);
    const titleColor = getTitleColor(theme);

    return {
      header: () => (
        <CustomHeader
          title={route.name}
          backgroundColor={backgroundColor}
          titleColor={titleColor}
        />
      ),
      tabBarStyle: styles.tabBarStyle,
      tabBarLabel: '',
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name={ROUTES.PROPERTIES}
          component={PropertyNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                focused={focused}
                lightIcon={PropertyIconLight}
                darkIcon={PropertyIconDark}
                focusedIcon={PropertyIconFocused}
                theme={theme}
              />
            ),
          }}
        />
        <Tab.Screen
          name={ROUTES.TENANTS}
          component={TenantsNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                focused={focused}
                lightIcon={TenantsIconLight}
                darkIcon={TenantsIconDark}
                focusedIcon={TenantsIconFocused}
                theme={theme}
              />
            ),
          }}
        />
        <Tab.Screen
          name={ROUTES.PAYMENTS}
          component={PaymentsNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                focused={focused}
                lightIcon={PaymentsIconLight}
                darkIcon={PaymentsIconDark}
                focusedIcon={PaymentsIconFocused}
                theme={theme}
              />
            ),
          }}
        />
        <Tab.Screen
          name={ROUTES.SETTINGS}
          component={SettingsNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                focused={focused}
                lightIcon={SettingsIconLight}
                darkIcon={SettingsIconDark}
                focusedIcon={SettingsIconFocused}
                theme={theme}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name={ROUTES.UNIT_DETAILS}
          component={UnitsNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <TabBarIcon
                focused={focused}
                lightIcon={SettingsIconLight}
                darkIcon={SettingsIconDark}
                focusedIcon={SettingsIconFocused}
                theme={theme}
              />
            ),
          }}
        /> */}
      </Tab.Navigator>
    </SafeAreaView>
  );
}
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  tabBarStyle: {
    backgroundColor: COLORS.white,
    height: Platform.OS === 'ios' ? 120 : 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.2,
    borderColor: COLORS.black,
    borderTopColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3, //
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -35 : 0,
    paddingTop: 25,
  },
});
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  tabBarStyle: {
    backgroundColor: COLORS.BottomTabNavigatorDark,
    height: Platform.OS === 'ios' ? 110 : 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.2,
    borderColor: COLORS.black,
    borderTopColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3, //
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -35 : 0,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
    paddingTop: 25,
  },
});

export default BottomTabNavigator;
