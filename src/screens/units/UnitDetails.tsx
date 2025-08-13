import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';
import {useGetUnitByIdQuery} from '../../app/services/api/units';
import {useGetTenantByIdQuery} from '../../app/services/api/tenants';

import Vector from '../../assets/icons/Vector.svg';
import RoundButton from '../../components/RoundButton';
import ContractInfo from './components/ContractInfo';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import {SERVER_URL} from '../../app/config';
import colors from '../../lib/constants/colors';

interface UnitDetailsProps {
  navigation: StackNavigationProp<any, any>;
  route: any;
}

const UnitDetails: React.FC<UnitDetailsProps> = ({navigation, route}) => {
  const {unitId, propertyId, propertyPart} = route.params;
  const [showLoading, setShowLoading] = useState(true);

  const theme = useSelector((state: RootState) => state.theme.theme);

  // Fetch fresh unit data from API
  const {data: unitData, isLoading, error} = useGetUnitByIdQuery(unitId);

  // Add 2-second minimum loading delay
  useEffect(() => {
    if (!isLoading && unitData) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, unitData]);

  // Use fresh data from API
  const currentUnitData = unitData?.data;

  // Helper function to construct full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return `${SERVER_URL}/${imagePath.replace(/^\//, '')}`;
  };
  const imageUrl = getImageUrl(currentUnitData?.pictures?.[0]);
  console.log(currentUnitData, 'currentUnitData');
  console.log(currentUnitData?.contracts, 'contracts');

  const hasContract =
    currentUnitData?.contracts && currentUnitData.contracts?.length > 0;
  const firstContract = currentUnitData?.contracts?.[0];

  // Extract tenant ID from the first contract
  const tenantId = firstContract?.tenant;
  console.log(tenantId, 'tenant ID');

  // Fetch tenant data by ID if tenant ID exists
  const {
    data: tenantData,
    isLoading: tenantLoading,
    error: tenantError,
  } = useGetTenantByIdQuery(tenantId || '', {
    skip: !tenantId, // Skip the query if no tenant ID
  });

  const tenantInfo = tenantData?.data;
  console.log(tenantInfo, 'tenant info');

  const styles = useMemo(
    () => Styles(theme, hasContract),
    [theme, hasContract],
  );

  // Show loading skeleton while data is being fetched or during delay
  if (isLoading || showLoading) {
    return (
      <View style={styles.parentContainer}>
        <LoadingSkeleton variant="property" />
      </View>
    );
  }

  // Show error state or if no data
  if (error || !currentUnitData) {
    return (
      <View style={[styles.parentContainer, styles.loadingContainer]}>
        <Text style={styles.loadingText}>
          {error ? 'Failed to load unit details' : 'No unit data available'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Image
              source={{
                uri: imageUrl,
              }}
              style={styles.image}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.unitName}>{currentUnitData.name}</Text>
              <View style={styles.areaContainer}>
                <Vector style={styles.vector} />
                <Text style={styles.areaText}>
                  {currentUnitData.size?.value} m²
                </Text>
              </View>
              <View
                style={[
                  styles.statusButton,
                  currentUnitData.status === 'vacant'
                    ? styles.leased
                    : styles.available,
                ]}>
                <Text style={styles.statusText}>
                  {currentUnitData.status.charAt(0).toUpperCase() +
                    currentUnitData.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.typeContainer}>
            <Text style={styles.type}>
              {currentUnitData.type.charAt(0).toUpperCase() +
                currentUnitData.type.slice(1).toLowerCase()}
            </Text>
            <Text
              style={
                styles.propertyName
              }>{`Part of the property ( ${currentUnitData?.property.name} )`}</Text>
          </View>

          {currentUnitData.contracts &&
          currentUnitData.contracts.length === 0 ? (
            <View style={styles.Roundbutton}>
              <RoundButton
                onPress={() =>
                  navigation.navigate('ContractFlow', {
                    screen: ROUTES.ADDCONTRACT,
                    params: {
                      unitId: unitId,
                      unitName: currentUnitData.name,
                      areaSize: currentUnitData.size?.value,
                      unitStatus: currentUnitData.status,
                      unitType: currentUnitData.type,
                      propertyPart: propertyPart,
                      unitImage: imageUrl,
                      haveContract: currentUnitData.contracts,
                      propertyId: currentUnitData.property,
                    },
                  })
                }
                Title="Add contract"
              />
            </View>
          ) : firstContract ? (
            <ContractInfo
              contractData={firstContract}
              tenantData={tenantInfo}
            />
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState, hasContract: boolean) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : colors.CardBackground,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
      minHeight: '100%',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor:
        theme === 'light'
          ? hasContract
            ? COLORS.BackgroundLightGray
            : COLORS.white
          : COLORS.backgroundDark,
      padding: 20,
      minHeight: '100%',
    },
    card: {
      flexDirection: 'row',
      padding: 0,
    },

    typeContainer: {
      left: 0,
      width: '100%',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    infoContainer: {
      flex: 1,
      marginLeft: 10,
    },
    unitName: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    areaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    areaText: {
      color: '#ADACB1',
      marginLeft: 10,
      marginTop: 5,
    },
    statusButton: {
      paddingVertical: 4,
      paddingHorizontal: 35,
      marginTop: 10,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    leased: {
      backgroundColor: 'black',
    },
    available: {
      backgroundColor: '#4D9E70',
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
    },
    type: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 4,
    },
    propertyName: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: 14,
      marginTop: 10,
    },
    vector: {
      marginTop: 10,
      marginBottom: 10,
    },
    Roundbutton: {
      marginTop: 100,
      width: '45%',
      alignSelf: 'center',
      paddingRight: Platform.OS === 'ios' ? 0 : 12,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      marginTop: 10,
      fontSize: 16,
    },
  });

export default UnitDetails;
