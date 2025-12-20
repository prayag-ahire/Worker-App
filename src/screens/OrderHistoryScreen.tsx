import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';
import BottomNavigation from '../components/BottomNavigation';
import { useLanguage } from '../contexts/LanguageContext';

interface OrderHistoryScreenProps {
  onBack?: () => void;
  onOrderPress?: (orderId: string) => void;
  onHomePress?: () => void;
  onSchedulePress?: () => void;
  onSettingsPress?: () => void;
}

interface Order {
  id: string;
  clientName: string;
  status: string;
}

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onBack, onOrderPress, onHomePress, onSchedulePress, onSettingsPress }) => {
  const { t } = useLanguage();
  
  const orders: Order[] = [
    { id: '1245', clientName: 'Prayag Ahire', status: t('home.completed') },
    { id: '1246', clientName: 'Ganesh Ahire', status: t('home.completed') },
    { id: '1247', clientName: 'Ram Shirsagar', status: t('home.completed') },
    { id: '1248', clientName: 'Prayag Ahire', status: t('home.completed') },
    { id: '1249', clientName: 'Prayag Ahire', status: t('home.completed') },
    { id: '1250', clientName: 'Prayag Ahire', status: t('home.completed') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('orders.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Orders List */}
        <View style={styles.ordersList}>
          {orders.map((order, index) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => onOrderPress && onOrderPress(order.id)}
              activeOpacity={0.7}
            >
              <View style={styles.orderIcon}>
                <View style={styles.documentIcon}>
                  <View style={styles.documentLines} />
                  <View style={styles.documentLines} />
                  <View style={styles.documentLines} />
                </View>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.clientName}>{order.clientName}</Text>
                <Text style={styles.orderStatus}>{order.status}</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab="orders"
        onHomePress={onHomePress}
        onOrdersPress={undefined}
        onSchedulePress={onSchedulePress}
        onProfilePress={onSettingsPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.accent,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentIcon: {
    width: 20,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  documentLines: {
    width: 12,
    height: 2,
    backgroundColor: Colors.accent,
    marginVertical: 1.5,
    borderRadius: 1,
  },
  orderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  orderStatus: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  arrow: {
    fontSize: 40,
    color: Colors.accent,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default OrderHistoryScreen;
