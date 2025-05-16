import { LocationCategory, CategoryInfo } from '../types';

/**
 * Get display information for each location category
 */
export const getCategoryInfo = (category: LocationCategory): CategoryInfo => {
  const categoryMap: Record<LocationCategory, CategoryInfo> = {
    school: {
      label: 'Scuola',
      color: '#3949AB', // Blue
      icon: 'school'
    },
    church: {
      label: 'Chiesa',
      color: '#7B1FA2', // Purple
      icon: 'church'
    },
    hospital: {
      label: 'Ospedale',
      color: '#D32F2F', // Red
      icon: 'hospital'
    },
    youth_center: {
      label: 'Centro giovanile',
      color: '#00897B', // Teal
      icon: 'users'
    },
    nursing_home: {
      label: 'RSA',
      color: '#FFA000', // Amber
      icon: 'home'
    },
    betting_shop: {
      label: 'Sala scommesse',
      color: '#E53935', // Red
      icon: 'dollar'
    },
    other: {
      label: 'Altro',
      color: '#607D8B', // Blue Grey
      icon: 'map-pin'
    }
  };
  
  return categoryMap[category] || categoryMap.other;
};