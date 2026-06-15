import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { RestaurantTable, RestaurantTableStatusEnum } from '../../../types/types';

const TableDetailPanel = ({
  table,
  canManage,
  canFree,
  onViewOrders,
  onCloseTable,
  onDeleteTable,
}: {
  table: RestaurantTable;
  canManage: boolean;
  canFree: boolean;
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
      <View style={styles.titleRow}>
        <Text style={styles.title}>Mesa {table.code}</Text>
        <View style={styles.statusPill}>
          <View style={[styles.dot, isFree ? styles.dotFree : styles.dotOccupied]} />
          <Text style={[styles.statusText, isFree ? styles.statusFree : styles.statusOccupied]}>
            {isFree ? 'Libre' : 'Activa'}
          </Text>
        </View>
      </View>
      {table.area ? <Text style={styles.detail}>Área: {table.area}</Text> : null}
      <Text style={styles.detail}>Capacidad: {table.capacity} personas</Text>

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
          {canFree ? (
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
    borderColor: COLORS.surface.borde_calido,
    padding: SPACING.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.small,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.extra_small,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.surface.fondo_crema,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  dotFree: {
    backgroundColor: COLORS.surface.verde_texto,
  },
  dotOccupied: {
    backgroundColor: COLORS.surface.rojo_texto,
  },
  statusText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  statusFree: {
    color: COLORS.surface.verde_texto,
  },
  statusOccupied: {
    color: COLORS.surface.rojo_texto,
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
