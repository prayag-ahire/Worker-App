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
import { useLanguage } from '../contexts/LanguageContext';

interface TutorialVideosScreenProps {
  onBack?: () => void;
}

const TutorialVideosScreen: React.FC<TutorialVideosScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  const videos = [
    { id: 1, title: 'Getting Started', duration: '5:30', thumbnail: '🎬' },
    { id: 2, title: 'Managing Orders', duration: '8:15', thumbnail: '📋' },
    { id: 3, title: 'Schedule Setup', duration: '6:45', thumbnail: '📅' },
    { id: 4, title: 'Payment & Withdrawal', duration: '7:20', thumbnail: '💰' },
  ];

  const handleVideoPress = (videoId: number) => {
    console.log(`Video ${videoId} pressed`);
    // TODO: Open video player
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader title={t('tutorial.title')} onBack={onBack} />

        {/* Videos List */}
        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video.id)}
            activeOpacity={0.7}
          >
            <View style={styles.thumbnail}>
              <Text style={styles.thumbnailIcon}>{video.thumbnail}</Text>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDuration}>{video.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  videoCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  thumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  thumbnailIcon: {
    fontSize: 40,
  },
  playButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 14,
    color: Colors.white,
    marginLeft: 2,
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  videoDuration: {
    fontSize: 14,
    color: Colors.textMedium,
  },
});

export default TutorialVideosScreen;
