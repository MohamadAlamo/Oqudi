import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../../../lib/constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/redux/store';
import {ThemeState} from '../../../app/redux/themeSlice';
import {
  LEASE_TYPE,
  TLeaseType,
  TUnitTypes,
  UNIT_TYPES,
} from '../../../app/services/api/properties/types';

type RentalAreaToggleProps = {
  onSelectionChange: (
    selected: TLeaseType,
    selectedTypes: TUnitTypes[],
  ) => void;
};

const StructPicker: React.FC<RentalAreaToggleProps> = ({onSelectionChange}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const [selected, setSelected] = useState<TLeaseType>(LEASE_TYPE.units);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<
    TUnitTypes[]
  >([]);

  const togglePropertyType = (type: TUnitTypes) => {
    let updatedTypes;
    if (selectedPropertyTypes.includes(type)) {
      updatedTypes = selectedPropertyTypes.filter(item => item !== type);
    } else {
      updatedTypes = [...selectedPropertyTypes, type];
    }
    setSelectedPropertyTypes(updatedTypes);
  };

  useEffect(() => {
    onSelectionChange(selected, selectedPropertyTypes);
  }, [selected, selectedPropertyTypes]);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selected === 'units' ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setSelected('units')}>
          <Text
            style={[
              styles.toggleText,
              selected === 'units' ? styles.activeText : styles.inactiveText,
            ]}>
            Units
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            selected === LEASE_TYPE.whole
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          onPress={() => setSelected(LEASE_TYPE.whole)}>
          <Text
            style={[
              styles.toggleText,
              selected === LEASE_TYPE.whole
                ? styles.activeText
                : styles.inactiveText,
            ]}>
            One rental area
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        * If there are several rental areas in your property, you can create a
        property with several units
      </Text>

      {selected === LEASE_TYPE.whole && (
        <>
          <Text style={styles.propertyTypeLabel}>Property type</Text>
          <View style={styles.propertyTypeContainer}>
            {Object.values(UNIT_TYPES).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.propertyTypeButton,
                  selectedPropertyTypes.includes(type)
                    ? styles.activePropertyType
                    : styles.inactivePropertyType,
                ]}
                onPress={() => togglePropertyType(type)}>
                <Text
                  style={[
                    styles.propertyTypeText,
                    selectedPropertyTypes.includes(type)
                      ? styles.activePropertyTypeText
                      : styles.inactivePropertyTypeText,
                  ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
    },
    toggleContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 8,
    },

    activeButton: {
      backgroundColor: theme === 'light' ? COLORS.black : COLORS.white,
    },
    inactiveButton: {
      backgroundColor: theme === 'light' ? '#F4F3F2' : '#413F4E',
    },
    toggleText: {
      fontSize: 16,
    },
    activeText: {
      color: theme === 'light' ? COLORS.white : 'black',
    },
    inactiveText: {
      //   color: 'black',

      color: theme === 'light' ? 'black' : 'white',
    },
    note: {
      marginTop: 10,
      color: '#A9A9A9',
      textAlign: 'left',
    },
    displayText: {
      marginTop: 20,
      fontSize: 18,
      color: '#333',
    },
    propertyTypeLabel: {
      marginTop: 20,
      color: theme === 'light' ? '#333' : '#ADACB1',
      alignSelf: 'flex-start',
      marginLeft: 5,
      marginBottom: 5,
      // color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
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

export default StructPicker;
