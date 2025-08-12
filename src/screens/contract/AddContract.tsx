import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {COLORS, ROUTES} from '../../lib/constants';
import Vector from '../../assets/icons/Vector.svg';
import DownIcon from '../../assets/icons/DownIcon.svg';
import PlusIcon from '../../assets/icons/Plus.svg';
import DatePicker from '../../components/DatePicker';
import Button from '../../components/Button';
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../../lib/helpers/fontScaling';
import {useCreateContractMutation} from '../../app/services/api/contracts';
import {useDispatch} from 'react-redux';
import {apiSlice} from '../../app/redux/apiSlice';
// import {useFormExitConfirmation} from '../../lib/hooks/useFormExitConfirmation';
interface AddContractProps {
  navigation: StackNavigationProp<any, any>;
  route: any;
}
const safeGetResponsiveSpacing = (spacing: number): number => {
  try {
    const result = getResponsiveSpacing(spacing);
    return typeof result === 'number' && !isNaN(result) ? result : spacing;
  } catch (error) {
    console.warn('Error in getResponsiveSpacing:', error);
    return spacing;
  }
};
const safeGetResponsiveFontSize = (size: number): number => {
  try {
    const result = getResponsiveFontSize(size);
    return typeof result === 'number' && !isNaN(result) ? result : size;
  } catch (error) {
    console.warn('Error in getResponsiveFontSize:', error);
    return size;
  }
};
const AddContract: React.FC<AddContractProps> = ({navigation, route}) => {
  const {
    unitStatus,
    unitName,
    areaSize,
    unitType,
    propertyPart,
    unitImage,
    haveContract,
    selectedTenant,
    unitId,
    propertyId,
    contractType,
    // Property details for navigation back (when contractType is 'property')
    // propertyName,
    // propertyImage,
    // propertyLocation,
    // leasedUnits,
    // vacantUnits,
    // leaseType,
    // PropertyStatus,
    // PropertyContract,
  } = route.params;
  console.log(propertyId._id, ' propertyIdpropertyIdpropertyId');
  console.log(propertyId, ' propertyIdpropertyIdpropertyId');
  const theme = useSelector((state: RootState) => state.theme.theme);
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const styles = useMemo(() => Styles(theme), [theme]);
  const status = 'Leased';

  // State for contract dates
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  ); // Default to 1 year later

  // State for tenant selection
  const [currentSelectedTenant, setCurrentSelectedTenant] = useState<any>(
    selectedTenant || null,
  );
  const [showTenantOptions, setShowTenantOptions] = useState<boolean>(false);

  // State for payment schedule
  const [paymentScheduleCompleted, setPaymentScheduleCompleted] =
    useState<boolean>(false);
  const [paymentScheduleData, setPaymentScheduleData] = useState<any>(null);
  const [scheduleFormData, setScheduleFormData] = useState<any>(null);

  // API hook for creating contract
  const [createContract, {isLoading: isCreatingContract}] =
    useCreateContractMutation();

  // Update selected tenant when route params change
  useEffect(() => {
    if (selectedTenant) {
      setCurrentSelectedTenant(selectedTenant);
    }
  }, [selectedTenant]);

  // Handle payment schedule data from ScheduleOfPayments
  useEffect(() => {
    if (route.params?.paymentScheduleCompleted) {
      setPaymentScheduleCompleted(true);
      setPaymentScheduleData(route.params.paymentScheduleData);
      setScheduleFormData(route.params.formData);
    }
  }, [route.params]);

  // Use form exit confirmation hook - temporarily commented out to debug
  // useFormExitConfirmation({
  //   navigation,
  //   targetRoute: 'UnitsFlow',
  //   forceTargetRoute: true,
  //   targetParams: {
  //     screen: ROUTES.UNIT_DETAILS,
  //     params: {
  //       unitId: route.params.unitId,
  //       unitName: unitName,
  //       areaSize: areaSize,
  //       unitStatus: unitStatus,
  //       unitType: unitType,
  //       propertyPart: propertyPart,
  //       unitImage: unitImage,
  //       haveContract: haveContract,
  //     },
  //   },
  // });

  // Handle tenant selection options
  const handleTenantOptionPress = () => {
    setShowTenantOptions(true);
  };

  const handleAddFromTenantList = () => {
    setShowTenantOptions(false);
    // Navigate to BottomTabs and then to Tenants tab
    navigation.navigate('BottomTabs', {
      screen: ROUTES.TENANTS,
      params: {
        screen: ROUTES.TENANTS,
        params: {
          selectionMode: true,
          returnTo: 'AddContract',
          originalParams: route.params,
        },
      },
    });
  };

  const handleAddNewTenant = () => {
    setShowTenantOptions(false);
    navigation.navigate(ROUTES.ADDTENANT, {
      returnTo: 'AddContract',
      originalParams: route.params,
    });
  };

  // Calculate duration between dates
  const calculateDuration = (start: Date, end: Date): string => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);

      if (months === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years} year${years > 1 ? 's' : ''} ${months} month${
          months > 1 ? 's' : ''
        }`;
      }
    }
  };

  // Handle payment schedule navigation with date validation
  const handlePaymentSchedulePress = () => {
    // Validate that dates are selected
    if (!startDate || !endDate) {
      Alert.alert(
        'Error',
        'Please select both start date and end date before creating a payment schedule',
      );
      return;
    }

    // Validate that end date is after start date
    if (endDate <= startDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    // Calculate duration once and pass it along with dates
    const duration = calculateDuration(startDate, endDate);

    // Navigate to NewSchedule with dates, duration, and all original params
    navigation.navigate(ROUTES.NEWSCHEDUAL, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      duration: duration,
      // Pass all original route params to preserve unit and tenant data
      ...route.params,
      // Ensure current selected tenant is included
      selectedTenant: currentSelectedTenant,
    });
  };

  // Handle final contract save with API call
  const handleSaveContract = async () => {
    if (!currentUser._id) {
      Alert.alert('Error', 'User not authenticated. Please log in again.');
      return;
    }

    if (!currentSelectedTenant) {
      Alert.alert('Error', 'Please select a tenant');
      return;
    }

    if (!paymentScheduleCompleted || !paymentScheduleData) {
      Alert.alert('Error', 'Please create a payment schedule first');
      return;
    }

    try {
      const contractData = {
        paymentSchedule: [],
        property: propertyId._id || propertyId,
        unit: unitId,
        owner: currentUser._id,
        tenant: currentSelectedTenant._id || currentSelectedTenant.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        paymentFrequency: scheduleFormData.paymentFrequency.toLowerCase(),
        amount: {
          value: Number(paymentScheduleData.totalContractValue),
          currency: scheduleFormData.rentalPaymentInvoice.currency,
        },
        serviceCharge: {
          paymentType: 'fixed-amount',
          value: Number(scheduleFormData.serviceChargePerPayment.amount),
          currency: scheduleFormData.serviceChargePerPayment.currency,
        },

        VAT: {
          value: paymentScheduleData.totalVATAmount,
          currency: scheduleFormData.serviceChargePerPayment.currency,
          percentage: paymentScheduleData.vatPercentage,
        },
      };
      console.log(paymentScheduleData, 'paymentScheduleData');
      console.log(contractData, 'contractData');

      const response = await createContract(contractData).unwrap();
      console.log(response, 'response');

      // Invalidate Units cache to trigger fresh data fetch
      dispatch(apiSlice.util.invalidateTags(['Units']));

      Alert.alert('Success', 'Contract created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            if (contractType === 'property') {
              navigation.navigate('PropertyFlow', {
                screen: ROUTES.PROPERTY_DETAILS,
                params: {
                  propertyId: propertyId,
                },
              });
            } else {
              navigation.navigate('UnitsFlow', {
                screen: ROUTES.UNIT_DETAILS,
                params: {
                  unitId: route.params.unitId,
                },
              });
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error creating contract:', error);

      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to create contract. Please try again.',
        [{text: 'OK'}],
      );
    }
  };

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <View style={styles.topTextContainer}>
          <Text style={styles.topText}>
            Create a new contract by filling in the required field
          </Text>
        </View>

        <View style={styles.card}>
          <Image
            source={
              unitImage && typeof unitImage === 'string'
                ? {uri: unitImage}
                : unitImage
            }
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.unitName}>{unitName}</Text>
            <View style={styles.areaContainer}>
              <Text style={styles.areaIcon}>
                <Vector />
              </Text>
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
            {unitType
              ? unitType.charAt(0).toUpperCase() +
                unitType.slice(1).toLowerCase()
              : 'Unit'}
          </Text>
          <Text
            style={
              styles.propertyName
            }>{`Part of the property ( ${propertyPart} )`}</Text>
        </View>

        {/* Contract Dates Section */}
        <View style={styles.dateSection}>
          <View style={styles.dateLabelsRow}>
            <Text style={styles.dateLabel}>Start date*</Text>
            <Text style={styles.dateLabel2}>End date*</Text>
          </View>
          <View style={styles.dateRow}>
            <View style={styles.datePickerContainer}>
              <DatePicker value={startDate} onDateChange={setStartDate} />
            </View>
            <Text style={styles.dateSeparator}>-</Text>
            <View style={styles.datePickerContainer}>
              <DatePicker value={endDate} onDateChange={setEndDate} />
            </View>
            <Text style={styles.dateSeparator}>/</Text>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>
                {calculateDuration(startDate, endDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tenant Selection */}
        <View style={styles.tenantSection}>
          <Text style={styles.sectionLabel}>Tenant*</Text>
          <TouchableOpacity
            style={[
              styles.tenantButton,
              currentSelectedTenant && styles.tenantButtonSelected,
            ]}
            onPress={handleTenantOptionPress}>
            <Text
              style={[
                styles.tenantButtonText,
                currentSelectedTenant && styles.tenantButtonTextSelected,
              ]}>
              {currentSelectedTenant
                ? `${currentSelectedTenant.name}`.trim()
                : 'Add tenant'}
            </Text>
            <Text style={styles.dropdownIcon}>
              <DownIcon />
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tenant Options Modal */}
        <Modal
          visible={showTenantOptions}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTenantOptions(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowTenantOptions(false)}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleAddFromTenantList}>
                <Text style={styles.modalOptionText}>Add from tenant list</Text>
              </TouchableOpacity>
              <View style={styles.modalSeparator} />
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleAddNewTenant}>
                <Text style={styles.modalOptionText}>Add new tenant</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Payment Schedule */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionLabel}>Payment schedule*</Text>
          <TouchableOpacity
            style={[
              styles.scheduleButton,
              paymentScheduleCompleted && styles.scheduleButtonCompleted,
            ]}
            onPress={handlePaymentSchedulePress}>
            <Text
              style={[
                styles.scheduleButtonText,
                paymentScheduleCompleted && styles.scheduleButtonTextCompleted,
              ]}>
              {paymentScheduleCompleted ? 'Schedule Created' : 'Add Schedule'}
            </Text>
            <Text>
              <PlusIcon />
            </Text>
          </TouchableOpacity>
          <Text style={styles.scheduleDescription}>
            This tool helps you to generate a schedule of all the rents due
            using a simple tool. The application will allow you to follow-up on
            all rents due. You can always add, edit or delete payments
          </Text>
        </View>

        {/* Save Button */}
        <Button
          title={isCreatingContract ? 'Creating Contract...' : 'Save'}
          onPress={handleSaveContract}
          backgroundColor={COLORS.primary}
          titleColor="#331800"
          disabled={
            isCreatingContract ||
            !paymentScheduleCompleted ||
            !currentSelectedTenant
          }
        />
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
      color: theme === 'light' ? '#ADACB1' : '#ADACB1',
      fontSize: 16,
      fontWeight: '400',
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
    areaIcon: {
      fontSize: 16,
      marginTop: 5,
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
    // Date section styles
    dateSection: {
      width: '100%',
      marginTop: 20,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '100%',
    },
    datePickerContainer: {
      flex: 1,
      marginHorizontal: 5,
    },
    dateSeparator: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 10,
      marginBottom: 30,
    },
    durationContainer: {
      paddingVertical: safeGetResponsiveSpacing(16),
      paddingHorizontal: safeGetResponsiveSpacing(16),
      height: safeGetResponsiveSpacing(60),
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 100,
      marginBottom: 5,
      borderWidth: 1,
      borderRadius: 14,
      backgroundColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
      borderColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
    },
    durationText: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: safeGetResponsiveFontSize(10),
      fontWeight: '500',
      textAlign: 'center',
    },

    // Tenant section styles
    tenantSection: {
      width: '100%',
      marginTop: 20,
    },
    sectionLabel: {
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontSize: 14,
      fontWeight: '400',
      marginBottom: 8,
      marginLeft: 5,
    },
    tenantButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 16,
      backgroundColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
      borderColor: theme === 'light' ? COLORS.black : COLORS.CardBackground,
    },
    tenantButtonText: {
      color: theme === 'light' ? COLORS.black : '#F4F3F2',
      fontSize: 16,
    },
    tenantButtonSelected: {
      borderColor: '#4D9E70',
      borderWidth: 2,
    },
    tenantButtonTextSelected: {
      color: theme === 'light' ? COLORS.black : '#F4F3F2',
      fontWeight: '600',
    },
    dropdownIcon: {
      color: theme === 'light' ? COLORS.black : '#F4F3F2',
      fontSize: 18,
      fontWeight: 'bold',
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
      borderRadius: 12,
      padding: 0,
      minWidth: 200,
      maxWidth: 300,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalOption: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    modalOptionText: {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontSize: 16,
      fontWeight: '500',
    },
    modalSeparator: {
      height: 1,
      backgroundColor: theme === 'light' ? '#E0E0E0' : '#333',
      marginHorizontal: 0,
    },

    // Payment section styles
    paymentSection: {
      width: '100%',
      marginTop: 20,
    },
    scheduleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 16,
      backgroundColor:
        theme === 'light' ? COLORS.BackgroundLightGray : COLORS.CardBackground,
      borderColor: theme === 'light' ? COLORS.black : COLORS.CardBackground,
    },
    scheduleButtonText: {
      color: theme === 'light' ? COLORS.black : '#F4F3F2',
      fontSize: 16,
    },

    scheduleDescription: {
      color: theme === 'light' ? '#666' : '#ADACB1',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 10,
      paddingHorizontal: 5,
    },
    // Completed payment schedule styles
    scheduleButtonCompleted: {
      borderColor: '#4D9E70',
      borderWidth: 2,
    },
    scheduleButtonTextCompleted: {
      fontWeight: '600',
    },
    plusIconCompleted: {
      color: '#4D9E70',
    },
    // Date labels styles
    dateLabelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    dateLabel: {
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontSize: 14,
      fontWeight: '400',
      flex: 1,
      marginHorizontal: 5,
    },
    dateLabel2: {
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontSize: 14,
      fontWeight: '400',
      flex: 1,
      marginRight: 70,
    },
  });

export default AddContract;
