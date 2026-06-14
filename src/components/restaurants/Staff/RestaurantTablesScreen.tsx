import { useCallback, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { canManageTables } from '../../../utils/staffPermissions';
import { tableService } from '../../../services/table.service';
import { CreateTablePayload, RestaurantStaffEnum, RestaurantTable, RestaurantTableStatusEnum } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import TableCard from './TableCard';
import TableDetailPanel from './TableDetailPanel';
import CreateTableModal from './CreateTableModal';

const RestaurantTablesScreen = ({
  restaurantId,
  staffRole,
  tables,
  onTablesChange,
  onRefresh,
  onViewOrdersForTable,
}: {
  restaurantId: string;
  staffRole: RestaurantStaffEnum;
  tables: RestaurantTable[];
  onTablesChange: (tables: RestaurantTable[]) => void;
  onRefresh: () => Promise<void>;
  onViewOrdersForTable: (tableId: number) => void;
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const canManage = canManageTables(staffRole);
  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? null;

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleSelect = (tableId: number) => {
    setSelectedTableId((current) => (current === tableId ? null : tableId));
  };

  const handleCreate = async (payload: CreateTablePayload) => {
    const created = await tableService.createTable(restaurantId, payload);
    onTablesChange([...tables, created]);
  };

  const handleCloseTable = async (table: RestaurantTable) => {
    try {
      const updated = await tableService.updateTableStatus(restaurantId, String(table.id), RestaurantTableStatusEnum.FREE);
      onTablesChange(tables.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error('Error closing table:', error);
      Alert.alert('Error', 'No se pudo cerrar la mesa. Intentá de nuevo.');
    }
  };

  const handleDeleteTable = async (table: RestaurantTable) => {
    try {
      await tableService.deleteTable(restaurantId, String(table.id));
      onTablesChange(tables.filter((item) => item.id !== table.id));
      setSelectedTableId(null);
    } catch (error) {
      console.error('Error deleting table:', error);
      Alert.alert('Error', 'No se pudo eliminar la mesa. Intentá de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary.terracota]} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {tables.map((table) => (
            <TableCard key={table.id} table={table} isSelected={table.id === selectedTableId} onPress={() => handleSelect(table.id)} />
          ))}
          {canManage ? (
            <Pressable style={styles.addCard} onPress={() => setModalVisible(true)}>
              <Ionicons name='add' size={ICON_SIZES.large} color={COLORS.primary.caramelo} />
              <Text style={styles.addCardText}>Nueva</Text>
            </Pressable>
          ) : null}
        </View>

        {tables.length === 0 ? <Text style={styles.emptyText}>Todavía no hay mesas cargadas</Text> : null}

        {tables.length > 0 ? (
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotFree]} />
              <Text style={styles.legendText}>Libre</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotActive]} />
              <Text style={styles.legendText}>Activa</Text>
            </View>
          </View>
        ) : null}

        {selectedTable ? (
          <TableDetailPanel
            table={selectedTable}
            canManage={canManage}
            onViewOrders={onViewOrdersForTable}
            onCloseTable={handleCloseTable}
            onDeleteTable={handleDeleteTable}
          />
        ) : null}
      </ScrollView>

      <CreateTableModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.medium,
  },
  addCard: {
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.extra_small,
    minHeight: 120,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1.5,
    borderColor: COLORS.primary.caramelo,
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  emptyText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginTop: SPACING.extra_large,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.large,
    marginTop: SPACING.large,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendDotFree: {
    backgroundColor: COLORS.surface.verde_texto,
  },
  legendDotActive: {
    backgroundColor: COLORS.surface.rojo_texto,
  },
  legendText: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
});

export default RestaurantTablesScreen;
