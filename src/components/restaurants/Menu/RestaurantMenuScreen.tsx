import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { useEffect, useState } from 'react';
import { Restaurant } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';

type RestaurantMenuScreenProps = {
  id: string;
  table?: string;
};

const RestaurantMenuScreen = ({ id, table }: RestaurantMenuScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurant = await restaurantService.getRestaurantById(id);
        setRestaurant(restaurant);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={COLORS.primary.terracota} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant?.name}</Text>
      {table ? <Text style={styles.tableLabel}>Mesa: {table}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.gris_muy_claro,
    padding: SPACING.large,
    gap: SPACING.small,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  subtitle: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  tableLabel: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.terracota,
  },
});

export default RestaurantMenuScreen;
