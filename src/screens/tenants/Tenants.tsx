import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {COLORS, ROUTES} from '../../lib/constants';
import {RootState} from '../../app/redux/store';
import {useSelector} from 'react-redux';
import {useGetTenantsQuery} from '../../app/services/api/tenants';
import TenantCard from '../../components/TenantCard';
import FloatinActionButton from '../../components/FloatinActionButton';
import {ThemeState} from '../../app/redux/themeSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import PropertyLight from '../../assets/img/PropertyLight.svg';
import PropertyDark from '../../assets/img/PropertyDark.svg';
import RoundButton from '../../components/RoundButton';
interface TenantsProps {
  navigation: StackNavigationProp<any, any>;
  route?: any;
}
const Tenants: React.FC<TenantsProps> = ({navigation, route}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const {data, error, isLoading} = useGetTenantsQuery();
  const SvgComponent = theme === 'dark' ? PropertyDark : PropertyLight;

  // Check if we're in selection mode
  const isSelectionMode = route?.params?.selectionMode;
  const originalParams = route?.params?.originalParams;

  // Handle tenant selection
  const handleTenantSelect = (tenant: any) => {
    if (isSelectionMode) {
      navigation.navigate('ContractFlow', {
        screen: ROUTES.ADDCONTRACT,
        params: {
          ...originalParams,
          selectedTenant: tenant,
        },
      });
    }
  };
  if (error)
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container2}>
          <SvgComponent style={styles.logo} />
          <Text style={styles.Text}>
            It’s still empty Add your first tenant
          </Text>
          <View style={styles.Roundbutton}>
            <RoundButton
              onPress={() => navigation.navigate(ROUTES.ADDTENANT)}
              Title="Add tenants"
            />
          </View>
        </View>
      </View>
    );

  return (
    <View style={styles.parentContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {data?.data.map(item => (
            <TenantCard
              key={item._id}
              name={`${item.name.firstName} ${item.name.lastName}`}
              phoneNumber={`${item.phone}`}
              email={`${item.email}`}
              address={`${item.location}`}
              vatNumber={`${item.VAT}`}
              onEdit={() => {}}
              onDelete={() => {}}
              onPress={
                isSelectionMode ? () => handleTenantSelect(item) : undefined
              }
              selectionMode={isSelectionMode}
            />
          ))}
        </View>
      </ScrollView>
      {!isSelectionMode && (
        <View style={styles.addButton}>
          <FloatinActionButton
            text="+"
            onPress={() => navigation.navigate(ROUTES.ADDTENANT)}
          />
        </View>
      )}
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
      overflow: 'hidden',
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    addButton: {
      position: 'absolute',
      bottom: 80,
      right: 0,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
      minHeight: Dimensions.get('window').height,
      paddingBottom: 120, // Add padding to account for floating action button
    },
    container2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      backgroundColor: theme === 'light' ? COLORS.black : COLORS.white,
    },
    Roundbutton: {marginTop: -150},
    logo: {
      alignSelf: 'center',
    },
    Text: {
      color: theme === 'light' ? '#24232A' : '#F4F3F2',
      textAlign: 'center',
      fontFamily: 'Inter',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 19,
      letterSpacing: -0.08,
      marginBottom: 180,
      marginTop: 20,
    },
  });

export default Tenants;
