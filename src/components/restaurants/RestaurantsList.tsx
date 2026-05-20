import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Restaurant } from '../../types/types';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import RestaurantCard from './RestaurantCard';
import { FONT_SIZES } from '../../constants/font_sizes';
import { COLORS } from '../../constants/colors';
import { useState } from 'react';

const RestaurantsList = ({ restaurants }: { restaurants: Restaurant[] }) => {
  const [searchText, setSearchText] = useState('');
  const filteredRestaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurantes</Text>

      <TextInput style={styles.input} placeholder='Buscar restaurantes...' value={searchText} onChangeText={setSearchText} />

      <View style={styles.list}>
        {filteredRestaurants && filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)
        ) : (
          <Text style={styles.unavailableText}>{'No hay restaurantes disponibles :('}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: SPACING.large,
    gap: SPACING.large,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
    fontSize: FONT_SIZES.text_large,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.medium,
  },
  unavailableText: {
    fontSize: FONT_SIZES.text_large,
    color: COLORS.common.gris_oscuro,
  },
});

export default RestaurantsList;
