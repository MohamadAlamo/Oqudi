import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';

import Vector from '../../assets/icons/Vector.svg';
import RoundButton from '../../components/RoundButton';
import ContractInfo from './components/ContractInfo';

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
  const hasContract = haveContract && haveContract.length > 0;
  const styles = useMemo(
    () => Styles(theme, hasContract),
    [theme, hasContract],
  );

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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
                  unitStatus === 'vacant' ? styles.leased : styles.available,
                ]}>
                <Text style={styles.statusText}>
                  {unitStatus.charAt(0).toUpperCase() + unitStatus.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.typeContainer}>
            <Text style={styles.type}>
              {unitType.charAt(0).toUpperCase() +
                unitType.slice(1).toLowerCase()}
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
            <ContractInfo />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const Styles = (theme: ThemeState, hasContract: boolean) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
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
  });

export default UnitDetails;
