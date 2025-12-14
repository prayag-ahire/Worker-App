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
import { Card } from '../components';
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
        <Card style={styles.ordersCard}>
          {orders.map((order, index) => (
            <TouchableOpacity
              key={order.id}
              style={[
                styles.orderCard,
                index === orders.length - 1 && styles.lastOrderCard
              ]}
              onPress={() => onOrderPress && onOrderPress(order.id)}
              activeOpacity={0.7}
            >
              <View style={styles.orderIcon} />
              <View style={styles.orderInfo}>
                <Text style={styles.clientName}>{order.clientName}</Text>
                <Text style={styles.orderStatus}>{order.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>

      <BottomNavigation
        activeTab="orders"
        onHomePress={onHomePress}
        onOrdersPress={onBack}
        onSchedulePress={onSchedulePress}
        onProfilePress={onSettingsPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    paddingVertical: 20,
  },
  ordersCard: {
    padding: 0,
    overflow: 'hidden',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  lastOrderCard: {
    borderBottomWidth: 0,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 16,
    backgroundColor: Colors.white,
  },
  orderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: Colors.textMedium,
  },
});

export default OrderHistoryScreen;
