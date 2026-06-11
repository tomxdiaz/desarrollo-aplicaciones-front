import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';

<<<<<<< HEAD
export type StaffTabKey = 'orders' | 'tables' | 'menu' | 'staff';
=======
export type StaffTabKey = 'orders' | 'tables' | 'menu';
>>>>>>> origin/dev

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type StaffTab = { key: StaffTabKey; label: string; icon: IconName };

export const STAFF_TABS: StaffTab[] = [
  { key: 'orders', label: 'Pedidos', icon: 'format-list-bulleted' },
  { key: 'tables', label: 'Mesas', icon: 'view-grid-outline' },
<<<<<<< HEAD
  { key: 'menu', label: 'Menú', icon: 'silverware-fork-knife' },
  { key: 'staff', label: 'Personal', icon: 'account-group-outline' },
=======
  { key: 'menu', label: 'Menu', icon: 'silverware-fork-knife' },
>>>>>>> origin/dev
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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.borde_calido,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    paddingVertical: SPACING.medium,
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
