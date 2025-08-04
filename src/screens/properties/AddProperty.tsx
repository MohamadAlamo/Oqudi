import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {COLORS, ROUTES} from '../../lib/constants';
import {RootState} from '../../app/redux/store';
import {useSelector} from 'react-redux';
import {ThemeState} from '../../app/redux/themeSlice';
import Input from '../../components/input';
import Button from '../../components/Button';
import PhotoUploader from '../../components/PhotoUploader';
import SvgMapLight from '../../assets/icons/MapLight.svg';
import SvgMapDark from '../../assets/icons/MapDark.svg';
import MapModal from './components/MapModal';
import StructPicker from './components/StructPicker';
import {
  LEASE_TYPE,
  TLeaseType,
  TUnitTypes,
} from '../../app/services/api/properties/types';
import {useCreatePropertyMutation} from '../../app/services/api/properties';
import {useFormExitConfirmation} from '../../lib/hooks/useFormExitConfirmation';
import {asyncHandler} from 'async-handler-ts';

interface AddPropertyProps {
  navigation: StackNavigationProp<any, any>;
}

const AddProperty: React.FC<AddPropertyProps> = ({navigation}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const [createFn, {isLoading}] = useCreatePropertyMutation();
  const SvgMap = theme === 'dark' ? SvgMapLight : SvgMapDark;

  // Use form exit confirmation hook - navigate back to Properties list on discard
  useFormExitConfirmation({
    navigation,
    targetRoute: 'BottomTabs',
    targetParams: {screen: ROUTES.PROPERTIES},
  });
  // Form state
  const [propertyName, setPropertyName] = useState<string>('');
  const [propertyLocation, setPropertyLocation] = useState<string>('');
  const [propertyPictures, setPropertyPictures] = useState<string[]>([]);
  const [leaseType, setLeaseType] = useState<TLeaseType>(LEASE_TYPE.units);
  const [propertyTypes, setPropertyTypes] = useState<TUnitTypes[]>([]);

  // Error states
  const [nameError, setNameError] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<boolean>(false);
  const [pictureError, setPictureError] = useState<boolean>(false);
  const [typesError, setTypesError] = useState<boolean>(false);

  // Modal state
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);

  // Validation functions
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateLocation = (location: string): boolean => {
    return location.trim().length >= 3;
  };

  const validatePictures = (pictures: string[]): boolean => {
    return pictures.length > 0;
  };

  const validatePropertyTypes = (
    types: TUnitTypes[],
    lease: TLeaseType,
  ): boolean => {
    if (lease === LEASE_TYPE.whole) {
      return types.length > 0;
    }
    return true; // Not required for units lease type
  };

  // Handle input changes with validation
  const handleNameChange = (text: string) => {
    setPropertyName(text);
    if (text.length > 0) {
      setNameError(!validateName(text));
    } else {
      setNameError(false);
    }
  };

  const handleLocationChange = (text: string) => {
    setPropertyLocation(text);
    if (text.length > 0) {
      setLocationError(!validateLocation(text));
    } else {
      setLocationError(false);
    }
  };

  const handlePhotoSelected = (photo: string | null) => {
    if (photo) {
      setPropertyPictures([photo]);
      setPictureError(false);
    } else {
      setPropertyPictures([]);
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
  }) => {
    const locationString = `${location.latitude}, ${location.longitude}`;
    setPropertyLocation(locationString);
    setLocationError(false);
    setIsMapVisible(false);
  };

  const handleSelectionChange = (
    selected: TLeaseType,
    selectedTypes: TUnitTypes[],
  ) => {
    setLeaseType(selected);
    setPropertyTypes(selectedTypes);

    // Clear types error when selection changes
    if (selected === LEASE_TYPE.units || selectedTypes.length > 0) {
      setTypesError(false);
    }
  };

  const handleSave = async () => {
    // Validate inputs before API call
    const isNameValid = validateName(propertyName);
    const isLocationValid = validateLocation(propertyLocation);
    const isPicturesValid = validatePictures(propertyPictures);
    const isTypesValid = validatePropertyTypes(propertyTypes, leaseType);

    // Set validation errors
    setNameError(!isNameValid && propertyName.length > 0);
    setLocationError(!isLocationValid && propertyLocation.length > 0);
    setPictureError(!isPicturesValid);
    setTypesError(!isTypesValid);

    // Check if inputs are empty
    if (!propertyName.trim()) {
      setNameError(true);
      Alert.alert('Error', 'Property name is required');
      return;
    }

    if (!propertyLocation.trim()) {
      setLocationError(true);
      Alert.alert('Error', 'Property location is required');
      return;
    }

    if (propertyPictures.length === 0) {
      setPictureError(true);
      Alert.alert('Error', 'Property photo is required');
      return;
    }

    if (leaseType === LEASE_TYPE.whole && propertyTypes.length === 0) {
      setTypesError(true);
      Alert.alert(
        'Error',
        'Please select at least one property type for whole property lease',
      );
      return;
    }

    // Check validation
    if (!isNameValid || !isLocationValid || !isPicturesValid || !isTypesValid) {
      Alert.alert('Validation Error', 'Please fix the errors above');
      return;
    }

    const requestData = {
      name: propertyName,
      location: propertyLocation,
      pictures: propertyPictures,
      leaseType: leaseType,
      ...(leaseType === LEASE_TYPE.whole && {types: propertyTypes}),
    };

    const [result, error] = await asyncHandler(createFn(requestData).unwrap());

    if (error) {
      console.log({error});
      let errorMessage = 'Failed to create property. Please try again';

      // Handle different types of API errors
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 400) {
          errorMessage = 'Please check your information';
        } else if (apiError.status === 500) {
          errorMessage = 'Server error. Please try again later';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Creation Failed', errorMessage);
      return;
    }

    console.log({result});
    navigation.navigate('BottomTabs', {
      screen: ROUTES.PROPERTIES,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : -180}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View>
              <View style={styles.uploadPhoto}>
                <Text style={styles.PhotoText}>Add photo of the property*</Text>
                <PhotoUploader onPhotoSelected={handlePhotoSelected} />
                {pictureError && (
                  <Text style={styles.errorText}>Photo is required</Text>
                )}
              </View>

              <Input
                label="Property name*"
                value={propertyName}
                onChangeText={handleNameChange}
                placeholder="Enter Property name"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={nameError}
                success={propertyName.length > 0 && !nameError}
              />

              <Input
                label="Property location*"
                value={propertyLocation}
                onChangeText={handleLocationChange}
                placeholder="Enter property location"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={locationError}
                success={propertyLocation.length > 0 && !locationError}
              />

              <TouchableOpacity onPress={() => setIsMapVisible(true)}>
                <SvgMap style={styles.svgMap} />
                <Text style={styles.textView}>View on map</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.structPicker}>
              <StructPicker onSelectionChange={handleSelectionChange} />
              {typesError && (
                <Text style={styles.errorText}>
                  Property types are required for whole property lease
                </Text>
              )}
            </View>

            <View>
              <Button
                title={isLoading ? 'Saving...' : 'Save'}
                onPress={handleSave}
                backgroundColor={COLORS.primary}
                titleColor="#331800"
                disabled={isLoading}
              />
            </View>
          </ScrollView>
        </View>
      </View>

      <MapModal
        visible={isMapVisible}
        onClose={() => setIsMapVisible(false)}
        onSelectLocation={handleLocationSelect}
      />
    </KeyboardAvoidingView>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    avoidView: {flex: 1},
    scrollView: {marginBottom: 100},
    parentContainer: {
      flex: 1,
      backgroundColor: '#383642',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
    },
    label: {
      marginLeft: 5,
      marginBottom: 5,
      color: theme === 'light' ? '#24232A' : '#ADACB1',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 20,
    },
    textView: {
      marginTop: -20,
      left: 38,
      color: theme === 'light' ? COLORS.black : '#ADACB1',
      fontWeight: '400',
      fontSize: 14,
    },
    PhotoText: {
      color: theme === 'light' ? '#7E7D86' : '#ADACB1',
      marginLeft: 15,
      marginBottom: 15,
    },
    uploadPhoto: {
      marginTop: 20,
    },
    svgMap: {
      marginLeft: 10,
    },
    structPicker: {
      marginTop: 15,
    },
    errorText: {
      color: COLORS.Delete || 'red',
      fontSize: 12,
      marginLeft: 15,
      marginTop: 5,
    },
  });

export default AddProperty;
