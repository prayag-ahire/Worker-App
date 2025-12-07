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
import { ScreenHeader, Card } from '../components';

interface OrderHistoryScreenProps {
  onBack?: () => void;
  onOrderPress?: (orderId: string) => void;
}

interface Order {
  id: string;
  clientName: string;
  status: string;
}

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onBack, onOrderPress }) => {
  const orders: Order[] = [
    { id: '1245', clientName: 'Prayag Ahire', status: 'Completed' },
    { id: '1246', clientName: 'Ganesh Ahire', status: 'Completed' },
    { id: '1247', clientName: 'Ram Shirsagar', status: 'Completed' },
    { id: '1248', clientName: 'Prayag Ahire', status: 'Completed' },
    { id: '1249', clientName: 'Prayag Ahire', status: 'Completed' },
    { id: '1250', clientName: 'Prayag Ahire', status: 'Completed' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader title="Orders" onBack={onBack} />

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
