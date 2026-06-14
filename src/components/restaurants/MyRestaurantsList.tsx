import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CreateRestaurantPayload, Restaurant, AppRoleEnum } from '../../types/types';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import MyRestaurantCard from './MyRestaurantCard';
import CreateRestaurantModal from './CreateRestaurantModal';
import { FONT_SIZES } from '../../constants/font_sizes';
import { COLORS } from '../../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { useAuth } from '../../providers/auth.provider';
import { isRole } from '../../utils/role';
import { restaurantService } from '../../services/restaurant.service';

const MyRestaurantsList = ({
  restaurants,
  onRestaurantCreated,
}: {
  restaurants: Restaurant[];
  onRestaurantCreated: (restaurant: Restaurant) => void;
}) => {
  const { appUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const canCreateRestaurant = appUser && isRole(appUser, [AppRoleEnum.SUPER_USER, AppRoleEnum.OWNER]);

  const handleCreate = async (payload: CreateRestaurantPayload) => {
    const created = await restaurantService.createRestaurant(payload);
    onRestaurantCreated(created);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Restaurantes</Text>

      <View style={styles.list}>
        {restaurants && restaurants.length > 0 ? (
          restaurants.map((restaurant) => <MyRestaurantCard key={restaurant.id} restaurant={restaurant} />)
        ) : (
          <Text style={styles.unavailableText}>{'No formas parte del personal de ningun restaurante :('}</Text>
        )}
      </View>

      {canCreateRestaurant ? (
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)} accessibilityRole='button' accessibilityLabel='Crear restaurante'>
          <AntDesign name='plus' size={ICON_SIZES.medium} color={COLORS.common.blanco} />
        </TouchableOpacity>
      ) : null}

      <CreateRestaurantModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: SPACING.large,
    gap: SPACING.large,
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
  addButton: {
    position: 'absolute',
    bottom: SPACING.large,
    right: SPACING.large,
    backgroundColor: COLORS.primary.terracota,
    borderRadius: BORDER_RADIUS.small,
    width: 65,
    height: 65,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyRestaurantsList;
