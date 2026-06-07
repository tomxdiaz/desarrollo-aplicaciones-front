import { Pressable, StyleSheet, Text } from 'react-native';
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
    <Pressable style={[styles.card, isSelected && styles.cardSelected]} onPress={onPress}>
      <Text style={styles.code}>{table.code}</Text>
      {table.area ? <Text style={styles.area}>{table.area}</Text> : null}
      <Text style={[styles.statusBadge, isFree ? styles.statusFree : styles.statusOccupied]}>
        {isFree ? 'Libre' : 'Activa'}
      </Text>
      <Text style={styles.capacity}>Capacidad: {table.capacity} personas</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    gap: SPACING.extra_small,
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    padding: SPACING.medium,
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
  area: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
  statusBadge: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  statusFree: {
    color: COLORS.common.gris_medio,
  },
  statusOccupied: {
    color: COLORS.secondary.verde_oliva,
  },
  capacity: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
});

export default TableCard;
