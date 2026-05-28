import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Restaurant } from '../../types/types';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/font_sizes';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const MyRestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  const handlePress = () => {
    router.push(`/my-restaurants/${restaurant.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Image style={styles.backgroundImage} source={require('../../../assets/images/restaurant.jpg')} />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.restaurantInfo}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.address}>{restaurant.address}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    height: 150,
    width: '100%',
    borderRadius: BORDER_RADIUS.medium,
  },
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  restaurantInfo: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: SPACING.small,
    padding: SPACING.medium,
  },
  name: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: 800,
  },
  address: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_small,
    fontWeight: 600,
  },
});

export default MyRestaurantCard;
