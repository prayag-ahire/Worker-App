import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';
import { ScreenHeader, PrimaryButton, SecondaryButton } from '../components';

interface LocationScreenProps {
  onBack?: () => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ onBack }) => {
  const [location, setLocation] = useState<string>('');

  const handleGetCurrentLocation = () => {
    console.log('Get current location pressed');
    // TODO: Integrate GPS/Location services
    setLocation('Current Location: Lat 40.7128, Lng -74.0060');
  };

  const handleSetHomeLocation = () => {
    console.log('Set home location pressed');
    // TODO: Save location to backend
    if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader title="Location" onBack={onBack} />

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>📍</Text>
          <Text style={styles.mapText}>Map will be displayed here</Text>
          <Text style={styles.mapSubtext}>
            (Google Maps or other map integration)
          </Text>
          
          {location ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>{location}</Text>
            </View>
          ) : null}
        </View>

        {/* GPS Button */}
        <SecondaryButton
          title="📍 Get Current Location"
          onPress={handleGetCurrentLocation}
          style={styles.gpsButton}
          textStyle={styles.gpsButtonText}
        />

        {/* Set Home Location Button */}
        <PrimaryButton
          title="Set Home Location"
          onPress={handleSetHomeLocation}
          style={styles.setLocationButton}
        />

        {/* Info Text */}
        <Text style={styles.infoText}>
          Click "Get Current Location" to sync your GPS location, then click "Set Home Location" to save it.
        </Text>
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
  mapContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.backgroundSoft,
  },
  mapPlaceholder: {
    fontSize: 64,
    marginBottom: 16,
  },
  mapText: {
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: Colors.textLight,
  },
  locationInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textDark,
    textAlign: 'center',
  },
  gpsButton: {
    borderColor: Colors.accent,
    marginBottom: 16,
  },
  gpsButtonText: {
    color: Colors.accent,
  },
  setLocationButton: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LocationScreen;
