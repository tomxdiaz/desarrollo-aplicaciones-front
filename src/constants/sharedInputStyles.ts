import type { TextStyle } from 'react-native';
import { COLORS } from './colors';
import { BORDER_RADIUS, SPACING } from './spacing_and_borders';
import { FONT_SIZES } from './font_sizes';

/**
 * Standard TextInput style used by center-dialog modals (AddStaffModal, CreateTableModal).
 * MenuProductFormModal and RestaurantEditScreen use different borderRadius and backgroundColor
 * and intentionally keep their own input styles.
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
