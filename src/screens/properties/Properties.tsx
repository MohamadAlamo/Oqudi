import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {COLORS} from '../../lib/constants';
import {RootState} from '../../app/redux/store';
import {useSelector} from 'react-redux';
import PropertyLight from '../../assets/img/PropertyLight.svg';
import PropertyDark from '../../assets/img/PropertyDark.svg';
import RoundButton from '../../components/RoundButton';
import {ROUTES} from '../../lib/constants';
import {ThemeState} from '../../app/redux/themeSlice';
import PropertyDash from '../../assets/icons/PropertyDash.svg';
import ApartmentDash from '../../assets/icons/apartmentDash.svg';
import PropertyCard from './components/PropertyCard';
import FloatinActionButton from '../../components/FloatinActionButton';
import {useLazyGetPropertiesQuery} from '../../app/services/api/properties';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_URL, USER_ID} from '../../app/config';
interface PropertiesProps {
  navigation: StackNavigationProp<any, any>;
}

const Properties: React.FC<PropertiesProps> = ({navigation}) => {
  const [ownerId, setOwnerId] = useState<string | null>(null);

  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const SvgComponent = theme === 'dark' ? PropertyDark : PropertyLight;
  console.log('heloooo there');

  useEffect(() => {
    const fetchOwnerId = async () => {
      try {
        const id = await AsyncStorage.getItem(USER_ID);
        console.log(id, 'this is id ');

        trigger({
          limit: 120,
          filters: [
            {
              field: 'owner',
              operator: 'equals',
              value: id,
            },
          ],
        });
        setOwnerId(id);
      } catch (error) {
        console.error('Error fetching USER_ID from AsyncStorage:', error);
      }
    };

    fetchOwnerId();
  }, []);

  const [trigger, {currentData, isFetching, error}] =
    useLazyGetPropertiesQuery();
  console.log('currentData', currentData?.data.docs, error);

  const properties = currentData?.data.docs;
  console.log(properties, 'properties here');

  return (
    <View style={styles.parentContainer}>
      {!properties ? (
        <View style={styles.containerForNoData}>
          <SvgComponent style={styles.logo} />
          <Text style={styles.Text}>
            It’s still empty Add your first property
          </Text>
          <View style={styles.Roundbutton}>
            <RoundButton
              onPress={() => navigation.navigate(ROUTES.ADD_PROPERTY)}
              Title="Add property"
            />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.card}>
              <View style={styles.cardTitleContainer}>
                <PropertyDash style={styles.icon} />
                <Text style={styles.cardTitle}>Units</Text>
              </View>
              <Text style={styles.cardSubtitle}>Total Number</Text>
              <Text style={styles.cardNumber}>1000</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.cardTitleContainer}>
                <ApartmentDash style={styles.icon} />
                <Text style={styles.cardTitle}>Properties</Text>
              </View>
              <Text style={styles.cardSubtitle}>Total Number</Text>
              <Text style={styles.cardNumber}>20</Text>
            </View>
          </View>

          <View style={styles.revenueContainer}>
            <Text style={styles.revenueText}>Expected annual revenue</Text>
            <Text style={styles.revenueNumber}>200,000 SAR</Text>
          </View>
          <ScrollView
            style={styles.propertyContainer}
            // eslint-disable-next-line react-native/no-inline-styles
            contentContainerStyle={{paddingBottom: 130}}>
            {properties?.map((property, index) => {
              const imageUrl = `${SERVER_URL}/${property.pictures[0]}`;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate(ROUTES.PROPERTY_DETAILS, {
                      propertyId: property._id,
                      propertyName: property.name,
                      propertyImage: imageUrl,
                      propertyLocation: property.location,
                      leaseType: property.leaseType,
                      PropertyStatus: property.status,
                      PropertyContract: property.contracts,
                    })
                  }>
                  <PropertyCard
                    imageUri={{uri: imageUrl}}
                    propertyName={property.name}
                    address={property.location}
                    leasedUnits={property.leasedUnits}
                    vacantUnits={property.vacantUnits}
                    leaseType={property.leaseType}
                    status={property.status}
                    types={property.types}
                  />
                  {index !== properties.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.addButton}>
            <FloatinActionButton
              text="+"
              onPress={() => navigation.navigate(ROUTES.ADD_PROPERTY)}
            />
          </View>
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
    addButton: {
      position: 'absolute',
      bottom: 80,
      right: 0,
    },
    divider: {
      height: 1,
      backgroundColor: theme === 'light' ? '#E0E0E0' : '#4D4D4D',
      marginVertical: 10,
      width: '100%',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
    },
    containerForNoData: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
    },
    logo: {
      alignSelf: 'center',
    },
    propertyDash: {},
    apartmentDash: {},
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
    Roundbutton: {marginTop: -150},

    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      width: '42%',
      backgroundColor: 'white',
      padding: 20,
      margin: 10,
      marginTop: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 5,
    },
    cardTitle: {
      fontSize: 14,
      color: '#24232A',
      fontWeight: '700',
      marginTop: 10,
      paddingLeft: 5,
    },
    icon: {
      marginRight: 8,
    },
    cardTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    cardSubtitle: {
      fontSize: 14,
      color: '#333',
      marginTop: 10,
    },
    cardNumber: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 5,
      color: '#24232A',
    },
    revenueContainer: {
      backgroundColor: COLORS.primary,
      borderRadius: 10,
      padding: 20,
      marginTop: 20,
      justifyContent: 'center',
      width: '90%',
    },
    propertyContainer: {
      padding: 20,
      marginTop: 10,
      width: '100%',
    },
    revenueText: {
      fontSize: 16,
      color: '#000',
    },
    revenueNumber: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 10,
      color: '#000000',
    },
  });

export default Properties;
