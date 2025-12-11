import React, { useState } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PersonalDetailsScreen from './src/screens/PersonalDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import LocationScreen from './src/screens/LocationScreen';
import AppLanguageScreen from './src/screens/AppLanguageScreen';
import InviteFriendScreen from './src/screens/InviteFriendScreen';
import TutorialVideosScreen from './src/screens/TutorialVideosScreen';
import HelpScreen from './src/screens/HelpScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import ScheduleMainScreen from './src/screens/ScheduleMainScreen';
import WeeklyScheduleScreen from './src/screens/WeeklyScheduleScreen';
import MonthlyScheduleScreen from './src/screens/MonthlyScheduleScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import ActiveOrderScreen from './src/screens/ActiveOrderScreen';
import CommentScreen from './src/screens/CommentScreen';
import RescheduleCalendarScreen from './src/screens/RescheduleCalendarScreen';
import TimeSlotsScreen from './src/screens/TimeSlotsScreen';
import { Colors } from './src/styles/colors';
import { LanguageProvider } from './src/contexts/LanguageContext';

type Screen = 'splash' | 'login' | 'signup' | 'onboarding' | 'personalDetails' | 'home' | 'settings' | 'userProfile' | 'editProfile' | 'location' | 'appLanguage' | 'inviteFriend' | 'tutorialVideos' | 'help' | 'aiChat' | 'scheduleMain' | 'weeklySchedule' | 'monthlySchedule' | 'orderHistory' | 'orderDetails' | 'activeOrder' | 'comment' | 'rescheduleCalendar' | 'timeSlots';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [commentType, setCommentType] = useState<'cancel' | 'reschedule'>('cancel');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'cancel' | 'reschedule'>('cancel');

  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleSignUpPress = () => {
    setCurrentScreen('signup');
  };

  const handleSignUpComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingFinish = () => {
    setCurrentScreen('personalDetails');
  };

  const handlePersonalDetailsComplete = () => {
    setCurrentScreen('home');
  };

  const handleSettingsPress = () => {
    setCurrentScreen('settings');
  };

  const handleSettingsBack = () => {
    setCurrentScreen('home');
  };

  const handleSettingsNavigate = (screen: string) => {
    if (screen === 'userProfile') {
      setCurrentScreen('userProfile');
    }
    if (screen === 'location') {
      setCurrentScreen('location');
    }
    if (screen === 'appLanguage') {
      setCurrentScreen('appLanguage');
    }
    if (screen === 'inviteFriend') {
      setCurrentScreen('inviteFriend');
    }
    if (screen === 'tutorialVideos') {
      setCurrentScreen('tutorialVideos');
    }
    if (screen === 'help') {
      setCurrentScreen('help');
    }
    if (screen === 'Login') {
      setCurrentScreen('login');
    }
  };

  const handleUserProfileBack = () => {
    setCurrentScreen('settings');
  };

  const handleUserProfileEdit = () => {
    setCurrentScreen('editProfile');
  };

  const handleEditProfileBack = () => {
    setCurrentScreen('userProfile');
  };

  const handleEditProfileSave = (data: any) => {
    console.log('Profile saved:', data);
    setCurrentScreen('userProfile');
  };

  const handleLocationBack = () => {
    setCurrentScreen('settings');
  };

  const handleAppLanguageBack = () => {
    setCurrentScreen('settings');
  };

  const handleInviteFriendBack = () => {
    setCurrentScreen('settings');
  };

  const handleTutorialVideosBack = () => {
    setCurrentScreen('settings');
  };

  const handleHelpBack = () => {
    setCurrentScreen('settings');
  };

  const handleAIChatPress = () => {
    setCurrentScreen('aiChat');
  };

  const handleAIChatBack = () => {
    setCurrentScreen('help');
  };

  const handleHelpPress = () => {
    setCurrentScreen('help');
  };

  const handleSchedulePress = () => {
    setCurrentScreen('scheduleMain');
  };

  const handleScheduleMainBack = () => {
    setCurrentScreen('home');
  };

  const handleScheduleNavigate = (screen: 'weekly' | 'monthly') => {
    if (screen === 'weekly') {
      setCurrentScreen('weeklySchedule');
    } else if (screen === 'monthly') {
      setCurrentScreen('monthlySchedule');
    }
  };

  const handleWeeklyScheduleBack = () => {
    setCurrentScreen('scheduleMain');
  };

  const handleMonthlyScheduleBack = () => {
    setCurrentScreen('scheduleMain');
  };

  const handleOrdersPress = () => {
    setCurrentScreen('orderHistory');
  };

  const handleOrderHistoryBack = () => {
    setCurrentScreen('home');
  };

  const handleOrderPress = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentScreen('orderDetails');
  };

  const handleOrderDetailsBack = () => {
    setCurrentScreen('orderHistory');
  };

  const handleWorkItemPress = (workId: string, status: string) => {
    setSelectedOrderId(workId);
    setCurrentScreen('activeOrder');
  };

  const handleActiveOrderBack = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToComment = (type: 'cancel' | 'reschedule') => {
    setCommentType(type);
    setComment('');
    setCurrentScreen('comment');
  };

  const handleCommentBack = () => {
    setCurrentScreen('activeOrder');
  };

  const handleCommentNext = (commentText: string) => {
    setComment(commentText);
    if (commentType === 'cancel') {
      // Show cancel confirmation modal
      setConfirmationType('cancel');
      setShowConfirmModal(true);
    } else {
      // Go to calendar for reschedule
      setCurrentScreen('rescheduleCalendar');
    }
  };

  const handleCalendarBack = () => {
    setCurrentScreen('comment');
  };

  const handleCalendarNext = (date: Date) => {
    setSelectedDate(date);
    setCurrentScreen('timeSlots');
  };

  const handleTimeSlotsBack = () => {
    setCurrentScreen('rescheduleCalendar');
  };

  const handleReschedule = (times: string[]) => {
    setSelectedTimeSlots(times);
    // Show reschedule confirmation modal
    setConfirmationType('reschedule');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    setCurrentScreen('home');
    // Reset states
    setComment('');
    setSelectedDate(new Date());
    setSelectedTimeSlots([]);
  };

  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={handleSplashFinish} />
        )}
        {currentScreen === 'login' && (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onSignUpPress={handleSignUpPress}
          />
        )}
        {currentScreen === 'signup' && (
          <SignUpScreen onSignUpComplete={handleSignUpComplete} />
        )}
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onFinish={handleOnboardingFinish} />
        )}
        {currentScreen === 'personalDetails' && (
          <PersonalDetailsScreen onComplete={handlePersonalDetailsComplete} />
        )}
        {currentScreen === 'home' && (
          <HomeScreen
            onSettingsPress={handleSettingsPress}
            onSchedulePress={handleSchedulePress}
            onOrdersPress={handleOrdersPress}
            onWorkItemPress={handleWorkItemPress}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={handleSettingsBack}
            onNavigate={handleSettingsNavigate}
          />
        )}
        {currentScreen === 'userProfile' && (
          <UserProfileScreen
            onBack={handleUserProfileBack}
            onEdit={handleUserProfileEdit}
          />
        )}
        {currentScreen === 'editProfile' && (
          <EditProfileScreen
            onBack={handleEditProfileBack}
            onSave={handleEditProfileSave}
          />
        )}
        {currentScreen === 'location' && (
          <LocationScreen onBack={handleLocationBack} />
        )}
        {currentScreen === 'appLanguage' && (
          <AppLanguageScreen onBack={handleAppLanguageBack} />
        )}
        {currentScreen === 'inviteFriend' && (
          <InviteFriendScreen onBack={handleInviteFriendBack} />
        )}
        {currentScreen === 'tutorialVideos' && (
          <TutorialVideosScreen onBack={handleTutorialVideosBack} />
        )}
        {currentScreen === 'help' && (
          <HelpScreen
            onBack={handleHelpBack}
            onAIChatPress={handleAIChatPress}
          />
        )}
        {currentScreen === 'aiChat' && (
          <AIChatScreen onBack={handleAIChatBack} />
        )}
        {currentScreen === 'scheduleMain' && (
          <ScheduleMainScreen
            onBack={handleScheduleMainBack}
            onNavigate={handleScheduleNavigate}
          />
        )}
        {currentScreen === 'weeklySchedule' && (
          <WeeklyScheduleScreen onBack={handleWeeklyScheduleBack} />
        )}
        {currentScreen === 'monthlySchedule' && (
          <MonthlyScheduleScreen onBack={handleMonthlyScheduleBack} />
        )}
        {currentScreen === 'orderHistory' && (
          <OrderHistoryScreen
            onBack={handleOrderHistoryBack}
            onOrderPress={handleOrderPress}
          />
        )}
        {currentScreen === 'orderDetails' && (
          <OrderDetailsScreen
            onBack={handleOrderDetailsBack}
            orderId={selectedOrderId}
            onNavigateToAIChat={handleAIChatPress}
            onNavigateToHelp={handleHelpPress}
          />
        )}
        {currentScreen === 'activeOrder' && (
          <ActiveOrderScreen
            onBack={handleActiveOrderBack}
            orderId={selectedOrderId}
            orderStatus="Pending"
            onNavigateToComment={handleNavigateToComment}
          />
        )}
        {currentScreen === 'comment' && (
          <CommentScreen
            onBack={handleCommentBack}
            onNext={handleCommentNext}
            commentType={commentType}
          />
        )}
        {currentScreen === 'rescheduleCalendar' && (
          <RescheduleCalendarScreen
            onBack={handleCalendarBack}
            onNext={handleCalendarNext}
          />
        )}
        {currentScreen === 'timeSlots' && (
          <TimeSlotsScreen
            onBack={handleTimeSlotsBack}
            onReschedule={handleReschedule}
          />
        )}

        {/* Confirmation Modal */}
        <Modal visible={showConfirmModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModal}>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>

              <View style={styles.alertIcon}>
                <Text style={styles.alertIconText}>!</Text>
              </View>

              <Text style={styles.confirmText}>
                {confirmationType === 'cancel' 
                  ? 'This Order Is Going\nTO Cancel' 
                  : 'This Order Is Going\nTO Reschedule'}
              </Text>

              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmAction}
              >
                <Text style={styles.confirmButtonText}>
                  {confirmationType === 'cancel' ? 'Cancel Order' : 'Reschedule Order'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </View>
      </SafeAreaProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
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
  closeText: {
    fontSize: 24,
    color: Colors.textDark,
    fontWeight: '600',
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
  confirmText: {
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

export default App;
