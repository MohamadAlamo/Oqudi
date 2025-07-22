import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {COLORS, ROUTES} from '../../lib/constants';
import {RootState} from '../../app/redux/store';
import {useSelector} from 'react-redux';
import {ThemeState} from '../../app/redux/themeSlice';
import {useForm, Controller} from 'react-hook-form';
import Input from '../../components/input';
import Button from '../../components/Button';
import PhotoUploader from '../../components/PhotoUploader';
import SvgMapLight from '../../assets/icons/MapLight.svg';
import SvgMapDark from '../../assets/icons/MapDark.svg';
import MapModal from './components/MapModal';
import StructPicker from './components/StructPicker';
import {
  LEASE_TYPE,
  TAddPropertyRequest,
  TLeaseType,
  TUnitTypes,
} from '../../app/services/api/properties/types';
import {useCreatePropertyMutation} from '../../app/services/api/properties';

interface AddPropertyProps {
  navigation: StackNavigationProp<any, any>;
}

const AddProperty: React.FC<AddPropertyProps> = ({navigation}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);
  const SvgMap = theme === 'dark' ? SvgMapLight : SvgMapDark;
  const [createFn] = useCreatePropertyMutation();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm<TAddPropertyRequest>({
    defaultValues: {
      name: '',
      location: '',
      pictures: [] as string[],
      leaseType: LEASE_TYPE.units,
    },
  });
  const values = watch();
  const selection = values.leaseType;
  const selectedPropertyTypes = values.types;
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);

  const handlePhotoSelected = (photo: string | null) => {
    if (photo) {
      // Add the photo to the pictures array
      setValue('pictures', [photo]);
    } else {
      // Remove photo if null (user removed it)
      setValue('pictures', []);
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setValue('location', `${location.latitude}, ${location.longitude}`);
  };

  const onSubmit = async (data: any) => {
    if (selection === LEASE_TYPE.whole && selectedPropertyTypes?.length === 0) {
      console.log(
        'Please select at least one property type for "oneRentalArea"',
      );
      return;
    }
    console.log('Dataaaaaaa', data);

    createFn(data)
      .then(dataNew => {
        console.log('success dataNew Hererererer', dataNew);
        navigation.navigate(ROUTES.PROPERTIES);
        console.log('Latest Data', data);
      })
      .catch(dataNew => {
        console.log('error', dataNew);
      });
  };

  const handleSelectionChange = (
    selected: TLeaseType,
    selectedTypes: TUnitTypes[],
  ) => {
    setValue('leaseType', selected);
    setValue('types', selectedTypes);
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
              </View>

              {/* Property Name Input */}
              <Controller
                control={control}
                name="name"
                rules={{required: 'Property name is required'}}
                render={({field: {onChange, value}}) => (
                  <Input
                    label="Property name*"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter Property name"
                    keyboardType="default"
                    borderColor={theme === 'dark' ? '#24232A' : 'white'}
                    labelStyle={styles.label}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}

              {/* Property Location Input */}
              <Controller
                control={control}
                name="location"
                rules={{required: 'Property location is required'}}
                render={({field: {onChange, value}}) => (
                  <Input
                    label="Property location*"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter property location"
                    keyboardType="default"
                    borderColor={theme === 'dark' ? '#24232A' : 'white'}
                    labelStyle={styles.label}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
                  />
                )}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location.message}</Text>
              )}

              <TouchableOpacity onPress={() => setIsMapVisible(true)}>
                <SvgMap style={styles.svgMap} />
                <Text style={styles.textView}>View on map</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.structPicker}>
              <StructPicker onSelectionChange={handleSelectionChange} />
            </View>

            <View>
              <Button
                title="Save"
                onPress={handleSubmit(onSubmit)}
                backgroundColor={COLORS.primary}
                titleColor="#331800"
                disabled={
                  !selectedPropertyTypes?.length &&
                  selection === LEASE_TYPE.whole
                }
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
      color: 'red',
      fontSize: 12,
      marginLeft: 5,
    },
  });

export default AddProperty;
