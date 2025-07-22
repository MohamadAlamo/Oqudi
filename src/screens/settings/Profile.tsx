import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';
import NextIcon from '../../assets/icons/Right.svg';
import SubscriptionIcon from '../../assets/icons/Subscription.svg';
import PersonIcon from '../../assets/icons/Profile.svg';
import PhoneIcon from '../../assets/icons/Phone.svg';
import MailIcon from '../../assets/icons/Mail.svg';
import LocationIcon from '../../assets/icons/Location.svg';
import DeleteIconLight from '../../assets/icons/DeleteLight.svg';
import DeleteIconDark from '../../assets/icons/DeleteDark.svg';

interface ProfileProps {
  navigation: StackNavigationProp<any, any>;
}
const Profile: React.FC<ProfileProps> = ({navigation}) => {
  const user = useSelector((state: RootState) => state.user);

  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const DeleteIcon = theme === 'light' ? DeleteIconLight : DeleteIconDark;

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate(ROUTES.MY_SUBSCRIPTION)}>
          <View style={styles.menuItemContent}>
            <SubscriptionIcon style={styles.iconLeft} />
            <Text style={styles.menuText}>My subscription</Text>
            <NextIcon style={styles.iconRight} />
          </View>
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <PersonIcon style={styles.iconLeft} />
            <Text style={styles.info}>
              {user.firstName} {user.lastName}
            </Text>
          </View>
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
          </View>
          <View style={styles.infoItem}>
            <PhoneIcon style={styles.iconLeft} />
            <Text style={styles.info}>{user.phone}</Text>
          </View>
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
          </View>
          <View style={styles.infoItem}>
            <MailIcon style={styles.iconLeft} />
            <Text style={styles.info}>{user.email}</Text>
          </View>
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
          </View>
          <View style={styles.infoItem}>
            <LocationIcon style={styles.iconLeft} />
            <Text style={styles.infoAddress}>{user.location}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => navigation.navigate(ROUTES.WELCOME)}>
          <DeleteIcon style={styles.icon} />
          <Text style={styles.deleteButtonText}>Delete profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.backgroundDark,
      minHeight: Dimensions.get('window').height,
    },
    infoContainer: {
      padding: 20,
      backgroundColor: theme === 'light' ? COLORS.white : '#383642',
      borderRadius: 20,
      marginTop: 15,
      width: 390,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 5,
    },
    info: {
      fontSize: 14,
      color: theme === 'light' ? COLORS.black : '#fff',
      marginLeft: 10,
    },
    infoAddress: {
      fontSize: 14,
      color: theme === 'light' ? COLORS.black : '#fff',
      width: '90%',
      marginLeft: 10,
    },
    menuText: {
      color: theme === 'light' ? COLORS.black : '#fff',
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
    },
    iconLeft: {
      marginRight: 10,
    },
    iconRight: {},
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      backgroundColor: theme === 'light' ? COLORS.white : '#383642',
      width: '90%',
      marginTop: 25,
      borderRadius: 15,
      shadowOffset: {width: 1, height: 1},
      shadowColor: theme === 'light' ? 'white' : 'black',
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    divider: {
      height: 0.3,
      backgroundColor: '#ADACB1',
      width: '100%',
    },
    dividerWrapper: {
      width: '111%',
      marginTop: 20,
      marginBottom: 20,
      marginLeft: -19,
    },
    deleteButton: {
      marginHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme === 'light' ? COLORS.black : COLORS.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 56,
      width: '90%',
      marginTop: Platform.OS === 'ios' ? 200 : 18,
    },
    deleteButtonText: {
      fontSize: 16,
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontWeight: '500',
      marginLeft: 8,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

export default Profile;
