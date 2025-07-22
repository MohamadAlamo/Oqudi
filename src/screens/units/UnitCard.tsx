import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {ThemeState} from '../../app/redux/themeSlice';
import {RootState} from '../../app/redux/store';
import OwnerIcon from '../../assets/icons/Profile.svg';
import PropertyDash from '../../assets/icons/PropertyDash.svg';
import ArrowLeft from '../../assets/icons/ArrowLeft.svg';

interface UnitsCardProps {
  imageUri: ImageSourcePropType;
  unitName: string;
  status: string;
  ownerName: string;
  unitType: string;
}

const UnitsCard: React.FC<UnitsCardProps> = ({
  imageUri,
  unitName,
  ownerName,
  status,
  unitType,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  return (
    <View style={styles.cardContainer}>
      <Image source={imageUri} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
        <View style={styles.unitNameRow}>
          <Text style={styles.unitName}>{unitName}</Text>
          <View
            style={
              status === 'Vacant'
                ? styles.unitStatusLeased
                : styles.unitStatusVacant
            }>
            <Text style={styles.unitStatusText}>{status}</Text>
          </View>
        </View>
        <View style={styles.unitOwnerRow}>
          <OwnerIcon style={styles.icon} />
          <Text style={styles.unitOwner}>{ownerName}</Text>
        </View>
        <View style={styles.unitStatusContainer}>
          <View style={styles.unitNameRow2}>
            <PropertyDash style={styles.icon} />
            <Text style={styles.unitTypeText}>{unitType}</Text>
          </View>
          <View style={styles.unitNameRow3}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <ArrowLeft style={styles.unitOwnerRow2} />
          </View>
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
    },
    propertyInfo: {
      flex: 1,
    },
    unitName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme === 'light' ? 'black' : '#fff',
    },
    unitNameRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    unitNameRow2: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    unitNameRow3: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    unitStatusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    unitTypeText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme === 'light' ? 'black' : '#fff',
    },
    unitOwnerRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginBottom: 10,
      marginTop: 10,
    },
    unitOwnerRow2: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginBottom: -4,
    },
    unitOwner: {
      fontSize: 14,
      fontWeight: '600',
      color: theme === 'light' ? 'black' : '#fff',
    },
    viewDetailsButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    viewDetailsText: {
      fontSize: 12,
      color: '#ADACB1',
      fontWeight: '600',
    },
    unitStatusText: {
      fontSize: 12,
      color: '#fff',
      fontWeight: '600',
    },

    unitStatusLeased: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      backgroundColor: '#4CAF50',
    },
    unitStatusVacant: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      backgroundColor: 'black',
    },
    icon: {
      marginRight: 8,
    },
  });

export default UnitsCard;
