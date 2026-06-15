/**
 * Shared styles for the collapsible category sections rendered in both
 * RestaurantMenuScreen (customer view) and RestaurantMenuManagementScreen (staff view).
 * Exported as plain objects so they can be spread into a local StyleSheet.create call.
 */
import type { TextStyle, ViewStyle } from 'react-native';
import { COLORS } from './colors';
import { BORDER_RADIUS, SPACING } from './spacing_and_borders';
import { FONT_SIZES } from './font_sizes';

export const menuCategoryStyles: {
  categoryBlock: ViewStyle;
  categoryTitleRow: ViewStyle;
  categoryMarker: ViewStyle;
  categoryTitle: TextStyle;
  counterPill: ViewStyle;
  counterPillText: TextStyle;
  categoryContent: ViewStyle;
} = {
  categoryBlock: {
    gap: SPACING.small,
  },
  categoryTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  categoryMarker: {
    width: 6,
    height: 24,
    borderRadius: 999,
    backgroundColor: COLORS.primary.terracota,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  counterPill: {
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.surface.tarjeta_calida,
    paddingHorizontal: SPACING.small,
    paddingVertical: 3,
  },
  counterPillText: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_small,
  },
  categoryContent: {
    gap: SPACING.small,
  },
};
