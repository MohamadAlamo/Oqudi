import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Appearance,
} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {StackNavigationProp} from '@react-navigation/stack';
import SettingsItem from '../../components/SettingsItem';
import LogoutIconLight from '../../assets/icons/Log_Out_Light.svg';
import LogoutIconDark from '../../assets/icons/Log_Out_Dark.svg';
import {COLORS, ROUTES} from '../../lib/constants';
import profileIcon from '../../assets/icons/Profile.svg';
import myContracts from '../../assets/icons/Contract.svg';
import language from '../../assets/icons/Language.svg';
import addSales from '../../assets/icons/AddSales.svg';
import purchase from '../../assets/icons/Purchase.svg';
import privacyPolicy from '../../assets/icons/Privacy.svg';
import Terms from '../../assets/icons/Terms.svg';
import contact from '../../assets/icons/Contact.svg';
import notification from '../../assets/icons/Notification.svg';
import darkmode from '../../assets/icons/Dark.svg';
import {RootState} from '../../app/redux/store';
import {useSelector, useDispatch} from 'react-redux';
import {setTheme, syncWithSystemTheme} from '../../app/redux/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN_KEY, USER_ID} from '../../app/config';

const ITEM_TITLES = {
  PROFILE: 'Profile',
  CONTRACTS: 'My contracts',
  LANGUAGE: 'Language',
  ADD_SALES_BILLS: 'Add sales bills / retun invoice',
  PURCHASES_BILLS: 'Purchases bills',
  PRIVACY_POLICY: 'Privacy Policy',
  TERMS: 'Terms and conditions',
  CONTACT: 'Contact us',
  NOTIFICATIONS: 'Notification',
  DARK_MODE: 'Dark mode',
  LOG_OUT: 'Log Out',
};
interface SettingsProps {
  navigation: StackNavigationProp<any, any>;
}

