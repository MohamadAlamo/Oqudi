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
import {SERVER_URL} from '../../app/config';
interface PropertyDetailsProps {
  navigation: StackNavigationProp<any, any>;
  route: any;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  navigation,
  route,
}) => {
  const {
    propertyName,
    propertyImage,
    propertyLocation,
    propertyId,
    leasedUnits,
    vacantUnits,
    leaseType,
  } = route.params;

  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const {currentData} = useGetUnitsQuery({
    filters: [
      {
        field: 'property',
        operator: 'equals',
        value: propertyId,
      },
    ],
  });
  const units = currentData?.data.docs || [];
  console.log(units, 'units');
  console.log(leaseType, 'leaseType');

  // If leaseType is "whole", show only the basic property info
  if (leaseType === 'whole') {
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
          <View style={styles.Roundbutton2}>
            <RoundButton
              onPress={() => {
                console.log('hello');
              }}
              Title="Add contract"
            />
          </View>
        </View>
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
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={{paddingBottom: 130}}>
              {units?.map((unit, index) => {
                const imageUrl = `${SERVER_URL}/${unit.pictures[0]}`;

                return (
                  <TouchableOpacity
                    key={index}
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
                    {index !== units.length && <View style={styles.divider} />}
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

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
    },
    second222: {
      width: '100%',
      marginTop: 10,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
      padding: 20,
    },

    propertyImage: {
      width: '100%',
      height: 250,
      borderRadius: 10,
      marginBottom: 20,
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
    },
    divider: {
      height: 1,
      backgroundColor: theme === 'light' ? '#E0E0E0' : '#4D4D4D',
      marginVertical: 10,
      width: '100%',
    },
    addButton: {
      position: 'absolute',
      bottom: 80,
      right: -5,
    },
  });

export default PropertyDetails;
