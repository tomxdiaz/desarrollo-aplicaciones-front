import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { RestaurantTable, RestaurantTableStatusEnum } from '../../../types/types';

const TableCard = ({
  table,
  isSelected,
  onPress,
}: {
  table: RestaurantTable;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const isFree = table.status === RestaurantTableStatusEnum.FREE;

  return (
    <Pressable
      style={[styles.card, isFree ? styles.cardFree : styles.cardOccupied, isSelected && styles.cardSelected]}
      onPress={onPress}
    >
      <Text style={styles.code}>{table.code}</Text>

      <View style={styles.statusRow}>
        <View style={[styles.dot, isFree ? styles.dotFree : styles.dotOccupied]} />
        <Text style={[styles.statusText, isFree ? styles.statusFree : styles.statusOccupied]}>
          {isFree ? 'Libre' : 'Activa'}
        </Text>
      </View>

      {table.area ? <Text style={styles.area}>{table.area}</Text> : null}
      <Text style={styles.capacity}>Capacidad: {table.capacity} personas</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    minHeight: 120,
    gap: SPACING.extra_small,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    padding: SPACING.medium,
  },
  cardFree: {
    backgroundColor: COLORS.surface.verde_suave,
    borderColor: COLORS.surface.borde_verde,
  },
  cardOccupied: {
    backgroundColor: COLORS.surface.rojo_suave,
    borderColor: COLORS.surface.borde_rojo,
  },
  cardSelected: {
    borderColor: COLORS.primary.terracota,
    borderWidth: 2,
  },
  code: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
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
  area: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
  capacity: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
});

export default TableCard;
