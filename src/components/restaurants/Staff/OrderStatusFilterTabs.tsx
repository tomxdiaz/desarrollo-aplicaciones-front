import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ORDER_STATUS_FILTER_OPTIONS, OrderStatusFilter } from '../../../types/restaurant-order-status';

const OrderStatusFilterTabs = ({
  selected,
  onSelect,
}: {
  selected: OrderStatusFilter;
  onSelect: (filter: OrderStatusFilter) => void;
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {ORDER_STATUS_FILTER_OPTIONS.map((option) => {
        const isActive = selected === option.key;

        return (
          <Pressable
            key={option.key}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onSelect(option.key)}
          >
            <Text
              style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Keep the row from stretching to fill vertical space (otherwise the
  // chips blow up to the full height of the parent flex column).
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  container: {
    alignItems: 'center',
    gap: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  tab: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: COLORS.primary.terracota,
    borderColor: COLORS.primary.terracota,
  },
  tabInactive: {
    backgroundColor: COLORS.common.blanco,
    borderColor: COLORS.surface.borde_calido,
  },
  tabText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.common.blanco,
  },
  tabTextInactive: {
    color: COLORS.primary.terracota,
  },
});

export default OrderStatusFilterTabs;
