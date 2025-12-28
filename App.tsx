import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, BackHandler } from 'react-native';
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
  const [isSignupFlow, setIsSignupFlow] = useState(false);
  const [shouldRefreshProfile, setShouldRefreshProfile] = useState(false);
  const [shouldRefreshHome, setShouldRefreshHome] = useState(false);
  const [referralCode, setReferralCode] = useState<string>('');

  // Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Exit app from these screens
      if (currentScreen === 'splash' || currentScreen === 'login' || currentScreen === 'home') {
        return false; // Let default behavior (exit app)
      }

      // Main sections - go to home
      if (currentScreen === 'settings' || 
          currentScreen === 'orderHistory' || 
          currentScreen === 'scheduleMain') {
        setCurrentScreen('home');
        return true;
      }

      // Settings sub-screens - go to settings (but not during signup flow)
      if ((currentScreen === 'userProfile' || 
          currentScreen === 'location' || 
          currentScreen === 'inviteFriend' || 
          currentScreen === 'tutorialVideos' || 
          currentScreen === 'help') ||
          (currentScreen === 'appLanguage' && !isSignupFlow)) {
        setCurrentScreen('settings');
        // Reset refresh flag when leaving profile
        if (currentScreen === 'userProfile') {
          setShouldRefreshProfile(false);
        }
        return true;
      }

      // Edit profile - go to user profile
      if (currentScreen === 'editProfile') {
        setShouldRefreshProfile(true); // Trigger refresh when returning from edit
        setCurrentScreen('userProfile');
        return true;
      }

      // AI Chat - go to help
      if (currentScreen === 'aiChat') {
        setCurrentScreen('help');
        return true;
      }

      // Schedule sub-screens - go to schedule main
      if (currentScreen === 'weeklySchedule' || currentScreen === 'monthlySchedule') {
        setCurrentScreen('scheduleMain');
        return true;
      }

      // Order details - go to order history
      if (currentScreen === 'orderDetails') {
        setCurrentScreen('orderHistory');
        return true;
      }

      // Active order - go to home
      if (currentScreen === 'activeOrder') {
        setCurrentScreen('home');
        return true;
      }

      // Reschedule flow - go back in order
      if (currentScreen === 'timeSlots') {
        setCurrentScreen('rescheduleCalendar');
        return true;
      }
      if (currentScreen === 'rescheduleCalendar') {
        setCurrentScreen('comment');
        return true;
      }
      if (currentScreen === 'comment') {
        setCurrentScreen('activeOrder');
        return true;
      }

      // Signup flow - go to login
      if (currentScreen === 'signup') {
        setCurrentScreen('login');
        return true;
      }

      // Language selection during signup flow - go back to signup
      if (currentScreen === 'appLanguage' && isSignupFlow) {
        setCurrentScreen('signup');
        return true;
      }

      // Onboarding/Personal details - can't go back
      if (currentScreen === 'onboarding' || currentScreen === 'personalDetails') {
        return true; // Prevent back
      }

      // Default - go to home
      setCurrentScreen('home');
      return true;
    });

    return () => backHandler.remove();
  }, [currentScreen]);

  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleSplashAuthenticatedFinish = () => {
    setCurrentScreen('home');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleSignUpPress = () => {
    setCurrentScreen('signup');
  };

  const handleLoginPress = () => {
    setCurrentScreen('login');
  };

  const handleSignUpComplete = (refCode?: string) => {
    setReferralCode(refCode || ''); // Store referral code
    setIsSignupFlow(true);
    setCurrentScreen('appLanguage');
  };

  const handleLanguageSelectionComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingFinish = () => {
    setCurrentScreen('personalDetails');
  };

  const handlePersonalDetailsComplete = () => {
    setIsSignupFlow(false); // Reset signup flow flag
    setCurrentScreen('home');
  };

  const handleSettingsPress = () => {
    // Only navigate if not already on settings screen
    if (currentScreen !== 'settings') {
      setShouldRefreshHome(false); // Reset refresh flag
      setCurrentScreen('settings');
    }
  };

  const handleSettingsBack = () => {
    setCurrentScreen('home');
  };

  const handleSettingsNavigate = (screen: string) => {
    if (screen === 'userProfile') {
      setShouldRefreshProfile(false); // Don't refresh when first opening
      setCurrentScreen('userProfile');
    }
    if (screen === 'location') {
      setCurrentScreen('location');
    }
    if (screen === 'appLanguage') {
      setIsSignupFlow(false); // Accessing from settings
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
    setShouldRefreshProfile(false); // Reset refresh flag
    setCurrentScreen('settings');
  };

  const handleUserProfileEdit = () => {
    setCurrentScreen('editProfile');
  };

  const handleEditProfileBack = () => {
    setShouldRefreshProfile(true); // Trigger refresh when returning from edit
    setShouldRefreshHome(true); // Also refresh home screen
    setCurrentScreen('userProfile');
  };

  const handleEditProfileSave = (data: any) => {
    console.log('Profile saved:', data);
    setShouldRefreshProfile(true); // Trigger refresh after save
    setShouldRefreshHome(true); // Also refresh home screen
    setCurrentScreen('userProfile');
  };

  const handleLocationBack = () => {
    setCurrentScreen('settings');
  };

  const handleAppLanguageBack = () => {
    if (isSignupFlow) {
      setCurrentScreen('signup');
    } else {
      setCurrentScreen('settings');
    }
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
    // Only navigate if not already on schedule screen
    if (currentScreen !== 'scheduleMain') {
      setCurrentScreen('scheduleMain');
    }
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
    // Only navigate if not already on order history screen
    if (currentScreen !== 'orderHistory') {
      setCurrentScreen('orderHistory');
    }
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

  const handleHomePress = () => {
    setCurrentScreen('home');
  };

  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
        {currentScreen === 'splash' && (
          <SplashScreen 
            onFinish={handleSplashFinish} 
            onAuthenticatedFinish={handleSplashAuthenticatedFinish}
          />
        )}
        {currentScreen === 'login' && (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onSignUpPress={handleSignUpPress}
          />
        )}
        {currentScreen === 'signup' && (
          <SignUpScreen 
            onSignUpComplete={handleSignUpComplete}
            onLoginPress={handleLoginPress}
          />
        )}
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onFinish={handleOnboardingFinish} />
        )}
        {currentScreen === 'personalDetails' && (
          <PersonalDetailsScreen 
            onComplete={handlePersonalDetailsComplete} 
            referralCode={referralCode}
          />
        )}
        {currentScreen === 'home' && (
          <HomeScreen
            onSettingsPress={handleSettingsPress}
            onSchedulePress={handleSchedulePress}
            onOrdersPress={handleOrdersPress}
            onWorkItemPress={handleWorkItemPress}
            onHomePress={handleHomePress}
            shouldRefresh={shouldRefreshHome}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={handleSettingsBack}
            onNavigate={handleSettingsNavigate}
            onHomePress={handleHomePress}
            onOrdersPress={handleOrdersPress}
            onSchedulePress={handleSchedulePress}
          />
        )}
        {currentScreen === 'userProfile' && (
          <UserProfileScreen
            onBack={handleUserProfileBack}
            onEdit={handleUserProfileEdit}
            shouldRefresh={shouldRefreshProfile}
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
          <AppLanguageScreen 
            onBack={handleAppLanguageBack}
            onComplete={isSignupFlow ? handleLanguageSelectionComplete : undefined}
          />
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
            onHomePress={handleHomePress}
            onOrdersPress={handleOrdersPress}
            onSettingsPress={handleSettingsPress}
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
            onHomePress={handleHomePress}
            onSchedulePress={handleSchedulePress}
            onSettingsPress={handleSettingsPress}
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
