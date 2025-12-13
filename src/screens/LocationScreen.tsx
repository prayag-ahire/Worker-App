import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Colors } from '../styles/colors';
import { ScreenHeader, PrimaryButton, SecondaryButton } from '../components';
import { useLanguage } from '../contexts/LanguageContext';

interface LocationScreenProps {
  onBack?: () => void;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [location, setLocation] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);

  // Default location (New York City as fallback)
  const defaultRegion: LocationCoords = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    // Request location permissions on mount
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show it on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using Nominatim API (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WorkerApp/1.0', // Required by Nominatim
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      
      // Extract city and state from the response
      const address = data.address;
      const city = address.city || address.town || address.village || address.county || 'Unknown City';
      const state = address.state || 'Unknown State';
      
      return `${city}, ${state}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to coordinates if geocoding fails
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    }
  };

  const handleGetCurrentLocation = async () => {
    console.log('Get current location pressed');
    
    // Request permission first
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to get your current location.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Get current position
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        const newLocation: LocationCoords = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setCurrentLocation(newLocation);
        setMarkerPosition({ latitude, longitude });
        
        // Show loading state
        setLocation('Getting address...');

        // Animate map to current location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newLocation, 1000);
        }

        // Get human-readable address
        const address = await reverseGeocode(latitude, longitude);
        setLocation(address);
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert(
          'Location Error',
          `Unable to get your location: ${error.message}. Please make sure location services are enabled.`,
          [{ text: 'OK' }]
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleSetHomeLocation = () => {
    console.log('Set home location pressed');
    
    if (!currentLocation) {
      Alert.alert(
        'No Location Selected',
        'Please get your current location first before setting it as home location.',
        [{ text: 'OK' }]
      );
      return;
    }

    // TODO: Save location to backend
    Alert.alert(
      'Home Location Set',
      `Your home location has been set to:\n${location}`,
      [
        {
          text: 'OK',
          onPress: () => {
            if (onBack) {
              onBack();
            }
          },
        },
      ]
    );
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

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={defaultRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            zoomEnabled={true}
            scrollEnabled={true}
          >
            {markerPosition && (
              <Marker
                coordinate={markerPosition}
                title="Your Location"
                description={location}
                pinColor={Colors.accent}
              />
            )}
          </MapView>
          
          {location && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>{location}</Text>
            </View>
          )}
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
    height: 400,
    marginBottom: 24,
    backgroundColor: Colors.backgroundSoft,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    pointerEvents: 'none',
  },
  mapPlaceholder: {
    fontSize: 64,
    marginBottom: 16,
  },
  mapText: {
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textDark,
    textAlign: 'center',
    fontWeight: '500',
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

