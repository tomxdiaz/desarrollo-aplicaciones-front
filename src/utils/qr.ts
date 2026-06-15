import { Alert } from 'react-native';
import { router } from 'expo-router';
import { restaurantService } from '../services/restaurant.service';
import { ApiError } from '../lib/apiClient';

export function parseTableCode(code: string) {
  const clean = code.trim();

  const parts = clean.split('/');

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return {
    restaurantId: parts[0],
    tableCode: parts[1],
  };
}

/**
 * Resolves a scanned `restaurantId/tableCode` QR string: validates the format,
 * that the restaurant exists, and that the table exists in that restaurant,
 * then navigates to that restaurant's menu at the scanned table.
 *
 * Shows an Alert and aborts navigation on any failed validation.
 */
export async function goToScannedTable(rawCode: string) {
  const parsed = parseTableCode(rawCode);

  if (!parsed) {
    Alert.alert('Código inválido', 'El formato del QR no es válido.');
    return;
  }

  let restaurant;

  try {
    restaurant = await restaurantService.getRestaurantById(parsed.restaurantId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      Alert.alert('Restaurante no encontrado', 'Ese restaurante no existe.');
    } else {
      console.error('Error fetching restaurant from QR:', error);
      Alert.alert('Error', 'No se pudo cargar el restaurante escaneado.');
    }
    return;
  }

  if (!restaurant) {
    Alert.alert('Restaurante no encontrado', 'Ese restaurante no existe.');
    return;
  }

  const tableExists = restaurant.tables?.some((t) => t.code.toUpperCase() === parsed.tableCode.toUpperCase());

  if (!tableExists) {
    Alert.alert('Mesa no encontrada', 'Esa mesa no existe en este restaurante.');
    return;
  }

  router.push({
    pathname: '/restaurants/[id]/menu',
    params: { id: parsed.restaurantId, table: parsed.tableCode },
  });
}
