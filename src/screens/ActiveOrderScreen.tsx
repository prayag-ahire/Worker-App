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

interface ActiveOrderScreenProps {
  onBack?: () => void;
  orderId?: string;
  orderStatus?: 'Pending' | 'Completed' | 'Cancelled';
  onNavigateToComment?: (type: 'cancel' | 'reschedule') => void;
}

const ActiveOrderScreen: React.FC<ActiveOrderScreenProps> = ({ 
  onBack, 
  orderId = '1245',
  orderStatus = 'Pending',
  onNavigateToComment
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.orderIdHeader}>#{orderId} Order</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Card */}
        <View style={styles.orderCard}>
          <TouchableOpacity style={styles.closeButton} onPress={onBack}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.orderInfo}>
            <Text style={styles.infoRow}>Client : {orderDetails.clientName}</Text>
            <Text style={styles.infoRow}>Status : {orderDetails.status}</Text>
            <Text style={styles.infoRow}>Address : {orderDetails.address}</Text>
            <TouchableOpacity style={styles.mapButton}>
              <Text style={styles.mapButtonText}>Open MAP</Text>
            </TouchableOpacity>
            <Text style={styles.infoRow}>Phone : {orderDetails.phone}</Text>
          </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },
  orderIdHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDots: {
    fontSize: 24,
    color: Colors.textDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.textDark,
  },
  orderInfo: {
    marginTop: 20,
  },
  infoRow: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 8,
    lineHeight: 20,
  },
  mapButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  mapButtonText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
  },
  otpButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  otpButtonText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpModal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    width: '85%',
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
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    color: Colors.textDark,
  },
  verifyButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  alertModal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
  },
  alertIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  alertIconText: {
    fontSize: 32,
    color: Colors.textDark,
    fontWeight: '700',
  },
  alertText: {
    fontSize: 16,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  confirmButtonText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
});

export default ActiveOrderScreen;
