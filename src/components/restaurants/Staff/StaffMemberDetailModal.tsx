import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { canManageMember, getAssignableRoles } from '../../../utils/staffPermissions';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { RestaurantStaff, RestaurantStaffEnum } from '../../../types/types';
import { RESTAURANT_STAFF_ROLE_LABELS, getRestaurantStaffRoleStyle } from '../../../types/restaurant-staff-role';

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
    <Modal visible={visible} transparent animationType='fade' onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        {/* Prevent tap-through from closing the modal when touching the sheet */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          {member ? (
            <>
              <View style={styles.header}>
                <View style={styles.headerTexts}>
                  <Text style={styles.title}>Integrante del equipo</Text>
                  <Text style={styles.subtitle}>{member.user_id.slice(0, 8)}...</Text>
                </View>
                <Pressable
                  style={styles.closeButton}
                  onPress={handleClose}
                  accessibilityRole='button'
                  accessibilityLabel='Cerrar'
                >
                  <Ionicons name='close' size={ICON_SIZES.small} color={COLORS.common.gris_oscuro} />
                </Pressable>
              </View>

              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: `${roleColor}1A` }]}>
                  <View style={[styles.dot, { backgroundColor: roleColor }]} />
                  <Text style={[styles.badgeText, { color: roleColor }]}>
                    {RESTAURANT_STAFF_ROLE_LABELS[member.role]}
                  </Text>
                </View>
                {isSelf ? <Text style={styles.selfLabel}>(Vos)</Text> : null}
              </View>

              {canManage ? (
                <>
                  <View style={styles.roleChangeSection}>
                    <Text style={styles.sectionLabel}>Cambiar rol</Text>
                    <View style={styles.rolePillsRow}>
                      {assignableRoles.map((role) => {
                        const isActive = pendingRole === role;
                        return (
                          <Pressable
                            key={role}
                            style={[styles.rolePill, isActive ? styles.rolePillActive : styles.rolePillInactive]}
                            onPress={() => setPendingRole(role)}
                          >
                            <Text
                              style={[styles.rolePillText, isActive ? styles.rolePillTextActive : styles.rolePillTextInactive]}
                            >
                              {RESTAURANT_STAFF_ROLE_LABELS[role]}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface.fondo_crema,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    padding: SPACING.large,
    gap: SPACING.medium,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.small,
  },
  headerTexts: {
    flexShrink: 1,
    gap: SPACING.extra_small,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  subtitle: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  closeButton: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
  },
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
