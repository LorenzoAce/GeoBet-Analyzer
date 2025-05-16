import { Location, SearchResult } from '../types';
import { findNearbyPlacesWithGoogle } from './googlePlacesService';

/**
 * Geocode an address to get coordinates using Google Geocoding API
 */
export const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
  try {
    // Use the place data from Google Places Autocomplete
    const geocoder = new google.maps.Geocoder();
    
    const result = await new Promise<google.maps.GeocoderResult | null>((resolve, reject) => {
      geocoder.geocode(
        { 
          address,
          region: 'IT',
          componentRestrictions: { country: 'IT' }
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
            resolve(results[0]);
          } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            resolve(null);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        }
      );
    });

    if (!result) {
      return null;
    }

    const { lat, lng } = result.geometry.location;
    return [lat(), lng()];
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

/**
 * Find nearby places using Google Places API
 */
export const findNearbyPlaces = async (
  center: [number, number], 
  radius: number
): Promise<SearchResult> => {
  try {
    // Utilizziamo esclusivamente l'API di Google Places per dati reali
    return await findNearbyPlacesWithGoogle(center, radius);
  } catch (error) {
    console.error('Error finding nearby places:', error);
    throw error;
  }
};