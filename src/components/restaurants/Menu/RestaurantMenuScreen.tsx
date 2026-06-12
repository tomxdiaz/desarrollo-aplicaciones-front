import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { Restaurant, RestaurantTable } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { useCart } from '../../../providers/cart.provider';
import MenuCategoryTabs from './MenuCategoryTabs';
import MenuProductCard from './MenuProductCard';
import { formatPrice, getActiveCategories } from '../../../utils/menu';
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
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<number[]>([]);

  const categories = useMemo(() => getActiveCategories(restaurant?.menu), [restaurant?.menu]);

  const visibleCategories = useMemo(() => {
    const base = categories.map((category) => ({
      ...category,
      products: (category.products ?? []).filter((p) => p.active),
    }));
    if (selectedCategoryId === null) return base;
    return base.filter((c) => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);
        if (tableCode) {
          const table = data.tables?.find((table) => table.code === tableCode);
          if (!table) {
            Alert.alert('Mesa no encontrada', 'Esa mesa no existe en este restaurante.');
            router.back();
            return;
          }
          setSelectedTable(table);
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

  const toggleCategory = (categoryId: number) => {
    setCollapsedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((item) => item !== categoryId)
        : [...current, categoryId],
    );
  };

  const isExpanded = (categoryId: number) => !collapsedCategoryIds.includes(categoryId);

  if (loading) return <LoadingSpinner />;
  if (!restaurant) return <Redirect href='/restaurants' />;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MenuCategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        {visibleCategories.length === 0 ? (
          <Text style={styles.emptyText}>No hay productos disponibles.</Text>
        ) : null}

        {visibleCategories.map((category) => {
          const expanded = isExpanded(category.id);

          return (
            <View key={category.id} style={styles.categoryBlock}>
              <Pressable style={styles.categoryHeader} onPress={() => toggleCategory(category.id)}>
                <View style={styles.categoryTitleRow}>
                  <View style={styles.categoryMarker} />
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <View style={styles.counterPill}>
                    <Text style={styles.counterPillText}>{category.products.length}</Text>
                  </View>
                </View>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={ICON_SIZES.small}
                  color={COLORS.common.gris_oscuro}
                />
              </Pressable>

              {expanded ? (
                <View style={styles.categoryContent}>
                  {category.products.length === 0 ? (
                    <Text style={styles.emptyCategoryText}>Sin productos en esta categoría.</Text>
                  ) : (
                    category.products.map((product) => (
                      <MenuProductCard
                        key={product.id}
                        product={product}
                        hasTable={hasTable}
                        quantity={getProductQuantity(product.id)}
                        onAdd={() => addProduct(product)}
                        onIncrement={() => incrementProduct(product.id)}
                        onDecrement={() => decrementProduct(product.id)}
                      />
                    ))
                  )}
                </View>
              ) : null}
            </View>
          );
        })}
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
    backgroundColor: COLORS.surface.fondo_crema,
  },
  scrollContent: {
    padding: SPACING.medium,
    gap: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  emptyText: {
    marginTop: SPACING.large,
    textAlign: 'center',
    color: COLORS.common.gris_medio,
    fontSize: FONT_SIZES.text_base,
  },
  categoryBlock: {
    gap: SPACING.small,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.small,
    paddingVertical: SPACING.small,
  },
  categoryTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  categoryMarker: {
    width: 6,
    height: 24,
    borderRadius: 999,
    backgroundColor: COLORS.primary.terracota,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  counterPill: {
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.surface.tarjeta_calida,
    paddingHorizontal: SPACING.small,
    paddingVertical: 3,
  },
  counterPillText: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_small,
  },
  categoryContent: {
    gap: SPACING.small,
  },
  emptyCategoryText: {
    textAlign: 'center',
    color: COLORS.common.gris_medio,
    fontSize: FONT_SIZES.text_small,
    paddingVertical: SPACING.medium,
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
