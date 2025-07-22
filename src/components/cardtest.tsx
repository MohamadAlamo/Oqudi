import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RootState} from '../app/redux/store';
import {useSelector} from 'react-redux';
import NameIcon from '../assets/icons/Profile.svg';

type ContactCardProps = {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  vatNumber: string;
  onEdit: () => void;
  onDelete: () => void;
};

export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  phoneNumber,
  email,
  address,
  vatNumber,
  onEdit,
  onDelete,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <NameIcon style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.row}>
        <NameIcon style={styles.icon} />
        <Text style={styles.info}>{phoneNumber}</Text>
      </View>
      <View style={styles.row}>
        <NameIcon style={styles.icon} />
        <Text style={styles.info}>{email}</Text>
      </View>
      <View style={styles.row}>
        <NameIcon style={styles.icon} />
        <Text style={styles.info}>{address}</Text>
      </View>
      <View style={styles.rowVat}>
        <Text style={styles.info}>{vatNumber}</Text>
      </View>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.button}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const lightStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    height: 260,
    width: 400,
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowVat: {
    marginTop: 15,
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
    fontWeight: '600',
    lineHeight: 14,
  },
  info: {
    marginLeft: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FFD1D1',
    padding: 10,
    borderRadius: 5,
  },
});
const darkStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowVat: {},

  icon: {},
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    fontSize: 16,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FFD1D1',
    padding: 10,
    borderRadius: 5,
  },
});
export default ContactCard;
