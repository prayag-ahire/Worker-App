import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Share,
  Modal,
  Linking,
} from 'react-native';
import { Colors } from '../styles/colors';
import { ScreenHeader } from '../components';
import { useLanguage } from '../contexts/LanguageContext';

interface OrderDetailsScreenProps {
  onBack?: () => void;
  orderId?: string;
  onNavigateToAIChat?: () => void;
  onNavigateToHelp?: () => void;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ 
  onBack, 
  orderId = '1245',
  onNavigateToAIChat,
  onNavigateToHelp 
}) => {
  const { t } = useLanguage();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const orderDetails = {
    id: orderId,
    clientName: 'Prayag Ahire',
    status: 'Completed',
    date: '15 Nov 2025',
    time: '2:00 PM - 3:00 PM',
    service: 'Plumbing Work',
    amount: '₹500',
    address: '123 Main Street, Pune, Maharashtra',
  };

  const handleShare = async () => {
    try {
      const message = `Order #${orderDetails.id}\nClient: ${orderDetails.clientName}\nService: ${orderDetails.service}\nDate: ${orderDetails.date}\nTime: ${orderDetails.time}\nAmount: ${orderDetails.amount}\nStatus: ${orderDetails.status}`;
      
      await Share.share({
        message: message,
        title: `Order #${orderDetails.id}`,
      });
    } catch (error) {
      console.log('Unable to share order details');
    }
  };

  const handleHelp = () => {
    setShowHelpModal(true);
  };

  const handleAIChatbot = () => {
    setShowHelpModal(false);
    // Navigate to AI Chat screen
    if (onNavigateToAIChat) {
      onNavigateToAIChat();
    }
  };

  const handleViewFAQ = () => {
    setShowHelpModal(false);
    // Navigate to Help screen
    if (onNavigateToHelp) {
      onNavigateToHelp();
    }
  };

  const handleReportIssue = () => {
    setShowHelpModal(false);
    // Open email for reporting issue
    const email = 'support@workerapp.com';
    const subject = `Report Issue - Order #${orderDetails.id}`;
    const body = `Order Details:\nOrder ID: ${orderDetails.id}\nClient: ${orderDetails.clientName}\nService: ${orderDetails.service}\nDate: ${orderDetails.date}\nTime: ${orderDetails.time}\n\nIssue Description:\n[Please describe the issue here]`;
    
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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

        {/* Order Card - Combined */}
        <View style={styles.orderCard}>
          {/* Client Info */}
          <View style={styles.clientSection}>
            <View style={styles.clientIcon} />
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{orderDetails.clientName}</Text>
              <Text style={styles.orderStatus}>{orderDetails.status}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionButtonText}>{t('orderDetails.share')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleHelp}>
              <Text style={styles.actionButtonText}>{t('orderDetails.help')}</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Order Details */}
          <Text style={styles.sectionTitle}>{t('orderDetails.title')}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('orderDetails.service')}:</Text>
            <Text style={styles.detailValue}>{orderDetails.service}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('orderDetails.date')}:</Text>
            <Text style={styles.detailValue}>{orderDetails.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('orderDetails.time')}:</Text>
            <Text style={styles.detailValue}>{orderDetails.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('orderDetails.amount')}:</Text>
            <Text style={styles.detailValue}>{orderDetails.amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('orders.address')}:</Text>
            <Text style={[styles.detailValue, styles.addressText]}>
              {orderDetails.address}
            </Text>
          </View>
        </View>

        {/* Back Button */}
        {/* <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back to Orders</Text>
        </TouchableOpacity> */}
      </ScrollView>

      {/* Help Modal */}
      <Modal
        visible={showHelpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.helpModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('orderDetails.needHelp')}</Text>
              <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              {t('orderDetails.needHelp')}
            </Text>

            <View style={styles.helpOptions}>
              <TouchableOpacity 
                style={styles.helpOption}
                onPress={handleAIChatbot}
                activeOpacity={0.7}
              >
                <View style={styles.helpIconContainer}>
                  <Text style={styles.helpIcon}>🤖</Text>
                </View>
                <View style={styles.helpOptionContent}>
                  <Text style={styles.helpOptionTitle}>{t('orderDetails.aiChatbot')}</Text>
                  <Text style={styles.helpOptionDescription}>
                    {t('orderDetails.aiChatbotDesc')}
                  </Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.helpOption}
                onPress={handleViewFAQ}
                activeOpacity={0.7}
              >
                <View style={styles.helpIconContainer}>
                  <Text style={styles.helpIcon}>❓</Text>
                </View>
                <View style={styles.helpOptionContent}>
                  <Text style={styles.helpOptionTitle}>{t('orderDetails.viewFAQ')}</Text>
                  <Text style={styles.helpOptionDescription}>
                    {t('orderDetails.viewFAQDesc')}
                  </Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.helpOption}
                onPress={handleReportIssue}
                activeOpacity={0.7}
              >
                <View style={styles.helpIconContainer}>
                  <Text style={styles.helpIcon}>📧</Text>
                </View>
                <View style={styles.helpOptionContent}>
                  <Text style={styles.helpOptionTitle}>{t('orderDetails.reportIssue')}</Text>
                  <Text style={styles.helpOptionDescription}>
                    {t('orderDetails.reportIssueDesc')}
                  </Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
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
    borderRadius: 16, // More rounded for modern look
    padding: 24, // Increased padding
    marginBottom: 24,
    marginHorizontal: 4, // Slight horizontal margin for shadow visibility
    backgroundColor: Colors.white,
    overflow: 'hidden', // Ensures content respects rounded corners
    // Modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    // Removed border for cleaner look
  },
  clientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  clientIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.backgroundSoft,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12, // More rounded
    paddingVertical: 14, // Increased padding
    alignItems: 'center',
    backgroundColor: Colors.backgroundAccent,
    // Modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    color: Colors.accent,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 14, // Increased padding
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.textMedium,
    fontWeight: '600',
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
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  helpModal: {
    backgroundColor: Colors.white,
    borderRadius: 20, // More rounded
    width: '100%',
    maxWidth: 400,
    padding: 24,
    // Modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.textDark,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.textMedium,
    marginBottom: 24,
    lineHeight: 20,
  },
  helpOptions: {
    marginBottom: 20,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16, // Increased padding
    borderRadius: 14, // More rounded
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    // Modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  helpIconContainer: {
    width: 44, // Slightly larger
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  helpIcon: {
    fontSize: 22, // Slightly larger
  },
  helpOptionContent: {
    flex: 1,
  },
  helpOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  helpOptionDescription: {
    fontSize: 13,
    color: Colors.textMedium,
    lineHeight: 18,
  },
  helpArrow: {
    fontSize: 24,
    color: Colors.textLight,
    fontWeight: '300',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12, // More rounded
    backgroundColor: Colors.white,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '600',
  },
});

export default OrderDetailsScreen;
