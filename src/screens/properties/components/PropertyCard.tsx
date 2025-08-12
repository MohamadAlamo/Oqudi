import React, {useMemo} from 'react';
import {View, Text, Image, StyleSheet, ImageSourcePropType} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/redux/store';
import {ThemeState} from '../../../app/redux/themeSlice';
import PropertyDash from '../../../assets/icons/PropertyDash.svg';

interface PropertyCardProps {
  imageUri: ImageSourcePropType;
  propertyName: string;
  address: string;
  leasedUnits: number;
  vacantUnits: number;
  leaseType?: string;
  status?: string;
  types?: string[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUri,
  propertyName,
  address,
  leasedUnits,
  vacantUnits,
  leaseType,
  status,
  types,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  return (
    <View style={styles.cardContainer}>
      <Image source={imageUri} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyName}>{propertyName}</Text>
        <Text style={styles.address}>{address}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.unitStatusContainer}>
            {leaseType === 'whole' ? (
              <View
                style={[
                  styles.unitStatusButton,
                  (status || 'unavailable').toLowerCase() === 'unavailable'
                    ? styles.availableButton
                    : styles.statusButton,
                ]}>
                <Text style={styles.unitStatusText}>
                  {(status || 'unavailable').charAt(0).toUpperCase() +
                    (status || 'unavailable').slice(1)}
                </Text>
              </View>
            ) : (
              <>
                <View style={[styles.unitStatusButton, styles.leasedButton]}>
                  <Text style={styles.unitStatusText}>
                    Leased {leasedUnits} units
                  </Text>
                </View>
                <View style={[styles.unitStatusButton, styles.vacantButton]}>
                  <Text style={styles.unitStatusText}>
                    Vacant {vacantUnits} units
                  </Text>
                </View>
              </>
            )}
          </View>
          {leaseType === 'whole' && types && types.length > 0 && (
            <View style={styles.unitNameRow2}>
              <PropertyDash style={styles.icon} />
              <Text style={styles.unitTypeText}>{types.join(', ')}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      borderRadius: 10,
      marginVertical: 5,
      alignItems: 'center',
    },
    propertyImage: {
      width: 100,
      height: 105,
      borderRadius: 8,
      marginRight: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      // elevation: 3,
    },
    propertyInfo: {
      flex: 1,
    },
    propertyName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme === 'light' ? 'black' : '#fff',
    },
    address: {
      fontSize: 12,
      color: theme === 'light' ? '#7E7D86' : '#aaa',
      marginVertical: 4,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 10,
    },
    unitStatusContainer: {
      flexDirection: 'row',
    },
    unitStatusButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    leasedButton: {
      backgroundColor: '#4CAF50',
    },
    vacantButton: {
      backgroundColor: '#808080',
    },
    statusButton: {
      backgroundColor: '#4CAF50', // Green for unavailable/leased status
    },
    availableButton: {
      backgroundColor: '#808080', // Gray for available status
    },
    unitStatusText: {
      fontSize: 12,
      color: '#fff',
      fontWeight: '600',
    },
    unitNameRow2: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
      marginLeft: 20,
    },
    icon: {
      marginRight: 8,
    },
    unitTypeText: {
      fontSize: 12,
      color: theme === 'light' ? '#7E7D86' : '#aaa',
      fontWeight: '500',
    },
  });

export default PropertyCard;
