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
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { ScreenHeader, PrimaryButton, SecondaryButton } from '../components';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserLocation, updateUserLocation } from '../services/apiClient';
import { getAuthToken } from '../utils/storage';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Default location (New York City as fallback)
  const defaultRegion: LocationCoords = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    // Request location permissions and fetch saved location on mount
    const initializeLocation = async () => {
      await requestLocationPermission();
      await fetchSavedLocation();
    };

    initializeLocation();

    // Cleanup on unmount
    return () => {
      cancelLocationRequest();
    };
  }, []);

  const fetchSavedLocation = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.log('No token found, skipping location fetch');
        setIsFetchingLocation(false);
        return;
      }

      console.log('Fetching saved location...');
      const savedLocation = await getUserLocation(token);
      
      if (savedLocation && savedLocation.latitude && savedLocation.longitude) {
        const newLocation: LocationCoords = {
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setCurrentLocation(newLocation);
        setMarkerPosition({ 
          latitude: savedLocation.latitude, 
          longitude: savedLocation.longitude 
        });

        // Get address for saved location
        const address = await reverseGeocode(savedLocation.latitude, savedLocation.longitude);
        if (address) {
          setLocation(address);
        }

        console.log('Loaded saved location:', savedLocation);
      }
    } catch (error: any) {
      console.error('Error fetching saved location:', error);
      // Don't show error toast for missing location (user might not have set one yet)
      if (!error.message?.includes('404')) {
        Toast.show({
          type: 'info',
          text1: 'No Saved Location',
          text2: 'Please set your home location',
          position: 'top',
          visibilityTime: 2000,
        });
      }
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const cancelLocationRequest = () => {
    // Cancel geolocation watch
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Abort fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset loading state
    setIsLoading(false);
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (checkResult) {
          return true;
        }

        // Request permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'ProWorker needs access to your location to set your home address and show nearby work opportunities.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          // Permission permanently denied, guide user to settings
          Alert.alert(
            'Location Permission Required',
            'Location access is required to use this feature. Please enable it in your device settings.\n\nSettings > Apps > ProWorker > Permissions > Location',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => {
                  // On Android, we can try to open app settings
                  if (Platform.OS === 'android') {
                    const { Linking } = require('react-native');
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
          return false;
        } else {
          // Permission denied
          Toast.show({
            type: 'error',
            text1: 'Permission Denied',
            text2: 'Location permission is required to get your current location.',
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
        }
      } catch (err) {
        console.warn('Permission error:', err);
        Toast.show({
          type: 'error',
          text1: 'Permission Error',
          text2: 'Failed to request location permission.',
          position: 'top',
          visibilityTime: 3000,
        });
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      // Using Nominatim API (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WorkerApp/1.0', // Required by Nominatim
          },
          signal: abortControllerRef.current.signal,
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
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Geocoding request was cancelled');
        return '';
      }
      console.error('Reverse geocoding error:', error);
      // Fallback to coordinates if geocoding fails
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    }
  };

  const handleGetCurrentLocation = async () => {
    // Prevent multiple simultaneous requests
    if (isLoading) {
      return;
    }

    console.log('Get current location pressed');
    setIsLoading(true);
    
    // Request permission first
    const hasPermission = await requestLocationPermission();
  
    if (!hasPermission) {
      setIsLoading(false);
      return; // Permission function already showed feedback
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
        
        // Only update if request wasn't cancelled
        if (address) {
          setLocation(address);
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Location error:', error);
        setIsLoading(false);
        
        // Handle different error codes
        if (error.code === 1) {
          // PERMISSION_DENIED
          Alert.alert(
            'Location Permission Denied',
            'Please enable location permission in your device settings to use this feature.\n\nSettings > Apps > ProWorker > Permissions > Location',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE - GPS might be off
          Alert.alert(
            'Location Services Disabled',
            'Please enable Location/GPS in your device settings to get your current location.\n\nSettings > Location > Turn ON',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => {
                  // Try to open location settings
                  if (Platform.OS === 'android') {
                    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(() => {
                      Linking.openSettings();
                    });
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
        } else if (error.code === 3) {
          // TIMEOUT
          Toast.show({
            type: 'error',
            text1: 'Location Timeout',
            text2: 'Unable to get location. Please try again.',
            position: 'top',
            visibilityTime: 3000,
          });
        } else {
          // Other errors
          Alert.alert(
            'Location Error',
            `Unable to get your location: ${error.message}. Please make sure location services are enabled.`,
            [{ text: 'OK' }]
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleSetHomeLocation = async () => {
    console.log('Set home location pressed');
    
    if (!currentLocation) {
      Toast.show({
        type: 'error',
        text1: 'No Location Selected',
        text2: 'Please get your current location first',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setIsSaving(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Save location to backend
      const locationData = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };

      await updateUserLocation(token, locationData);

      Toast.show({
        type: 'success',
        text1: 'Home Location Set',
        text2: `Your home location has been saved: ${location}`,
        position: 'top',
        visibilityTime: 2000,
      });

      // Navigate back after a short delay
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 500);

    } catch (error: any) {
      console.error('Error saving location:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Save Location',
        text2: error.message || 'Could not save your home location',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    // Cancel any ongoing location requests
    cancelLocationRequest();
    
    // Call the original onBack
    if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {isFetchingLocation ? (
        <View style={styles.initialLoadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading location...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <ScreenHeader title={t('location.title')} onBack={handleBack} variant="blue" />

          {/* Map Container */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={currentLocation || defaultRegion}
              showsUserLocation={true}
              showsMyLocationButton={false}
              showsCompass={true}
              zoomEnabled={true}
              scrollEnabled={true}
              onMapReady={() => {
                // Map is ready, if we have a saved location, animate to it
                if (currentLocation && mapRef.current) {
                  mapRef.current.animateToRegion(currentLocation, 500);
                }
              }}
            >
              {markerPosition && (
                <Marker
                  coordinate={markerPosition}
                  title={t('location.yourLocation')}
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
            title={t('location.getCurrentLocation')}
            onPress={handleGetCurrentLocation}
            style={styles.gpsButton}
            textStyle={styles.gpsButtonText}
            disabled={isLoading || isSaving}
          />

          {/* Set Home Location Button */}
          <PrimaryButton
            title={isSaving ? 'Saving...' : t('location.setHomeLocation')}
            onPress={handleSetHomeLocation}
            style={styles.setLocationButton}
            disabled={isLoading || isSaving}
          />

          {/* Info Text */}
          <Text style={styles.infoText}>
            {t('location.infoText')}
          </Text>
        </ScrollView>
      )}

      {/* Loading Overlay for Getting Location */}
      <Modal
        transparent={true}
        visible={isLoading}
        animationType="fade"
        onRequestClose={() => {
          // Allow back button to cancel the request
          cancelLocationRequest();
        }}
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Getting your location...</Text>
            <Text style={styles.loadingSubtext}>Please wait</Text>
          </View>
        </View>
      </Modal>

      {/* Saving Overlay */}
      <Modal
        transparent={true}
        visible={isSaving}
        animationType="fade"
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Saving location...</Text>
            <Text style={styles.loadingSubtext}>Please wait</Text>
          </View>
        </View>
      </Modal>

      <Toast />
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
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
  },
});

export default LocationScreen;

