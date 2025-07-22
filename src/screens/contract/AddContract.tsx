import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';
// import Vector from '../../assets/icons/Vector.svg';
// import DatePicker from '@react-native-community/datetimepicker';

interface AddContractProps {
  navigation: StackNavigationProp<any, any>;
  route: any;
}

const AddContract: React.FC<AddContractProps> = ({navigation, route}) => {
  const {
    unitStatus,
    unitName,
    areaSize,
    unitType,
    propertyPart,
    unitImage,
    haveContract,
  } = route.params;

  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const status = 'Leased';
  console.log(route, 'console.log(route.params);console.log(route.params);');

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState('');

  const onChangeStartDate = (event: any, selectedDate: Date | null) => {
    const currentDate = selectedDate || new Date();
    setStartDate(currentDate);
    calculatePeriod();
  };

  const onChangeEndDate = (event: any, selectedDate: Date | null) => {
    const currentDate = selectedDate || new Date();
    setEndDate(currentDate);
    calculatePeriod();
  };

  const calculatePeriod = () => {
    const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;
    const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000; // Approximate month length
    const diffInMillis = endDate.getTime() - startDate.getTime();

    const years = Math.floor(diffInMillis / oneYearInMillis);
    const remainingMillisAfterYears = diffInMillis % oneYearInMillis;
    const months = Math.floor(remainingMillisAfterYears / oneMonthInMillis);
    const days = Math.floor(
      (remainingMillisAfterYears % oneMonthInMillis) / (24 * 60 * 60 * 1000),
    );

    let periodString = '';
    if (years > 0) {
      periodString += `${years} year${years > 1 ? 's' : ''}`;
    }

    if (months > 0) {
      if (years > 0) {
        periodString += ' and ';
      }
      periodString += `${months} month${months > 1 ? 's' : ''}`;
    }

    if (days > 0) {
      if (years > 0 || months > 0) {
        periodString += ' and ';
      }
      periodString += `${days} day${days > 1 ? 's' : ''}`;
    }

    if (periodString === '') {
      periodString = 'Invalid Date Range';
    }

    setPeriod(periodString);
  };

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <View style={styles.topTextContainer}>
          <Text style={styles.topText}>
            Create a new contract by filling in the required field
          </Text>
        </View>
        <View style={styles.topTitleContainer}>
          <Text style={styles.unitName}>Unit Details</Text>
        </View>
        <View style={styles.card}>
          <Image source={unitImage} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.unitName}>{unitName}</Text>
            <View style={styles.areaContainer}>
              {/* <Vector style={styles.vector} /> */}
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

        {/* <View style={styles.datePickersContainer}>
          <View style={styles.datePickerWrapper}>
            <Text style={styles.labelText}>Contract Start Date</Text>
            <DatePicker
              testID="startDate"
              mode="date"
              value={startDate}
              onChange={onChangeStartDate}
              style={styles.datePicker}
            />
          </View>
          <View style={styles.datePickerWrapper}>
            <Text style={styles.labelText}>Contract End Date</Text>
            <DatePicker
              testID="endDate"
              mode="date"
              value={endDate}
              onChange={onChangeEndDate}
              style={styles.datePicker}
            />
          </View>
          <View style={styles.periodContainer}>
            <Text style={styles.periodValue}>{period}</Text>
          </View>
        </View> */}
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
    topTextContainer: {
      alignSelf: 'flex-start',
      marginBottom: 30,
    },
    topTitleContainer: {
      alignSelf: 'flex-start',
      marginBottom: 15,
    },
    topText: {
      textAlign: 'left',
    },
    card: {
      flexDirection: 'row',
      padding: 0,
    },
    labelText: {
      fontSize: 14,
      color: theme === 'light' ? COLORS.black : COLORS.white,
      marginBottom: 10,
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
    },

    datePickersContainer: {
      paddingLeft: 30,
      marginTop: 20,
      flexDirection: 'row',
    },
    dateAndPeriodContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    datePicker: {
      width: '100%',
    },
    periodContainer: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    periodText: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    periodValue: {
      color: 'red',
      fontSize: 16,
      marginLeft: 10,
    },
    saveButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
  });

export default AddContract;
