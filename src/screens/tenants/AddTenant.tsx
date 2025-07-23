import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ThemeState} from '../../app/redux/themeSlice';
import {useSelector} from 'react-redux';
import {COLORS, ROUTES} from '../../lib/constants';
import Input from '../../components/input';
import Button from '../../components/Button';
import {StackNavigationProp} from '@react-navigation/stack';
import {SocialButton} from '../../components/SocialButton';
import {RootState, useAppSelector} from '../../app/redux/store';
import {useCreateTenantMutation} from '../../app/services/api/tenants';
import {asyncHandler} from 'async-handler-ts';

interface AddTenantProps {
  navigation: StackNavigationProp<any, any>;
  route?: any;
}
const AddTenant: React.FC<AddTenantProps> = ({navigation, route}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputAddress, setInputAddress] = useState('');

  const [inputVatNumber, setInputVatNumber] = useState('');
  const [inputAdditional, setInputAdditional] = useState('');

  const [regTenant] = useCreateTenantMutation();

  const handleAddTenant = async () => {
    const [result, error] = await asyncHandler(
      regTenant({
        name: {
          firstName: inputFirstName,
          lastName: inputLastName,
        },
        phone: inputPhone,
        email: inputEmail,
        location: inputAddress,
        VAT: inputVatNumber,
        notes: inputAdditional,
      }).unwrap(),
    );

    if (error) {
      return error;
    }

    // Check if we came from AddContract
    const returnTo = route?.params?.returnTo;
    const originalParams = route?.params?.originalParams;

    if (returnTo === 'AddContract' && result) {
      // Create tenant object from form data since API only returns token
      const newTenant = {
        _id: Date.now().toString(), // Temporary ID
        name: {
          firstName: inputFirstName,
          lastName: inputLastName,
        },
        phone: inputPhone,
        email: inputEmail,
        location: inputAddress,
        VAT: inputVatNumber,
        notes: inputAdditional,
      };

      // Navigate back to AddContract with the newly created tenant
      navigation.navigate(ROUTES.ADDCONTRACT, {
        ...originalParams,
        selectedTenant: newTenant,
      });
    } else {
      // Default behavior - go to tenants list
      navigation.navigate(ROUTES.TENANTS);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <View style={styles.inputscontainer}>
            <Text style={styles.textStarted}>
              We'll use this to create a new tenant contact.
            </Text>
            <ScrollView>
              <Input
                label="First name"
                value={inputFirstName}
                onChangeText={setInputFirstName}
                placeholder="Enter first name"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
              />
              <Input
                label="Last name"
                value={inputLastName}
                onChangeText={setInputLastName}
                placeholder="Enter last name"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
              />
              <Input
                label="Phone"
                value={inputPhone}
                onChangeText={setInputPhone}
                placeholder="Enter phone number"
                keyboardType="number-pad"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
              />
              <Input
                label="Email"
                value={inputEmail}
                onChangeText={setInputEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
              />
              <Input
                label="Address"
                value={inputAddress}
                onChangeText={setInputAddress}
                placeholder="Enter tenant’s address"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
              />
              <Input
                label="VAT number"
                value={inputVatNumber}
                onChangeText={setInputVatNumber}
                placeholder="Enter VAT number"
                keyboardType="number-pad"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
              />
              <Input
                label="Additional information"
                value={inputAdditional}
                onChangeText={setInputAdditional}
                placeholder="Enter Additional information"
                keyboardType="default"
                borderColor={theme === 'dark' ? '#24232A' : 'white'}
                labelStyle={styles.label}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'grey'}
              />
            </ScrollView>
            <View style={styles.btnSave}>
              <Button
                title="Next"
                onPress={handleAddTenant}
                backgroundColor={COLORS.primary}
                titleColor="#331800"
                borderColor={theme === 'dark' ? COLORS.primary : COLORS.white}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
// backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    avoidView: {flex: 1},
    parentContainer: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.black : '#383642',
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
    inputscontainer: {
      flex: 1,
      top: 30,
    },
    textStarted: {
      marginBottom: 20,
      marginTop: 5,
      left: 10,
      color: '#7E7D86',
    },
    btnSave: {
      marginBottom: 40,
      paddingBottom: 10,
    },
  });

export default AddTenant;
