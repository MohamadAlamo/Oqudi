import React, {useMemo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/redux/store';
import {ThemeState} from '../../../app/redux/themeSlice';
import {COLORS} from '../../../lib/constants';
import Button from '../../../components/Button';

import NameIcon from '../../../assets/icons/Profile.svg';
import PhoneIcon from '../../../assets/icons/Phone.svg';
import MailIcon from '../../../assets/icons/Mail.svg';

interface ContractInfoProps {
  contractData: any; // The contract data from currentUnitData.contracts[0]
  tenantData?: any; // The tenant data fetched by ID
}

const ContractInfo: React.FC<ContractInfoProps> = ({
  contractData,
  tenantData,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const calculateContractDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  console.log(contractData, 'contractData');

  return (
    <>
      <View style={styles.revenueContainer}>
        <Text style={styles.revenueText}>Total for the full contract</Text>
        <Text style={styles.revenueNumber}>
          {`${contractData.amount.value.toLocaleString()} ${
            contractData.amount.currency
          }`}
        </Text>
      </View>

      <View style={styles.contractInfoContainer}>
        <View style={styles.contractHeader}>
          <Text style={styles.contractTitle}>Contract information</Text>
          <Text style={styles.editText}>Edit</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.tenantInfo}>
          <View style={styles.tenantRow}>
            <Text style={styles.iconText}>
              <NameIcon style={styles.icon} />
            </Text>
            <Text style={styles.tenantName}>
              {tenantData ? `${tenantData.name}` : 'Loading...'}
            </Text>
          </View>

          <View style={styles.tenantRow}>
            <Text style={styles.iconText}>
              <PhoneIcon style={styles.icon} />
            </Text>
            <Text style={styles.contactInfo}>{tenantData?.phone || 'N/A'}</Text>
          </View>

          <View style={styles.tenantRow}>
            <Text style={styles.iconText}>
              <MailIcon style={styles.icon} />
            </Text>
            <Text style={styles.contactInfo}>{tenantData?.email || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.contractDates}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Contract start date*</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>
                {new Date(contractData.startDate)
                  .toLocaleDateString('en-GB')
                  .replace(/\//g, '.')}
              </Text>
            </View>
          </View>
          <Text style={styles.dateSeparator}>-</Text>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Contract start date*</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>
                {new Date(contractData.endDate)
                  .toLocaleDateString('en-GB')
                  .replace(/\//g, '.')}
              </Text>
            </View>
          </View>
          <Text style={styles.dateSeparator}>/</Text>
          <View style={styles.dateColumn}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>
                {calculateContractDuration(
                  contractData?.startDate,
                  contractData?.endDate,
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.paymentInfo}>
          <View style={styles.paymentRow}>
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentLabel}>Payment Frequency</Text>
              <Text style={styles.paymentValue}>
                {contractData.paymentFrequency.charAt(0).toUpperCase() +
                  contractData.paymentFrequency.slice(1)}
              </Text>
            </View>
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentLabel}>№ of payments</Text>
              <Text style={styles.paymentValue}>
                {contractData.paymentSchedule.length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalValue}>
          <Text style={styles.totalLabel}>Total contract value</Text>
          <View style={styles.totalAmountRow}>
            <Text style={styles.totalAmount}>
              {`${
                contractData.amount.currency
              } ${contractData.amount.value.toLocaleString()} `}
            </Text>
            <Text style={styles.deleteText}>Delete</Text>
          </View>
          <Text style={styles.vatAmount}>
            +
            {`${
              contractData.VAT.currency
            } ${contractData.VAT.value.toLocaleString()} `}{' '}
            VAT
          </Text>
        </View>
      </View>

      <Button
        title="End Contract"
        onPress={() => {
          console.log('End contract pressed');
        }}
        backgroundColor={COLORS.BackgroundLightGray}
        titleColor={COLORS.black}
        borderColor={theme === 'dark' ? COLORS.primary : COLORS.black}
        // disabled={isLoading}
      />
    </>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    revenueContainer: {
      backgroundColor: COLORS.primary,
      borderRadius: 10,
      padding: 20,
      marginTop: 20,
      justifyContent: 'center',
      width: '100%',
    },
    revenueText: {
      fontSize: 16,
      color: '#000',
    },
    revenueNumber: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 10,
      color: '#000000',
    },
    contractInfoContainer: {
      backgroundColor: theme === 'light' ? '#F8F8F8' : '#2A2A2A',
      borderRadius: 15,
      padding: 20,
      marginTop: 20,
      width: '100%',
      borderWidth: 1,
      borderColor: theme === 'light' ? '#E0E0E0' : '#404040',
    },
    contractHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    contractTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme === 'light' ? COLORS.black : COLORS.white,
    },
    editText: {
      fontSize: 16,
      color: COLORS.primary,
    },
    tenantInfo: {
      marginBottom: 20,
    },
    tenantRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconText: {
      fontSize: 16,
      marginRight: 12,
    },
    icon: {
      width: 16,
      height: 16,
    },
    tenantName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'light' ? COLORS.black : COLORS.white,
    },
    contactInfo: {
      fontSize: 14,
      color: theme === 'light' ? '#666' : '#BBB',
    },
    contractDates: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 20,
      justifyContent: 'space-between',
    },
    dateColumn: {
      flex: 1,
    },
    dateLabel: {
      fontSize: 12,
      color: theme === 'light' ? '#666' : '#BBB',
      marginBottom: 5,
    },
    dateBox: {
      backgroundColor: theme === 'light' ? '#E8E8E8' : '#404040',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    dateText: {
      fontSize: 14,
      color: theme === 'light' ? COLORS.black : COLORS.white,
      fontWeight: '500',
    },
    dateSeparator: {
      fontSize: 18,
      color: theme === 'light' ? '#666' : '#BBB',
      marginHorizontal: 8,
      marginBottom: 12,
    },
    paymentInfo: {
      marginBottom: 0,
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    paymentColumn: {
      flex: 1,
    },
    paymentLabel: {
      fontSize: 14,
      color: theme === 'light' ? '#666' : '#BBB',
      marginBottom: 5,
    },
    paymentValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'light' ? COLORS.black : COLORS.white,
    },
    totalValue: {
      marginTop: 10,
    },
    totalLabel: {
      fontSize: 14,
      color: theme === 'light' ? '#666' : '#BBB',
      marginBottom: 5,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: theme === 'light' ? COLORS.black : COLORS.white,
      marginBottom: 2,
    },
    vatAmount: {
      fontSize: 14,
      color: theme === 'light' ? '#666' : '#BBB',
    },
    deleteText: {
      fontSize: 16,
      color: '#FF4444',
    },
    divider: {
      height: 1,
      backgroundColor: theme === 'light' ? '#E0E0E0' : '#404040',
      marginVertical: 10,
      marginHorizontal: -20,
      width: 'auto',
    },
    totalValueHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    totalAmountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
  });
export default ContractInfo;
