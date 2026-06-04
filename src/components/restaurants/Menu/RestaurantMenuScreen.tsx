import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { Restaurant, RestaurantTable } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { useCart } from '../../../providers/cart.provider';
import MenuCategoryTabs from './MenuCategoryTabs';
import MenuProductCard from './MenuProductCard';
import { formatPrice, getActiveCategories, getProductsForCategory } from '../../../utils/menu';
import LoadingSpinner from '../../loading/LoadingSpinner';

type RestaurantMenuScreenProps = {
  id: string;
  tableCode?: string;
};

const RestaurantMenuScreen = ({ id, tableCode }: RestaurantMenuScreenProps) => {
  const {
    setSession,
    getProductQuantity,
    addProduct,
    incrementProduct,
    decrementProduct,
    hasTable,
    cartCount,
    cartTotal,
  } = useCart();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const categories = useMemo(() => getActiveCategories(restaurant?.menu), [restaurant?.menu]);
  const products = useMemo(
    () => getProductsForCategory(restaurant?.menu, selectedCategoryId),
    [restaurant?.menu, selectedCategoryId],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);
        if (tableCode) {
          setSelectedTable(data.tables?.find((table) => table.code === tableCode));
        } else {
          setSelectedTable(undefined);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setRestaurant(null);
        setSelectedTable(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, tableCode]);

  useEffect(() => {
    if (!restaurant) return;

    setSession({
      restaurantId: String(restaurant.id),
      restaurantName: restaurant.name,
      tableCode: selectedTable?.code,
    });
  }, [restaurant, selectedTable, setSession]);

  if (loading) return <LoadingSpinner />;
  if (!restaurant) return <Redirect href='/restaurants' />;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MenuCategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
        <View style={styles.productList}>
          {products.map((product) => (
            <MenuProductCard
              key={product.id}
              product={product}
              hasTable={hasTable}
              quantity={getProductQuantity(product.id)}
              onAdd={() => addProduct(product)}
              onIncrement={() => incrementProduct(product.id)}
              onDecrement={() => decrementProduct(product.id)}
            />
          ))}
        </View>
      </ScrollView>

      {cartCount > 0 && hasTable ? (
        <Pressable style={styles.cartBar} onPress={() => router.push('/(checkout)/cart')}>
          <View style={styles.cartCountBadge}>
            <Text style={styles.cartCountText}>{cartCount}</Text>
          </View>
          <Text style={styles.cartBarLabel}>Ver pedido</Text>
          <Text style={styles.cartBarTotal}>{formatPrice(cartTotal)}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  scrollContent: {
    padding: SPACING.medium,
    gap: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  productList: {
    gap: SPACING.small,
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary.terracota,
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.medium,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    gap: SPACING.small,
  },
  cartCountBadge: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  cartBarLabel: {
    flex: 1,
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
    textAlign: 'center',
  },
  cartBarTotal: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default RestaurantMenuScreen;
