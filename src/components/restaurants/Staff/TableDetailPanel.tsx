import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { RestaurantTable, RestaurantTableStatusEnum } from '../../../types/types';

const TableDetailPanel = ({
  table,
  canManage,
  onViewOrders,
  onCloseTable,
  onDeleteTable,
}: {
  table: RestaurantTable;
  canManage: boolean;
  onViewOrders: (tableId: number) => void;
  onCloseTable: (table: RestaurantTable) => void;
  onDeleteTable: (table: RestaurantTable) => void;
}) => {
  const isFree = table.status === RestaurantTableStatusEnum.FREE;

  const handleDelete = () => {
    Alert.alert('Eliminar mesa', `¿Eliminar la mesa ${table.code}? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onDeleteTable(table) },
    ]);
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Mesa {table.code}</Text>
      {table.area ? <Text style={styles.detail}>Área: {table.area}</Text> : null}
      <Text style={styles.detail}>Capacidad: {table.capacity} personas</Text>
      <Text style={styles.detail}>Estado: {isFree ? 'Libre' : 'Activa'}</Text>

      {isFree ? (
        <>
          <Text style={styles.hint}>Mesa disponible</Text>
          {canManage ? (
            <Pressable style={styles.dangerButton} onPress={handleDelete}>
              <Text style={styles.dangerButtonText}>Eliminar mesa</Text>
            </Pressable>
          ) : null}
        </>
      ) : (
        <>
          <Pressable style={styles.primaryButton} onPress={() => onViewOrders(table.id)}>
            <Text style={styles.primaryButtonText}>Ver pedido</Text>
          </Pressable>
          {canManage ? (
            <Pressable style={styles.outlineButton} onPress={() => onCloseTable(table)}>
              <Text style={styles.outlineButtonText}>Cerrar mesa y liberar</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    marginTop: SPACING.medium,
    gap: SPACING.small,
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    padding: SPACING.large,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  detail: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  hint: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    marginBottom: SPACING.small,
  },
  primaryButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  primaryButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
  },
  outlineButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
  },
  outlineButtonText: {
    color: COLORS.primary.caramelo,
    fontWeight: '700',
  },
  dangerButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.status.error,
  },
  dangerButtonText: {
    color: COLORS.status.error,
    fontWeight: '700',
  },
});

export default TableDetailPanel;
