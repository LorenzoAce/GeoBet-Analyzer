import { Location, LocationCategory, SearchResult } from '../types';

// Mappa le categorie di Google Places alle nostre categorie interne
const placesTypeToCategory: Record<string, LocationCategory> = {
  // Scuole
  'school': 'school',
  'primary_school': 'school',
  'secondary_school': 'school',
  'university': 'school',
  
  // Chiese e luoghi di culto
  'church': 'church',
  'place_of_worship': 'church',
  
  // Ospedali e strutture sanitarie
  'hospital': 'hospital',
  'doctor': 'hospital',
  'health': 'hospital',
  
  // Centri giovanili e ricreativi
  'community_center': 'youth_center',
  'amusement_center': 'youth_center',
  
  // Case di riposo
  'nursing_home': 'nursing_home',
  'senior_care': 'nursing_home',
  
  // Sale scommesse
  'casino': 'betting_shop',
  'gambling': 'betting_shop',
  
  // Altri luoghi
  'park': 'other',
  'library': 'other',
  'post_office': 'other'
};

// Tipi di luoghi da cercare con Google Places API
const sensitiveTypesToSearch = [
  'school',
  'primary_school',
  'secondary_school',
  'university',
  'church',
  'place_of_worship',
  'hospital',
  'doctor',
  'health',
  'community_center',
  'nursing_home',
  'senior_care'
];

const bettingTypesToSearch = [
  'casino',
  'gambling'
];

/**
 * Cerca luoghi sensibili utilizzando Google Places API
 */
export const findNearbyPlacesWithGoogle = async (
  center: [number, number],
  radius: number
): Promise<SearchResult> => {
  try {
    const [lat, lng] = center;
    const location = new google.maps.LatLng(lat, lng);
    
    // Inizializza il servizio Places
    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    // Funzione per cercare luoghi per tipo
    const searchPlacesByTypes = async (types: string[]): Promise<google.maps.places.PlaceResult[]> => {
      const allResults: google.maps.places.PlaceResult[] = [];
      
      // Esegui ricerche separate per ogni tipo di luogo
      for (const type of types) {
        const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
          placesService.nearbySearch(
            {
              location,
              radius,
              type
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                resolve(results);
              } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                resolve([]);
              } else {
                reject(new Error(`Places API error: ${status}`));
              }
            }
          );
        });
        
        allResults.push(...results);
      }
      
      // Rimuovi duplicati basati su place_id
      const uniqueResults = allResults.filter(
        (place, index, self) => 
          index === self.findIndex(p => p.place_id === place.place_id)
      );
      
      return uniqueResults;
    };
    
    // Cerca luoghi sensibili e sale scommesse in parallelo
    const [sensitivePlacesResults, bettingShopsResults] = await Promise.all([
      searchPlacesByTypes(sensitiveTypesToSearch),
      searchPlacesByTypes(bettingTypesToSearch)
    ]);
    
    // Converti i risultati nel formato Location
    // Per i luoghi sensibili, lasciamo che la funzione determini la categoria in base ai tipi
    const sensitivePlaces = convertPlacesToLocations(sensitivePlacesResults, center);
    
    // Per le sale scommesse, forziamo la categoria a 'betting_shop'
    // Ma solo se il luogo ha effettivamente uno dei tipi di betting_shop
    const bettingShops = bettingShopsResults
      .filter(place => place.types && place.types.some(type => 
        bettingTypesToSearch.includes(type)
      ))
      .map(place => convertPlacesToLocations([place], center, 'betting_shop'))
      .flat();
    
    // Rimuovi eventuali duplicati tra luoghi sensibili e sale scommesse
    // basandosi sulle coordinate (potrebbero avere place_id diversi ma essere lo stesso luogo)
    const uniqueSensitivePlaces = sensitivePlaces.filter(sensitive => {
      return !bettingShops.some(betting => 
        betting.coordinates[0] === sensitive.coordinates[0] && 
        betting.coordinates[1] === sensitive.coordinates[1]
      );
    });
    
    
    return {
      sensitivePlaces: uniqueSensitivePlaces,
      bettingShops,
      totalCount: uniqueSensitivePlaces.length + bettingShops.length
    };
  } catch (error) {
    console.error('Error finding nearby places with Google API:', error);
    throw new Error('Errore nella ricerca dei luoghi vicini');
  }
};

/**
 * Converte i risultati di Google Places nel formato Location
 */
const convertPlacesToLocations = (
  places: google.maps.places.PlaceResult[],
  center: [number, number],
  defaultCategory?: LocationCategory
): Location[] => {
  // Prima rimuoviamo i duplicati basati sulle coordinate
  const uniquePlaces = places.filter((place, index, self) => {
    if (!place.geometry?.location) return false;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    
    // Controlla se è il primo elemento con queste coordinate
    return index === self.findIndex(p => {
      if (!p.geometry?.location) return false;
      return p.geometry.location.lat() === lat && p.geometry.location.lng() === lng;
    });
  });
  
  return uniquePlaces
    .filter(place => place.geometry?.location && place.name)
    .map(place => {
      const location = place.geometry!.location;
      const lat = location.lat();
      const lng = location.lng();
      
      // Calcola la distanza dal centro (approssimazione)
      const distance = calculateDistance(
        center[0], center[1],
        lat, lng
      );
      
      // Determina la categoria in base al tipo del luogo
      // Se è stato fornito un defaultCategory, lo usiamo direttamente senza cercare nei tipi
      let category: LocationCategory = defaultCategory || 'other';
      
      // Solo se non è stato fornito un defaultCategory, cerchiamo nei tipi del luogo
      if (!defaultCategory && place.types && place.types.length > 0) {
        for (const type of place.types) {
          if (placesTypeToCategory[type]) {
            category = placesTypeToCategory[type];
            break;
          }
        }
      }
      
      return {
        id: place.place_id || `place-${Math.random().toString(36).substring(2, 11)}`,
        name: place.name || 'Luogo senza nome',
        category,
        coordinates: [lat, lng] as [number, number],
        distance: Math.round(distance),
        address: place.vicinity || undefined
      };
    });
};

/**
 * Calcola la distanza tra due punti in metri (formula di Haversine)
 */
const calculateDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number => {
  const R = 6371e3; // raggio della Terra in metri
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distanza in metri
};