const Settings: React.FC<SettingsProps> = ({navigation}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [accountType, setAccountType] = useState<string | null>(null);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAccountType = async () => {
      const storedAccountType = await AsyncStorage.getItem('accountType');
      setAccountType(storedAccountType);
    };

    fetchAccountType();
  }, []);
  const setDarkModeEnabled = useCallback(
    (isEnabled: boolean) => {
      dispatch(setTheme(isEnabled ? 'dark' : 'light'));
    },
    [dispatch],
  );

  useEffect(() => {
    setDarkModeEnabled(Appearance.getColorScheme() === 'dark');
    console.log('Helllllloooooo');
  }, [setDarkModeEnabled]);

  useEffect(() => {
    const handleAppearanceChange = (_: Appearance.AppearancePreferences) => {
      dispatch(syncWithSystemTheme());
    };

    const subscription = Appearance.addChangeListener(handleAppearanceChange);

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  const handleToggleDarkMode = () => {
    let newTheme: 'light' | 'dark' | 'system' =
      theme === 'dark' ? 'light' : 'dark';
    // Optionally handle 'system' preference here
    dispatch(setTheme(newTheme));
  };

  const darkModeEnabled =
    theme === 'dark' ||
    (theme === 'system' && Appearance.getColorScheme() === 'dark');
  const handlePress = (item: string) => {
    switch (item) {
      case ITEM_TITLES.PROFILE:
        navigation.navigate(ROUTES.PROFILE);
        break;
      case ITEM_TITLES.CONTRACTS:
        navigation.navigate(ROUTES.MYCONTRACT);
        break;
      // Add cases for other items as needed
      default:
        console.log(`Pressed ${item}`);
    }
  };

  const currentStyles = darkModeEnabled ? darkStyles : lightStyles;

  const renderItem = (
    title: string,
    icon: React.ComponentType<SvgProps>,
    isToggle: boolean = false,
    containerStyle: object = {},
  ) => (
    <SettingsItem
      title={title}
      icon={typeof icon === 'string' ? icon : undefined}
      imageIcon={typeof icon === 'string' ? undefined : icon}
      onPress={() => handlePress(title)}
      containerStyle={{
        ...currentStyles.itemContainer,
        ...containerStyle,
      }}
      titleStyle={currentStyles.itemTitle}
      isToggle={isToggle}
      toggleValue={
        title === ITEM_TITLES.NOTIFICATIONS
          ? notificationsEnabled
          : title === ITEM_TITLES.DARK_MODE
          ? darkModeEnabled
          : false
      }
      onToggleChange={
        title === ITEM_TITLES.NOTIFICATIONS
          ? toggleNotifications
          : title === ITEM_TITLES.DARK_MODE
          ? handleToggleDarkMode
          : undefined
      }
      isDarkMode={darkModeEnabled}
    />
  );
  const LogoutIcon = darkModeEnabled ? LogoutIconDark : LogoutIconLight;
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem('accountType');
      await AsyncStorage.removeItem(USER_ID);

      navigation.navigate(ROUTES.WELCOME);
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  };
  return (
    <ScrollView style={currentStyles.parentContainer}>
      <View style={currentStyles.container}>
        {renderItem(ITEM_TITLES.PROFILE, profileIcon, false, {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderBottomWidth: 0.3,
          borderBottomColor: '#F4F3F2',
        })}
        {renderItem(ITEM_TITLES.CONTRACTS, myContracts, false, {
          borderRadius: 0,
          borderBottomWidth: 0.3,
          borderBottomColor: '#F4F3F2',
        })}

        {renderItem(ITEM_TITLES.LANGUAGE, language, false, {
          borderRadius: 0,
          borderBottomWidth: 0.3,
          borderBottomColor: '#F4F3F2',
        })}
        {accountType === 'organization' && (
          <>
            {renderItem(ITEM_TITLES.ADD_SALES_BILLS, addSales, false, {
              borderRadius: 0,
              borderBottomWidth: 0.3,
              borderBottomColor: '#F4F3F2',
            })}
            {renderItem(ITEM_TITLES.PURCHASES_BILLS, purchase, false, {
              borderRadius: 0,
              borderBottomWidth: 0.3,
              borderBottomColor: '#F4F3F2',
            })}
          </>
        )}
        {renderItem(ITEM_TITLES.PRIVACY_POLICY, privacyPolicy, false, {
          borderRadius: 0,
          borderBottomWidth: 0.3,
          borderBottomColor: '#F4F3F2',
        })}
        {renderItem(ITEM_TITLES.TERMS, Terms, false, {
          borderRadius: 0,
          borderBottomWidth: 0.3,
          borderBottomColor: '#F4F3F2',
        })}
        {renderItem(ITEM_TITLES.CONTACT, contact, false, {
          borderRadius: 0,
          borderBottomWidth: 0.3,
          borderBottomColor: '#F4F3F2',
        })}
        {renderItem(ITEM_TITLES.NOTIFICATIONS, notification, true, {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomWidth: 0,
        })}
        <View style={currentStyles.darkModeContainer}>
          {renderItem(ITEM_TITLES.DARK_MODE, darkmode, true, {
            borderRadius: 10,
          })}
        </View>
        <View style={currentStyles.separator} />
        <TouchableOpacity
          style={currentStyles.logoutButton}
          onPress={handleLogout}>
          <LogoutIcon style={currentStyles.icon} />
          <Text style={currentStyles.logoutButtonText}>
            {ITEM_TITLES.LOG_OUT}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const lightStyles = StyleSheet.create({
  parentContainer: {
    borderRadius: 0.1,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
  },
  container: {
    backgroundColor: '#F4F3F2',
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 28,
    paddingLeft: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: '100%',
  },
  itemContainer: {
    borderBottomWidth: 0,
    borderBottomColor: 'white',
  },
  itemTitle: {
    color: 'black',
  },
  itemIcon: {
    color: 'green',
  },
  darkModeContainer: {
    marginTop: 16,
  },
  separator: {
    marginVertical: 24,
  },
  logoutButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginTop: Platform.OS === 'ios' ? 50 : 18,
    marginBottom: 50,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
const darkStyles = StyleSheet.create({
  parentContainer: {
    borderRadius: 0.1,
    overflow: 'hidden',
    backgroundColor: '#383642',
  },
  container: {
    backgroundColor: '#24232A',
    paddingTop: 16,
    paddingBottom: 80,
    paddingRight: 16,
    paddingLeft: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  itemContainer: {
    borderBottomWidth: 0,
    borderBottomColor: 'white',
  },
  itemTitle: {
    color: '#F4F3F2',
  },
  itemIcon: {
    color: 'green',
  },
  darkModeContainer: {
    marginTop: 16,
  },
  separator: {
    marginVertical: 24,
  },
  logoutButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F4F3F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginTop: Platform.OS === 'ios' ? 50 : 18,
    marginBottom: 90,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#F4F3F2',
    fontWeight: '500',
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
export default Settings;
