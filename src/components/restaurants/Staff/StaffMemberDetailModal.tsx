import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import BottomSheetModal from '../../shared/BottomSheetModal';
import ModalHeader from '../../shared/ModalHeader';
import { canManageMember, getAssignableRoles } from '../../../utils/staffPermissions';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { RestaurantStaff, RestaurantStaffEnum } from '../../../types/types';
import { RESTAURANT_STAFF_ROLE_LABELS, getRestaurantStaffRoleStyle } from '../../../types/restaurant-staff-role';
import RolePicker from '../../shared/RolePicker';

const StaffMemberDetailModal = ({
  member,
  visible,
  currentUserRole,
  currentUserId,
  onClose,
  onChangeRole,
  onRemove,
}: {
  member: RestaurantStaff | null;
  visible: boolean;
  currentUserRole: RestaurantStaffEnum;
  currentUserId: string;
  onClose: () => void;
  onChangeRole: (member: RestaurantStaff, newRole: RestaurantStaffEnum) => void;
  onRemove: (member: RestaurantStaff) => void;
}) => {
  const [pendingRole, setPendingRole] = useState<RestaurantStaffEnum | null>(null);

  useEffect(() => {
    if (!visible) setPendingRole(null);
  }, [visible]);

  const handleClose = () => {
    setPendingRole(null);
    onClose();
  };

  const handleConfirmRole = () => {
    if (!member || !pendingRole || pendingRole === member.role) return;
    onChangeRole(member, pendingRole);
  };

  const handleRemove = () => {
    if (!member) return;
    Alert.alert('Eliminar del equipo', '¿Eliminar a este integrante del restaurante? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onRemove(member) },
    ]);
  };

  const isSelf = member?.user_id === currentUserId;
  const canManage = !isSelf && !!member && canManageMember(currentUserRole, member.role);
  const assignableRoles = getAssignableRoles(currentUserRole);

  const roleStyle = member ? getRestaurantStaffRoleStyle(member.role) : null;
  const roleColor = roleStyle?.color ?? COLORS.common.gris_oscuro;

  const canConfirm = canManage && pendingRole !== null && pendingRole !== member?.role;

  return (
    <BottomSheetModal visible={visible} onClose={handleClose}>
          {member ? (
            <>
              <ModalHeader
                title='Integrante del equipo'
                subtitle={member.app_user.email}
                onClose={handleClose}
              />

              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: `${roleColor}1A` }]}>
                  <View style={[styles.dot, { backgroundColor: roleColor }]} />
                  <Text style={[styles.badgeText, { color: roleColor }]}>{RESTAURANT_STAFF_ROLE_LABELS[member.role]}</Text>
                </View>
                {isSelf ? <Text style={styles.selfLabel}>(Vos)</Text> : null}
              </View>

              {canManage ? (
                <>
                  <View style={styles.roleChangeSection}>
                    <Text style={styles.sectionLabel}>Cambiar rol</Text>
                    <RolePicker
                      roles={assignableRoles}
                      selectedRole={pendingRole}
                      onSelect={setPendingRole}
                    />
                  </View>

                  {canConfirm ? (
                    <Pressable style={styles.confirmButton} onPress={handleConfirmRole}>
                      <Text style={styles.confirmButtonText}>Confirmar cambio</Text>
                    </Pressable>
                  ) : null}

                  <Pressable style={styles.removeButton} onPress={handleRemove}>
                    <Text style={styles.removeButtonText}>Eliminar del equipo</Text>
                  </Pressable>
                </>
              ) : null}
            </>
          ) : null}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    alignSelf: 'flex-start',
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
  roleChangeSection: {
    gap: SPACING.small,
    paddingTop: SPACING.small,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface.borde_calido,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  confirmButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  confirmButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  removeButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.status.error,
    backgroundColor: COLORS.common.blanco,
  },
  removeButtonText: {
    color: COLORS.status.error,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default StaffMemberDetailModal;
