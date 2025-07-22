import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/redux/store';
import {ThemeState} from '../../../app/redux/themeSlice';
import {
  TUnitTypes,
  UNIT_TYPES,
} from '../../../app/services/api/properties/types';
import {COLORS} from '../../../lib/constants';

type RentalAreaToggleProps = {
  onSelectionChange: (selectedType: TUnitTypes) => void;
};

const SelectType: React.FC<RentalAreaToggleProps> = ({onSelectionChange}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<TUnitTypes | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.propertyTypeLabel}>Unit type</Text>
      <View style={styles.propertyTypeContainer}>
        {Object.values(UNIT_TYPES).map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.propertyTypeButton,
              selectedPropertyType === type
                ? styles.activePropertyType
                : styles.inactivePropertyType,
            ]}
            onPress={() => {
              setSelectedPropertyType(type);
              onSelectionChange(type);
            }}>
            <Text
              style={[
                styles.propertyTypeText,
                selectedPropertyType === type
                  ? styles.activePropertyTypeText
                  : styles.inactivePropertyTypeText,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    propertyTypeLabel: {
      marginTop: 5,
      color: theme === 'light' ? '#333' : '#ADACB1',
      alignSelf: 'flex-start',
      marginLeft: 20,
      marginBottom: 5,
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    propertyTypeContainer: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-between',
    },
    propertyTypeButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginHorizontal: 5,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    activePropertyType: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    inactivePropertyType: {
      backgroundColor: theme === 'light' ? 'white' : COLORS.backgroundDark,
      borderColor: '#ccc',
    },
    propertyTypeText: {
      fontSize: 14,
    },
    activePropertyTypeText: {
      color: COLORS.black,
    },
    inactivePropertyTypeText: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
    },
  });

export default SelectType;
