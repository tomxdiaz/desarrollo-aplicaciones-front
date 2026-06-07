import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';

export type StaffTabKey = 'orders' | 'tables';

const STAFF_TABS: { key: StaffTabKey; label: string }[] = [
  { key: 'orders', label: 'Pedidos' },
  { key: 'tables', label: 'Mesas' },
];

const StaffTabs = ({ activeTab, onSelect }: { activeTab: StaffTabKey; onSelect: (tab: StaffTabKey) => void }) => {
  return (
    <View style={styles.container}>
      {STAFF_TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onSelect(tab.key)}
          >
            <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
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
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  tabTextActive: {
    color: COLORS.common.blanco,
  },
  tabTextInactive: {
    color: COLORS.primary.terracota,
  },
});

export default StaffTabs;
