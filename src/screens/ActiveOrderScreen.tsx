import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Colors } from '../styles/colors';
import { ScreenHeader } from '../components';

interface ActiveOrderScreenProps {
  onBack?: () => void;
  orderId?: string;
  orderStatus?: 'Pending' | 'Completed' | 'Cancelled';
  onNavigateToComment?: (type: 'cancel' | 'reschedule') => void;
  onShowError?: (fromScreen: 'activeOrder', message?: string) => void;
}

const ActiveOrderScreen: React.FC<ActiveOrderScreenProps> = ({ 
  onBack, 
  orderId = '1245',
  orderStatus = 'Pending',
  onNavigateToComment,
  onShowError
}) => {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState<'wrongOTP' | 'success'>('wrongOTP');
  const [otp, setOtp] = useState(['', '', '', '', '']);

  const orderDetails = {
    id: orderId,
    clientName: 'Prayag Ahire',
    status: orderStatus,
    address: 'Takshi pg, near krushna dhaam, makarba ahmedabad',
    phone: '8238494381',
    service: 'Plumbing Work',
    date: '15 Nov 2025',
    time: '2:00 PM - 3:00 PM',
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join('');
    if (otpValue === '12345') { // Mock OTP verification
      setShowOTPModal(false);
      console.log('OTP verified');
    } else {
      setShowOTPModal(false);
      setAlertType('wrongOTP');
      setShowAlertModal(true);
    }
  };

  const handleCancel = () => {
    if (onNavigateToComment) {
      onNavigateToComment('cancel');
    }
  };

  const handleReschedule = () => {
    if (onNavigateToComment) {
      onNavigateToComment('reschedule');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader title={`#${orderId} Order`} onBack={onBack} variant="blue" />

        {/* Order Card */}
        <View style={styles.orderCard}>
          {/* Client Info Section */}
          <View style={styles.clientSection}>
            <View style={styles.clientIcon} />
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{orderDetails.clientName}</Text>
              <Text style={styles.orderStatus}>{orderDetails.status}</Text>
            </View>
          </View>

          {/* Order Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailValue}>{orderDetails.service}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{orderDetails.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{orderDetails.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{orderDetails.phone}</Text>
            </View>

            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={[styles.detailValue, styles.addressText]}>
                {orderDetails.address}
              </Text>
            </View>
          </View>

          {/* Map Button */}
          <TouchableOpacity style={styles.mapButton}>
            <Text style={styles.mapButtonText}>Open MAP</Text>
          </TouchableOpacity>

          {orderStatus === 'Pending' && (
            <>
              <TouchableOpacity 
                style={styles.otpButton}
                onPress={() => setShowOTPModal(true)}
              >
                <Text style={styles.otpButtonText}>Enter OTP</Text>
              </TouchableOpacity>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleReschedule}>
                  <Text style={styles.actionBtnText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={handleCancel}>
                  <Text style={styles.actionBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* OTP Modal */}
      <Modal visible={showOTPModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.otpModal}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowOTPModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={styles.otpTitle}>Enter OTP TO{'\n'}Start Work</Text>
            
            <View style={styles.otpInputs}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOTPChange(index, value)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      <Modal visible={showAlertModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowAlertModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.alertIcon}>
              <Text style={styles.alertIconText}>
                {alertType === 'success' ? '✓' : '!'}
              </Text>
            </View>

            <Text style={styles.alertText}>
              {alertType === 'wrongOTP' && 'Entered OTP is\nnot correct'}
              {alertType === 'success' && 'Reschedule\nSuccessful'}
            </Text>

            {alertType === 'wrongOTP' && (
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => {
                  setShowAlertModal(false);
                  setShowOTPModal(true);
                }}
              >
                <Text style={styles.confirmButtonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  clientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  clientIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 16,
    backgroundColor: Colors.backgroundSoft,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  orderStatus: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.textMedium,
    fontWeight: '500',
    width: 100,
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
  addressText: {
    lineHeight: 22,
  },
  mapButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  mapButtonText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '600',
  },
  otpButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  otpButtonText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  actionBtnText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpModal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    width: '90%',
    maxWidth: 400,
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.textDark,
    fontWeight: '600',
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 20,
    lineHeight: 28,
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    color: Colors.textDark,
    fontWeight: '600',
    backgroundColor: Colors.white,
  },
  verifyButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alertModal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
  },
  alertIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  alertIconText: {
    fontSize: 40,
    color: Colors.textDark,
    fontWeight: '700',
  },
  alertText: {
    fontSize: 18,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    fontWeight: '500',
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: 180,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '600',
  },
});

export default ActiveOrderScreen;
