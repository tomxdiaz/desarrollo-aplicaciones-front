import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { RestaurantStaffEnum } from '../../types/types';
import { RESTAURANT_STAFF_ROLE_LABELS } from '../../types/restaurant-staff-role';

type RolePickerProps = {
  roles: RestaurantStaffEnum[];
  selectedRole: RestaurantStaffEnum | null;
  onSelect: (role: RestaurantStaffEnum) => void;
};

const RolePicker = ({ roles, selectedRole, onSelect }: RolePickerProps) => {
  return (
    <View style={styles.rolePillsRow}>
      {roles.map((role) => {
        const isActive = selectedRole === role;
        return (
          <Pressable
            key={role}
            style={[styles.rolePill, isActive ? styles.rolePillActive : styles.rolePillInactive]}
            onPress={() => onSelect(role)}>
            <Text style={[styles.rolePillText, isActive ? styles.rolePillTextActive : styles.rolePillTextInactive]}>
              {RESTAURANT_STAFF_ROLE_LABELS[role]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  rolePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
  },
  rolePill: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
  },
  rolePillActive: {
    backgroundColor: COLORS.primary.terracota,
    borderColor: COLORS.primary.terracota,
  },
  rolePillInactive: {
    backgroundColor: COLORS.common.blanco,
    borderColor: COLORS.surface.borde_calido,
  },
  rolePillText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
  },
  rolePillTextActive: {
    color: COLORS.common.blanco,
  },
  rolePillTextInactive: {
    color: COLORS.primary.terracota,
  },
});

export default RolePicker;
