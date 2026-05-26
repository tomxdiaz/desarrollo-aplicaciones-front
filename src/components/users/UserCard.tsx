import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppRoleEnum, AppUser } from '../../types/types';
import { appUserService } from '../../services/app_user.service';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';

const ROLE_LABELS: Record<AppRoleEnum, string> = {
  [AppRoleEnum.SUPER_USER]: 'Super User',
  [AppRoleEnum.OWNER]: 'Owner',
  [AppRoleEnum.USER]: 'User',
};

const assignableRoles = Object.values(AppRoleEnum);

type UserCardProps = {
  user: AppUser;
  onUserUpdated?: (user: AppUser) => void;
};

const UserCard = ({ user, onUserUpdated }: UserCardProps) => {
  const [updatingRole, setUpdatingRole] = useState<AppRoleEnum | null>(null);

  const rolesToShow = assignableRoles.filter((role) => role !== user.global_role);
  const isUpdating = updatingRole !== null;

  const handleRolePress = async (role: AppRoleEnum) => {
    try {
      setUpdatingRole(role);
      const updated = await appUserService.updateUserRole({ appUserId: user.id, role });
      onUserUpdated?.(updated);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setUpdatingRole(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.currentRole}>{ROLE_LABELS[user.global_role]}</Text>
      </View>

      {!isUpdating && (
        <View style={styles.roles}>
          {rolesToShow.map((role) => (
            <TouchableOpacity key={role} style={styles.roleButton} onPress={() => handleRolePress(role)}>
              <Text style={styles.roleButtonText}>Hacer {ROLE_LABELS[role]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.medium,
    gap: SPACING.medium,
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.medium,
  },
  header: {
    gap: SPACING.small,
  },
  email: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '600',
    color: COLORS.common.negro_principal,
  },
  currentRole: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
    fontWeight: '600',
    backgroundColor: `${COLORS.primary.arena_calida}44`,
    alignSelf: 'flex-start',
    paddingRight: SPACING.small,
    paddingLeft: SPACING.small,
    paddingTop: SPACING.extra_small,
    paddingBottom: SPACING.extra_small,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  roles: {
    flexDirection: 'column',
    gap: SPACING.small,
  },
  roleButton: {
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '500',
    color: COLORS.primary.caramelo,
  },
});
