import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { RestaurantStaff } from '../../../types/types';
import { RESTAURANT_STAFF_ROLE_LABELS, getRestaurantStaffRoleStyle } from '../../../types/restaurant-staff-role';

const StaffMemberCard = ({
  member,
  isCurrentUser,
  onPress,
}: {
  member: RestaurantStaff;
  isCurrentUser: boolean;
  onPress: () => void;
}) => {
  const { color } = getRestaurantStaffRoleStyle(member.role);
  const label = RESTAURANT_STAFF_ROLE_LABELS[member.role];

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole='button'>
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: `${color}1A` }]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.badgeText, { color }]}>{label}</Text>
        </View>
        {isCurrentUser ? <Text style={styles.selfLabel}>(Vos)</Text> : null}
      </View>
      <Text style={styles.userId}>{member.user_id.slice(0, 8)}...</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    gap: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  selfLabel: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  userId: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
});

export default StaffMemberCard;
