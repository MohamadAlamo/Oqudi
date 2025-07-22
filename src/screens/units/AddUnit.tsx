import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
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
import {TAddUnitRequest} from '../../app/services/api/units/types';
import Button from '../../components/Button';
import Input from '../../components/input';
import PhotoUploader from '../../components/PhotoUploader';
import {COLORS, ROUTES} from '../../lib/constants';
import SelectType from './components/SelectType';

type AddUnitRouteProp = RouteProp<
  {
    params: {
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
  route: AddUnitRouteProp; // Add route prop here
}

const AddUnit: React.FC<AddUnitProps> = ({navigation, route}) => {
  const {propertyId, propertyName, propertyImage, propertyLocation} =
    route.params;
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const [createFn, {isLoading, isSuccess, isError}] = useCreateUnitMutation();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm<TAddUnitRequest>({});
  const values = watch();

  const handlePhotoSelected = (photo: string | null) => {
    if (!photo) return;

    setValue('pictures', [photo]);
  };
  console.log(errors, 'error');

  const onSubmit = async (data: TAddUnitRequest) => {
    console.log(data);

    createFn({
      ...data,
      property: propertyId,
    }).then(console.log);
  };

  const handleSelectionChange = useCallback((selectedType: TUnitTypes) => {
    setValue('type', selectedType);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate(ROUTES.PROPERTY_DETAILS, {
        propertyId,
        propertyName,
        propertyImage,
        propertyLocation,
      });
    }
  }, [isSuccess]);

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
              </View>

              <Controller
                control={control}
                name="name"
                rules={{required: 'Property name is required'}}
                render={({field: {onChange, value}}) => (
                  <Input
                    label="Unit name/ number*"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter unit name/ number"
                    keyboardType="default"
                    borderColor={theme === 'dark' ? '#24232A' : 'white'}
                    labelStyle={styles.label}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
                  />
                )}
              />
              {/* <Controller
                control={control}
                name="floor"
                rules={{required: 'floor'}}
                render={({field: {onChange, value}}) => (
                  <Input
                    label="floor"
                    value={value + ''}
                    onChangeText={onChange}
                    placeholder="floor"
                    keyboardType="default"
                    borderColor={theme === 'dark' ? '#24232A' : 'white'}
                    labelStyle={styles.label}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
                  />
                )}
              />
              <Controller
                control={control}
                name="door"
                rules={{required: 'door'}}
                render={({field: {onChange, value}}) => (
                  <Input
                    label="door"
                    value={value + ''}
                    onChangeText={onChange}
                    placeholder="door"
                    keyboardType="default"
                    borderColor={theme === 'dark' ? '#24232A' : 'white'}
                    labelStyle={styles.label}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
                  />
                )}
              /> */}
              <SelectType onSelectionChange={handleSelectionChange} />

              <Controller
                control={control}
                name="size"
                rules={{required: 'Unit area size is required'}}
                render={({field: {onChange, value}}) => (
                  <Input
                    label="Unit area size"
                    value={value + ''}
                    onChangeText={onChange}
                    placeholder="Enter unit area size "
                    keyboardType="default"
                    borderColor={theme === 'dark' ? '#24232A' : 'white'}
                    labelStyle={styles.label}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
                  />
                )}
              />

              <Controller
                control={control}
                name="notes"
                render={({field: {onChange, value}}) => (
                  <Input
                    label="Notes"
                    value={value + ''}
                    onChangeText={onChange}
                    placeholder="Enter any additional information"
                    keyboardType="default"
                    borderColor={theme === 'dark' ? '#24232A' : 'white'}
                    labelStyle={styles.label}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
                    numberOfLines={4}
                    maxLength={40}
                    multiline={true}
                  />
                )}
              />
            </View>

            <View style={styles.saveContainer}>
              <Button
                title="Save"
                onPress={handleSubmit(onSubmit)}
                backgroundColor={COLORS.primary}
                titleColor="#331800"
                disabled={!!Object.keys(errors).length || isLoading}
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
    saveContainer: {
      marginBottom: 10,
    },
    unit: {
      marginLeft: 10,
      fontSize: 16,
      color: 'black',
    },
    input: {
      height: 100,
    },
  });

export default AddUnit;
