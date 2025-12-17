import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavigationProps {
  activeTab: 'home' | 'orders' | 'schedule' | 'profile';
  onHomePress?: () => void;
  onOrdersPress?: () => void;
  onSchedulePress?: () => void;
  onProfilePress?: () => void;
}

// Simple icon components using View shapes
const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={styles.iconWrapper}>
    <View style={[styles.house, active && styles.houseActive]}>
      <View style={[styles.houseRoof, active && styles.houseRoofActive]} />
      <View style={[styles.houseBody, active && styles.houseBodyActive]} />
    </View>
  </View>
);

const OrdersIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={styles.iconWrapper}>
    <View style={[styles.listIcon]}>
      <View style={[styles.listLine, active && styles.listLineActive]} />
      <View style={[styles.listLine, active && styles.listLineActive]} />
      <View style={[styles.listLine, active && styles.listLineActive]} />
    </View>
  </View>
);

const ScheduleIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={styles.iconWrapper}>
    <View style={[styles.calendarIcon, active && styles.calendarIconActive]}>
      <View style={[styles.calendarTop, active && styles.calendarTopActive]} />
    </View>
  </View>
);

const SettingsIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={styles.iconWrapper}>
    <View style={[styles.gearIcon]}>
      <View style={[styles.gearCenter, active && styles.gearCenterActive]} />
      <View style={[styles.gearTooth, styles.gearToothTop, active && styles.gearToothActive]} />
      <View style={[styles.gearTooth, styles.gearToothRight, active && styles.gearToothActive]} />
      <View style={[styles.gearTooth, styles.gearToothBottom, active && styles.gearToothActive]} />
      <View style={[styles.gearTooth, styles.gearToothLeft, active && styles.gearToothActive]} />
    </View>
  </View>
);

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onHomePress,
  onOrdersPress,
  onSchedulePress,
  onProfilePress,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={onHomePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, activeTab === 'home' && styles.iconContainerActive]}>
          <HomeIcon active={activeTab === 'home'} />
        </View>
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>{t('home.title')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={onOrdersPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, activeTab === 'orders' && styles.iconContainerActive]}>
          <OrdersIcon active={activeTab === 'orders'} />
        </View>
        <Text style={[styles.navLabel, activeTab === 'orders' && styles.navLabelActive]}>{t('orders.title')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={onSchedulePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, activeTab === 'schedule' && styles.iconContainerActive]}>
          <ScheduleIcon active={activeTab === 'schedule'} />
        </View>
        <Text style={[styles.navLabel, activeTab === 'schedule' && styles.navLabelActive]}>{t('schedule.schedule')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, activeTab === 'profile' && styles.iconContainerActive]}>
          <SettingsIcon active={activeTab === 'profile'} />
        </View>
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>{t('settings.setting')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: Colors.accent,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  navLabelActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
  // Icon wrapper
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Home icon
  house: {
    width: 20,
    height: 18,
    position: 'relative',
  },
  houseRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 8,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.textSecondary,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  houseRoofActive: {
    borderBottomColor: Colors.white,
  },
  houseBody: {
    width: 16,
    height: 10,
    backgroundColor: Colors.textSecondary,
    position: 'absolute',
    bottom: 0,
    left: 2,
    borderRadius: 2,
  },
  houseBodyActive: {
    backgroundColor: Colors.white,
  },
  houseActive: {
    backgroundColor: Colors.accent, // Add appropriate styling for active state
  },
  // Orders/List icon
  listIcon: {
    width: 18,
    height: 18,
    justifyContent: 'space-between',
  },
  listLine: {
    width: 18,
    height: 2,
    backgroundColor: Colors.textSecondary,
    borderRadius: 1,
  },
  listLineActive: {
    backgroundColor: Colors.white,
  },
  // Calendar icon
  calendarIcon: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    borderRadius: 3,
    position: 'relative',
  },
  calendarIconActive: {
    borderColor: Colors.white,
  },
  calendarTop: {
    width: 14,
    height: 4,
    backgroundColor: Colors.textSecondary,
    position: 'absolute',
    top: 2,
    left: 0,
    borderRadius: 1,
  },
  calendarTopActive: {
    backgroundColor: Colors.white,
  },
  // Settings/Gear icon
  gearIcon: {
    width: 20,
    height: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.textSecondary,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    position: 'absolute',
    zIndex: 2,
  },
  gearCenterActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  gearTooth: {
    width: 4,
    height: 6,
    backgroundColor: Colors.textSecondary,
    position: 'absolute',
    borderRadius: 1,
  },
  gearToothActive: {
    backgroundColor: Colors.white,
  },
  gearToothTop: {
    top: 0,
    left: 8,
  },
  gearToothRight: {
    right: 0,
    top: 7,
  },
  gearToothBottom: {
    bottom: 0,
    left: 8,
  },
  gearToothLeft: {
    left: 0,
    top: 7,
  },
});

export default BottomNavigation;
