export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  coordinates: [number, number];
  distance: number;
  address?: string;
}

export type LocationCategory = 
  | 'school' 
  | 'church' 
  | 'hospital' 
  | 'youth_center' 
  | 'nursing_home' 
  | 'betting_shop' 
  | 'other';

export interface CategoryInfo {
  label: string;
  color: string;
  icon: string;
}

export interface SearchResult {
  sensitivePlaces: Location[];
  bettingShops: Location[];
  totalCount: number;
}

export interface CategoryStats {
  category: LocationCategory;
  count: number;
}