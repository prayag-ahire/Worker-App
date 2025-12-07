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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>#{orderId} Order</Text>
        </View>

        {/* Order Card */}
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
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleHelp}>
              <Text style={styles.actionButtonText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
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
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>{orderDetails.amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={[styles.detailValue, styles.addressText]}>
              {orderDetails.address}
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back to Orders</Text>
        </TouchableOpacity>
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
              <Text style={styles.modalTitle}>Need Help?</Text>
              <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              How can we assist you with this order?
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
                  <Text style={styles.helpOptionTitle}>AI Chatbot</Text>
                  <Text style={styles.helpOptionDescription}>
                    Get instant answers to your queries
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
                  <Text style={styles.helpOptionTitle}>View FAQ</Text>
                  <Text style={styles.helpOptionDescription}>
                    Find answers to common questions
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
                  <Text style={styles.helpOptionTitle}>Report an Issue</Text>
                  <Text style={styles.helpOptionDescription}>
                    Send an email to report a problem
                  </Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.textDark,
    fontWeight: '700',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    backgroundColor: Colors.white,
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
    borderColor: Colors.border,
    marginRight: 16,
    backgroundColor: Colors.white,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  actionButtonText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
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
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpIcon: {
    fontSize: 20,
  },
  helpOptionContent: {
    flex: 1,
  },
  helpOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
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
    borderColor: Colors.border,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '600',
  },
});

export default OrderDetailsScreen;
