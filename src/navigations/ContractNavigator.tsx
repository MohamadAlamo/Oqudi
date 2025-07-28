import React, {useMemo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS, ROUTES} from '../lib/constants';
import CustomHeader from '../components/CustomHeader';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import {ThemeState} from '../app/redux/themeSlice';
import AddContract from '../screens/contract/AddContract';
import NewSchedual from '../screens/contract/NewSchedual';

const Stack = createStackNavigator();

function ContractNavigator() {
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
        }}
        initialRouteName={ROUTES.ADDCONTRACT}>
        <Stack.Screen
          name={ROUTES.ADDCONTRACT}
          component={AddContract}
          options={{
            headerShown: true,
            gestureEnabled: false, // Disable swipe back to prevent data loss
            gestureResponseDistance: 0, // Disable gesture response completely
            gestureDirection: 'horizontal',
            header: () => (
              <CustomHeader
                title="Add Contract"
                backgroundColor={headerBackgroundColor}
                titleColor={headerTitleColor}
              />
            ),
          }}
        />

        <Stack.Screen
          name={ROUTES.NEWSCHEDUAL}
          component={NewSchedual}
          options={{
            headerShown: true,
            gestureEnabled: true, // Enable swipe back for schedule screen
            header: () => (
              <CustomHeader
                title="New Schedule"
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

export default ContractNavigator;
