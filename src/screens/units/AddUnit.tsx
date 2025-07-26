import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/redux/store';
import {ThemeState} from '../../app/redux/themeSlice';
import {TUnitTypes} from '../../app/services/api/properties/types';
import {useCreateUnitMutation} from '../../app/services/api/units';
import Button from '../../components/Button';
import Input from '../../components/input';
import PhotoUploader from '../../components/PhotoUploader';
import {COLORS, ROUTES} from '../../lib/constants';
import SelectType from './components/SelectType';
import {asyncHandler} from 'async-handler-ts';

type AddUnitRouteProp = RouteProp<
  {
    AddUnit: {
      propertyId: string;
      propertyName: string;
      propertyImage: string;
      propertyLocation: string;
    };
  },
  'AddUnit'
>;

interface AddUnitProps {
  navigation: StackNavigationProp<any, any>;
  route: AddUnitRouteProp;
}

const AddUnit: React.FC<AddUnitProps> = ({navigation, route}) => {
  const {propertyId, propertyName, propertyImage, propertyLocation} =
    route.params;
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const [createFn, {isLoading}] = useCreateUnitMutation();

  // Form state
  const [unitName, setUnitName] = useState<string>('');
  const [unitSize, setUnitSize] = useState<string>('');
  const [unitType, setUnitType] = useState<TUnitTypes | null>(null);
  const [unitNotes, setUnitNotes] = useState<string>('');
  const [unitPictures, setUnitPictures] = useState<string[]>([]);

  // Error states
  const [nameError, setNameError] = useState<boolean>(false);
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [typeError, setTypeError] = useState<boolean>(false);
  const [pictureError, setPictureError] = useState<boolean>(false);

  // Validation functions
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateSize = (size: string): boolean => {
    const numericSize = parseFloat(size);
    return !isNaN(numericSize) && numericSize > 0;
  };

  const validateType = (type: TUnitTypes | null): boolean => {
    return type !== null;
  };

  const validatePictures = (pictures: string[]): boolean => {
    return pictures.length > 0;
  };

  // Handle input changes with validation
  const handleNameChange = (text: string) => {
    setUnitName(text);
    if (text.length > 0) {
      setNameError(!validateName(text));
    } else {
      setNameError(false);
    }
  };

  const handleSizeChange = (text: string) => {
    setUnitSize(text);
    if (text.length > 0) {
      setSizeError(!validateSize(text));
    } else {
      setSizeError(false);
    }
  };

  const handleNotesChange = (text: string) => {
    setUnitNotes(text);
  };

  const handleTypeSelection = useCallback((selectedType: TUnitTypes) => {
    setUnitType(selectedType);
    setTypeError(false);
  }, []);

  const handlePhotoSelected = (photo: string | null) => {
    if (photo) {
      setUnitPictures([photo]);
      setPictureError(false);
    } else {
      setUnitPictures([]);
    }
  };

  const handleSave = async () => {
    // Validate inputs before API call
    const isNameValid = validateName(unitName);
    const isSizeValid = validateSize(unitSize);
    const isTypeValid = validateType(unitType);
    const isPicturesValid = validatePictures(unitPictures);

    // Set validation errors
    setNameError(!isNameValid && unitName.length > 0);
    setSizeError(!isSizeValid && unitSize.length > 0);
    setTypeError(!isTypeValid);
    setPictureError(!isPicturesValid);

    // Check if inputs are empty
    if (!unitName.trim()) {
      setNameError(true);
      Alert.alert('Error', 'Unit name is required');
      return;
    }

    if (!unitSize.trim()) {
      setSizeError(true);
      Alert.alert('Error', 'Unit area size is required');
      return;
    }

    if (!unitType) {
      setTypeError(true);
      Alert.alert('Error', 'Unit type is required');
      return;
    }

    if (unitPictures.length === 0) {
      setPictureError(true);
      Alert.alert('Error', 'Unit photo is required');
      return;
    }

    // Check validation
    if (!isNameValid || !isSizeValid || !isTypeValid || !isPicturesValid) {
      Alert.alert('Validation Error', 'Please fix the errors above');
      return;
    }

    const [result, error] = await asyncHandler(
      createFn({
        name: unitName,
        size: unitSize,
        type: unitType,
        notes: unitNotes ? [unitNotes] : [],
        pictures: unitPictures,
        property: propertyId,
      }).unwrap(),
    );

    if (error) {
      console.log({error});
      let errorMessage = 'Failed to create unit. Please try again';

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
    navigation.navigate(ROUTES.PROPERTY_DETAILS, {
      propertyId,
      propertyName,
      propertyImage,
      propertyLocation,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -160 : -180}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View>
              <View style={styles.uploadPhoto}>
                <Text style={styles.PhotoText}>Add photo of the unit*</Text>
                <PhotoUploader onPhotoSelected={handlePhotoSelected} />
                {pictureError && (
                  <Text style={styles.errorText}>Photo is required</Text>
                )}
              </View>

              <Input
                label="Unit name/ number*"
                value={unitName}
                onChangeText={handleNameChange}
                placeholder="Enter unit name/ number"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={nameError}
                success={unitName.length > 0 && !nameError}
              />

              <SelectType onSelectionChange={handleTypeSelection} />
              {typeError && (
                <Text style={styles.errorText}>Unit type is required</Text>
              )}

              <Input
                label="Unit area size*"
                value={unitSize}
                onChangeText={handleSizeChange}
                placeholder="Enter unit area size"
                keyboardType="numeric"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                error={sizeError}
                success={unitSize.length > 0 && !sizeError}
              />

              <Input
                label="Notes"
                value={unitNotes}
                onChangeText={handleNotesChange}
                placeholder="Enter any additional information"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? '#7E7D86' : '#7E7D86'}
                numberOfLines={4}
                maxLength={200}
                multiline={true}
              />
            </View>

            <View style={styles.saveContainer}>
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
    </KeyboardAvoidingView>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    avoidView: {flex: 1},
    scrollView: {},
    parentContainer: {
      flex: 1,
      backgroundColor: '#383642',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
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
    PhotoText: {
      color: theme === 'light' ? '#7E7D86' : '#ADACB1',
      marginLeft: 15,
      marginBottom: 15,
    },
    uploadPhoto: {
      marginTop: 20,
    },
    errorText: {
      color: COLORS.Delete || 'red',
      fontSize: 12,
      marginLeft: 15,
      marginTop: 5,
    },
    saveContainer: {
      marginBottom: 10,
    },
  });

export default AddUnit;
