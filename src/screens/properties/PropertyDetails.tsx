import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';
import Location from '../../assets/icons/locationGray.svg';
import RoundButton from '../../components/RoundButton';
import FloatinActionButton from '../../components/FloatinActionButton';
import UnitsCard from '../units/UnitCard';
import {useGetUnitsQuery} from '../../app/services/api/units';
import {useGetPropertyByIdQuery} from '../../app/services/api/properties';
import {useGetTenantByIdQuery} from '../../app/services/api/tenants';
import {SERVER_URL} from '../../app/config';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ContractInfo from '../units/components/ContractInfo';
import Vector from '../../assets/icons/Vector.svg';

interface PropertyDetailsProps {
  navigation: StackNavigationProp<any, any>;
  route: any;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  navigation,
  route,
}) => {
  const {propertyId} = route.params;

  // Fetch property data from API
  const {
    data: propertyData,
    isLoading: propertyLoading,
    error: propertyError,
  } = useGetPropertyByIdQuery(propertyId);

  const currentPropertyData = propertyData?.data;

  // Extract property details from API response
  const propertyName = currentPropertyData?.name;
  const propertyLocation = currentPropertyData?.location;
  const leasedUnits = currentPropertyData?.leasedUnits;
  const vacantUnits = currentPropertyData?.vacantUnits;
  const leaseType = currentPropertyData?.leaseType;
  const PropertyStatus = currentPropertyData?.status;
  const PropertyContract = currentPropertyData?.contracts;
  const PropertySize = currentPropertyData?.size?.value;

  // Helper function to construct full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return `${SERVER_URL}/${imagePath.replace(/^\//, '')}`;
  };
  const propertyImage = getImageUrl(currentPropertyData?.pictures?.[0]);

  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme, leaseType), [theme, leaseType]);

  // Fetch units data (must be called before any conditional returns)
  const {currentData} = useGetUnitsQuery({
    filters: {
      property: {
        operator: 'equals',
        value: propertyId,
      },
    },
  });
  const units = currentData?.data.docs || [];

  // Contract logic for property (similar to UnitDetails)
  const hasContract = PropertyContract && PropertyContract.length > 0;
  const firstContract = hasContract ? PropertyContract[0] : null;

  // Extract tenant ID from the first contract
  const tenantId = firstContract?.tenant;

  // Fetch tenant data by ID if tenant ID exists
  const {
    data: tenantData,
    isLoading: tenantLoading,
    error: tenantError,
  } = useGetTenantByIdQuery(tenantId || '', {
    skip: !tenantId, // Skip the query if no tenant ID
  });

  const tenantInfo = tenantData?.data;

  // Show loading state with skeleton
  if (propertyLoading) {
    return (
      <View style={styles.parentContainer}>
        <LoadingSkeleton variant="property" />
      </View>
    );
  }

  // Show error state
  if (propertyError || !currentPropertyData) {
    return (
      <View style={[styles.parentContainer, styles.loadingContainer]}>
        <Text style={styles.loadingText}>
          {propertyError
            ? 'Failed to load property details'
            : 'Property not found'}
        </Text>
      </View>
    );
  }

  const PropertyDetails = {
    propertyName,
    PropertySize,
    PropertyStatus,
    propertyType: leaseType,
    propertyImage,
    haveContract: PropertyContract,
    propertyId: propertyId,
    contractType: 'property',
  };
  console.log(PropertyDetails, 'PropertyDetails');

  // If leaseType is "whole", show only the basic property info
  if (leaseType === 'whole') {
    return (
      <View style={styles.parentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Image source={{uri: propertyImage}} style={styles.propertyImage} />
            <View style={styles.propertyInfoContainer}>
              <View style={styles.propertyTextContainer}>
                <Text style={styles.propertyName}>{propertyName}</Text>
                <View style={styles.locationContainer}>
                  <Location style={styles.icon} />
                  <Text style={styles.propertyLocation}>
                    {propertyLocation}
                  </Text>
                </View>
              </View>
              <View style={styles.statusAndAreaContainer}>
                <View
                  style={[
                    styles.statusButton,
                    PropertyStatus === 'unavailable'
                      ? styles.leased
                      : styles.available,
                  ]}>
                  <Text style={styles.statusText}>
                    {PropertyStatus.charAt(0).toUpperCase() +
                      PropertyStatus.slice(1)}
                  </Text>
                </View>
                <View style={styles.areaContainer}>
                  <Vector style={styles.vector} />
                  <Text style={styles.areaText}>{PropertySize} m²</Text>
                </View>
              </View>
            </View>
            <View style={styles.unitsContainer}>
              {/* <Text style={styles.unitText}>Leased Units: {leasedUnits}</Text>
              <Text style={styles.unitText}>Vacant Units: {vacantUnits}</Text> */}
            </View>

            {PropertyContract && PropertyContract.length === 0 ? (
              <View style={styles.Roundbutton2}>
                <RoundButton
                  onPress={() =>
                    navigation.navigate('ContractFlow', {
                      screen: ROUTES.ADDCONTRACT,
                      params: {
                        // unitId: '',
                        // unitName: propertyName,
                        // areaSize: PropertySize,
                        // unitStatus: PropertyStatus,
                        // unitType: leaseType,
                        // propertyPart: propertyName,
                        // unitImage: propertyImage,
                        // haveContract: PropertyContract,
                        // propertyId: propertyId,
                        contractType: 'property',
                        PropertyDetails,
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
          </View>
        </ScrollView>
      </View>
    );
  }

  // If leaseType is "units", show the full content with units
  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Image source={{uri: propertyImage}} style={styles.propertyImage} />

        <Text style={styles.propertyName}>{propertyName}</Text>
        <View style={styles.locationContainer}>
          <Location style={styles.icon} />
          <Text style={styles.propertyLocation}>{propertyLocation}</Text>
        </View>

        <View style={styles.unitsContainer}>
          {/* <Text style={styles.unitText}>Leased Units: {leasedUnits}</Text>
          <Text style={styles.unitText}>Vacant Units: {vacantUnits}</Text> */}
        </View>
        {units.length > 0 ? (
          <View style={styles.second222}>
            {/* Form Here */}
            <Text style={styles.propertyName}>Units</Text>
            <ScrollView
              style={styles.propertyContainer}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEventThrottle={16}>
              {units?.map((unit, index) => {
                const imageUrl = `${SERVER_URL}/${unit.pictures[0]}`;

                return (
                  <TouchableOpacity
                    key={unit._id}
                    onPress={() => {
                      const params = {
                        unitId: unit._id,
                        unitName: unit.name,
                        areaSize: unit.size.value,
                        unitStatus: unit.status,
                        unitType: unit.type,
                        propertyPart: propertyName,
                        unitImage: imageUrl,
                        haveContract: unit.contracts,
                        propertyId,
                      };

                      console.log(
                        'Navigating to UnitDetails with params:',
                        params,
                      );

                      navigation.navigate('UnitsFlow', {
                        screen: ROUTES.UNIT_DETAILS,
                        params: params,
                      });
                    }}>
                    <UnitsCard
                      imageUri={{uri: imageUrl}}
                      unitName={unit.name}
                      ownerName={`${unit.owner.firstName} ${unit.owner.lastName}`}
                      status={unit.status}
                      unitType={unit.type}
                    />
                    {index !== units.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.Roundbutton}>
            <RoundButton
              onPress={() =>
                navigation.navigate('UnitsFlow', {
                  screen: ROUTES.ADD_UNIT,
                  params: {
                    propertyId: propertyId,
                    propertyName: propertyName,
                    propertyImage: propertyImage,
                    propertyLocation: propertyLocation,
                  },
                })
              }
              Title="Add unit   "
            />
          </View>
        )}
      </View>
      {units.length > 0 && (
        <View style={styles.addButton}>
          <FloatinActionButton
            text="+"
            onPress={() =>
              navigation.navigate('UnitsFlow', {
                screen: ROUTES.ADD_UNIT,
                params: {
                  propertyId: propertyId,
                  propertyName: propertyName,
                  propertyImage: propertyImage,
                  propertyLocation: propertyLocation,
                },
              })
            }
          />
        </View>
      )}
    </View>
  );
};

const Styles = (theme: ThemeState, leaseType?: string) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : COLORS.CardBackground,
    },
    second222: {
      width: '100%',
      marginTop: 10,
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
      padding: 20,
      minHeight: '100%',
    },

    propertyImage: {
      width: '100%',
      height: 250,
      borderRadius: 10,
      marginBottom: 20,
    },

    propertyInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      marginBottom: 20,
    },
    propertyTextContainer: {
      flex: 1,
      marginRight: 10,
    },
    statusAndAreaContainer: {
      alignItems: 'flex-end',
    },
    propertyName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme === 'light' ? COLORS.black : '#F4F3F2',
      marginBottom: 10,
      alignSelf: 'flex-start',
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
      marginBottom: 20,
    },
    propertyLocation: {
      fontSize: 18,
      color: theme === 'light' ? '#333' : '#BBB',
      marginBottom: 20,
      alignSelf: 'flex-start',
    },

    unitsContainer: {
      width: '100%',
      padding: 20,
      backgroundColor: theme === 'light' ? '#F0F0F0' : '#4D4D4D',
      borderRadius: 10,
    },

    unitText: {
      fontSize: 16,
      color: theme === 'light' ? '#24232A' : '#F4F3F2',
      marginBottom: 10,
    },
    icon: {
      marginRight: 8,
    },
    Roundbutton: {
      marginTop: 30,
      width: '40%',
      alignSelf: 'center',
      paddingRight: Platform.OS === 'ios' ? 0 : 10,
    },
    Roundbutton2: {
      marginTop: 100,
      width: '45%',
      alignSelf: 'center',
      paddingRight: Platform.OS === 'ios' ? 0 : 12,
    },
    propertyContainer: {
      width: '100%',
      flex: 1,
    },
    scrollContentContainer: {
      paddingBottom: leaseType === 'whole' ? 0 : 130,
    },
    divider: {
      height: 1,
      backgroundColor: theme === 'light' ? '#E0E0E0' : '#4D4D4D',
      marginVertical: 10,
      width: '100%',
    },
    addButton: {
      position: 'absolute',
      bottom: 5,
      right: -5,
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
      backgroundColor: COLORS.Success,
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme === 'light' ? COLORS.white : COLORS.white,
      fontSize: 16,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    areaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 5,
      alignSelf: 'flex-end',
    },
    areaText: {
      color: '#ADACB1',
      marginLeft: 10,
      marginTop: 5,
    },
    vector: {
      marginTop: 10,
      marginBottom: 10,
    },
  });

export default PropertyDetails;
