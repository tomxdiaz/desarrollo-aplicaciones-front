import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { restaurantStaffService } from '../../../services/restaurant_staff.service';
import { canManageStaff } from '../../../utils/staffPermissions';
import { CreateStaffPayload, RestaurantStaff, RestaurantStaffEnum } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import ScreenLoader from '../../shared/ScreenLoader';
import ScreenError from '../../shared/ScreenError';
import StaffMemberCard from './StaffMemberCard';
import AddStaffModal from './AddStaffModal';
import StaffMemberDetailModal from './StaffMemberDetailModal';

type RestaurantStaffScreenProps = Readonly<{
  restaurantId: string;
  currentUserStaffInfo: RestaurantStaff;
}>;

const StaffItemSeparator = () => <View style={styles.itemSeparator} />;

const RestaurantStaffScreen = ({ restaurantId, currentUserStaffInfo }: RestaurantStaffScreenProps) => {
  const [staffList, setStaffList] = useState<RestaurantStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<RestaurantStaff | null>(null);

  const canAdd = canManageStaff(currentUserStaffInfo.role);

  const loadStaff = useCallback(async () => {
    try {
      setError(false);

      const data = await restaurantStaffService.getRestaurantStaff(restaurantId);

      setStaffList(data);
    } catch (err) {
      console.error('Error fetching restaurant staff:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [restaurantId]);

  useFocusEffect(
    useCallback(() => {
      loadStaff().catch((err) => {
        console.error('Unexpected error loading restaurant staff:', err);
      });
    }, [loadStaff]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    loadStaff().catch((err) => {
      console.error('Unexpected error refreshing restaurant staff:', err);
    });
  }, [loadStaff]);

  const handleRetry = useCallback(() => {
    setLoading(true);

    loadStaff().catch((err) => {
      console.error('Unexpected error retrying restaurant staff:', err);
    });
  }, [loadStaff]);

  const handleAdd = useCallback(
    async (payload: CreateStaffPayload) => {
      await restaurantStaffService.addStaff(restaurantId, payload);
      await loadStaff();
    },
    [restaurantId, loadStaff],
  );

  const handleChangeRole = useCallback(
    async (member: RestaurantStaff, newRole: RestaurantStaffEnum) => {
      const snapshot = staffList;

      setStaffList((current) => current.map((item) => (item.user_id === member.user_id ? { ...item, role: newRole } : item)));

      setSelectedMember(null);

      try {
        await restaurantStaffService.updateStaffRole(restaurantId, member.user_id, newRole);
      } catch (err) {
        setStaffList(snapshot);
        console.error('Error updating staff role:', err);

        Alert.alert('Error', 'No se pudo actualizar el rol. Intentá de nuevo.');
      }
    },
    [restaurantId, staffList],
  );

  const handleRemove = useCallback(
    async (member: RestaurantStaff) => {
      const snapshot = staffList;

      setStaffList((current) => current.filter((item) => item.user_id !== member.user_id));

      setSelectedMember(null);

      try {
        await restaurantStaffService.removeStaff(restaurantId, member.user_id);
      } catch (err) {
        setStaffList(snapshot);
        console.error('Error removing staff member:', err);

        Alert.alert('Error', 'No se pudo eliminar al integrante. Intentá de nuevo.');
      }
    },
    [restaurantId, staffList],
  );

  if (loading) return <ScreenLoader />;
  if (error) return <ScreenError message='No se pudo cargar el personal.' onRetry={handleRetry} />;

  return (
    <View style={styles.container}>
      {canAdd ? (
        <View style={styles.addRow}>
          <Pressable style={styles.addButton} onPress={() => setAddModalVisible(true)}>
            <Ionicons name='person-add-outline' size={ICON_SIZES.small} color={COLORS.common.blanco} />

            <Text style={styles.addButtonText}>Agregar personal</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={staffList}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary.terracota]} />}
        renderItem={({ item }) => (
          <StaffMemberCard
            member={item}
            isCurrentUser={item.user_id === currentUserStaffInfo.user_id}
            onPress={() => setSelectedMember(item)}
          />
        )}
        ItemSeparatorComponent={StaffItemSeparator}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay personal registrado</Text>}
      />

      <AddStaffModal
        visible={addModalVisible}
        currentUserRole={currentUserStaffInfo.role}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAdd}
      />

      <StaffMemberDetailModal
        member={selectedMember}
        visible={selectedMember !== null}
        currentUserRole={currentUserStaffInfo.role}
        currentUserId={currentUserStaffInfo.user_id}
        onClose={() => setSelectedMember(null)}
        onChangeRole={handleChangeRole}
        onRemove={handleRemove}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addRow: {
    paddingHorizontal: SPACING.medium,
    paddingTop: SPACING.medium,
    paddingBottom: SPACING.small,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.small,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  addButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  listContent: {
    padding: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  itemSeparator: {
    height: SPACING.small,
  },
  emptyText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginTop: SPACING.extra_large,
  },
});

export default RestaurantStaffScreen;
