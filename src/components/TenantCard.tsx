import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import NameIcon from '../assets/icons/Profile.svg';

import PhoneIcon from '../assets/icons/Phone.svg';
import MailIcon from '../assets/icons/Mail.svg';
import LocationIcon from '../assets/icons/Location.svg';
import {COLORS} from '../lib/constants';

type ContactCardProps = {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  vatNumber: string;
  onEdit: () => void;
  onDelete: () => void;
  onPress?: () => void;
  selectionMode?: boolean;
};

export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  phoneNumber,
  email,
  address,
  vatNumber,
  onEdit,
  onDelete,
  onPress,
  selectionMode,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const CardWrapper = selectionMode ? TouchableOpacity : View;
  const cardProps = selectionMode ? {onPress, activeOpacity: 0.7} : {};

  return (
    <CardWrapper style={styles.card} {...cardProps}>
      {!selectionMode && (
        <>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
      {selectionMode && (
        <View style={styles.selectionIndicator}>
          <Text style={styles.selectionText}>Tap to select</Text>
        </View>
      )}
      <View style={styles.row}>
        <NameIcon style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.row}>
        <PhoneIcon style={styles.icon} />
        <Text style={styles.info}>{phoneNumber}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <MailIcon style={styles.icon} />
        <Text style={styles.info}>{email}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <LocationIcon style={styles.icon} />
        <Text style={styles.infoAddress}>{address}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.rowVat}>
        <Text style={styles.info}>VAT {vatNumber}</Text>
      </View>
    </CardWrapper>
  );
};

const lightStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    height: 280,
    width: 400,
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginVertical: 6,
    top: 10,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  deleteButtonText: {
    color: COLORS.Delete,
    fontSize: 14,
  },
  divider: {
    borderBottomWidth: 0.4,
    borderBottomColor: '#ADACB1',
    marginTop: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowVat: {
    marginTop: 10,
    marginLeft: -10,
  },
  icon: {
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    marginLeft: 20,
    marginTop: 5,
    color: '#24232A',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  info: {
    marginLeft: 20,
    fontSize: 16,
    color: COLORS.black,
  },
  infoAddress: {
    marginLeft: 20,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    color: COLORS.black,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  selectionText: {
    color: '#331800',
    fontSize: 12,
    fontWeight: '600',
  },
});
const darkStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CardBackground,
    height: 280,
    width: 400,
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginVertical: 6,
    top: 10,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  deleteButtonText: {
    color: COLORS.Delete,
    fontSize: 14,
  },
  divider: {
    borderBottomWidth: 0.4,
    borderBottomColor: '#ADACB1',
    marginTop: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowVat: {
    marginTop: 10,
    marginLeft: -10,
  },
  icon: {
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    marginLeft: 20,
    marginTop: 5,
    color: COLORS.white,
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  info: {
    marginLeft: 20,
    fontSize: 16,
    color: COLORS.white,
  },
  infoAddress: {
    marginLeft: 20,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    color: COLORS.white,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  selectionText: {
    color: '#331800',
    fontSize: 12,
    fontWeight: '600',
  },
});
export default ContactCard;
