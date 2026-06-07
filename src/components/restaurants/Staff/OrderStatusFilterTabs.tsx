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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {ORDER_STATUS_FILTER_OPTIONS.map((option) => {
        const isActive = selected === option.key;

        return (
          <Pressable
            key={option.key}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onSelect(option.key)}
          >
            <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.extra_small,
  },
  tab: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  tabActive: {
    backgroundColor: COLORS.primary.terracota,
  },
  tabInactive: {
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
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
