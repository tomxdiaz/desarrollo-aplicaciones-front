import type { TextStyle } from 'react-native';
import { COLORS } from './colors';
import { BORDER_RADIUS, SPACING } from './spacing_and_borders';
import { FONT_SIZES } from './font_sizes';

/**
 * TextInput style for center-dialog modals (AddStaffModal, CreateTableModal).
 * Uses BORDER_RADIUS.small and fondo_crema background.
 */
export const modalInputStyle: TextStyle = {
  borderWidth: 1,
  borderColor: COLORS.surface.borde_calido,
  borderRadius: BORDER_RADIUS.small,
  backgroundColor: COLORS.surface.fondo_crema,
  paddingHorizontal: SPACING.medium,
  paddingVertical: SPACING.medium,
  fontSize: FONT_SIZES.text_base,
  color: COLORS.common.negro_principal,
};

/**
 * TextInput style for restaurant forms (CreateRestaurantModal, RestaurantEditScreen).
 * Uses BORDER_RADIUS.medium and blanco background.
 */
export const formInputStyle: TextStyle = {
  borderWidth: 1,
  borderColor: COLORS.surface.borde_calido,
  borderRadius: BORDER_RADIUS.medium,
  backgroundColor: COLORS.common.blanco,
  paddingHorizontal: SPACING.medium,
  paddingVertical: SPACING.medium,
  fontSize: FONT_SIZES.text_base,
  color: COLORS.common.negro_principal,
};
