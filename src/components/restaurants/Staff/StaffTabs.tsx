import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';

export type StaffTabKey = 'edit' | 'orders' | 'tables' | 'menu' | 'staff';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type StaffTab = { key: StaffTabKey; label: string; icon: IconName };

export const STAFF_TABS: StaffTab[] = [
  { key: 'edit', label: 'Editar', icon: 'pencil-outline' },
  { key: 'orders', label: 'Pedidos', icon: 'format-list-bulleted' },
  { key: 'tables', label: 'Mesas', icon: 'view-grid-outline' },
  { key: 'menu', label: 'Menu', icon: 'silverware-fork-knife' },
  { key: 'staff', label: 'Personal', icon: 'account-group-outline' },
];

const StaffTabs = ({
  tabs,
  activeTab,
  onSelect,
}: {
  tabs: StaffTab[];
  activeTab: StaffTabKey;
  onSelect: (tab: StaffTabKey) => void;
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const color = isActive ? COLORS.primary.terracota : COLORS.common.gris_medio;

        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onSelect(tab.key)}>
            <View style={styles.tabInner}>
              <MaterialCommunityIcons name={tab.icon} size={ICON_SIZES.small} color={color} />
              <Text style={[styles.tabText, { color }]}>{tab.label}</Text>
            </View>
            <View style={[styles.underline, isActive && styles.underlineActive]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.borde_calido,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.extra_small,
  },
  tab: {
    alignItems: 'center',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  tabText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  underline: {
    alignSelf: 'stretch',
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: COLORS.primary.terracota,
  },
});

export default StaffTabs;