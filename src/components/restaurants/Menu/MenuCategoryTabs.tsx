import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Category } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';

type MenuCategoryTabsProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (categoryId: number | null) => void;
};

const MenuCategoryTabs = ({ categories, selectedCategoryId, onSelect }: MenuCategoryTabsProps) => {
  const isAllSelected = selectedCategoryId === null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Pressable
        style={[styles.tab, isAllSelected ? styles.tabActive : styles.tabInactive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.tabText, isAllSelected ? styles.tabTextActive : styles.tabTextInactive]}>Todos</Text>
      </Pressable>
      {categories.map((category) => {
        const isActive = selectedCategoryId === category.id;

        return (
          <Pressable
            key={category.id}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onSelect(category.id)}
          >
            <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>{category.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.small,
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

export default MenuCategoryTabs;
