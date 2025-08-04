import React, {useMemo} from 'react';
import {View, StyleSheet, Text, Image, Platform} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';

import Vector from '../../assets/icons/Vector.svg';
import RoundButton from '../../components/RoundButton';

interface UnitDetailsProps {
  navigation: StackNavigationProp<any, any>;
  route: any;
}

const UnitDetails: React.FC<UnitDetailsProps> = ({navigation, route}) => {
  const {
    unitStatus,
    unitName,
    areaSize,
    unitType,
    propertyPart,
    unitImage,
    haveContract,
    unitId,
    refreshData,
    propertyId,
  } = route.params;

  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const status = 'Leased';

  useFocusEffect(
    React.useCallback(() => {
      if (refreshData) {
        console.log(refreshData, 'Refreshing data...');
      }
    }, [refreshData]),
  );

  console.log(route, 'console.log(route.params);console.log(route.params);');
  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={{uri: unitImage}} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.unitName}>{unitName}</Text>
            <View style={styles.areaContainer}>
              <Vector style={styles.vector} />
              <Text style={styles.areaText}>{areaSize} m²</Text>
            </View>
            <View
              style={[
                styles.statusButton,
                status === 'Leased' ? styles.leased : styles.available,
              ]}>
              <Text style={styles.statusText}>{unitStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.typeContainer}>
          <Text style={styles.type}>
            {unitType.charAt(0).toUpperCase() + unitType.slice(1).toLowerCase()}
          </Text>
          <Text
            style={
              styles.propertyName
            }>{`Part of the property ( ${propertyPart} )`}</Text>
        </View>

        {haveContract && haveContract.length === 0 ? (
          <View style={styles.Roundbutton}>
            <RoundButton
              onPress={() =>
                navigation.navigate('ContractFlow', {
                  screen: ROUTES.ADDCONTRACT,
                  params: {
                    unitId: unitId,
                    unitName: unitName,
                    areaSize: areaSize,
                    unitStatus: unitStatus,
                    unitType: unitType,
                    propertyPart: propertyPart,
                    unitImage: {uri: unitImage},
                    haveContract: haveContract,
                    propertyId,
                  },
                })
              }
              Title="Add contract"
            />
          </View>
        ) : (
          <View style={styles.Roundbutton}>
            <Text>should be contract details (Still working on it)</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
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
  });

export default UnitDetails;
