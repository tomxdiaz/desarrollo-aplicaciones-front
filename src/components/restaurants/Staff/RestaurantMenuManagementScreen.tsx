import { useMemo, useState } from 'react';
import { Alert, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CreateProductPayload, Menu, Product, RestaurantStaffEnum } from '../../../types/types';
import { menuService } from '../../../services/menu.service';
import { canManageMenu } from '../../../utils/staffPermissions';
import { formatPrice, getActiveCategories } from '../../../utils/menu';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import MenuCategoryModal from './MenuCategoryModal';
import MenuProductFormModal from './MenuProductFormModal';
import DeleteMenuItemModal from './DeleteMenuItemModal';

type DeleteState =
  | { type: 'product'; id: number; name: string }
  | { type: 'category'; id: number; name: string }
  | null;

const RestaurantMenuManagementScreen = ({
  restaurantId,
  staffRole,
  menu,
  onRefresh,
}: {
  restaurantId: string;
  staffRole: RestaurantStaffEnum;
  menu: Menu | undefined;
  onRefresh: () => Promise<void>;
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<number[]>([]);

  const categories = useMemo(() => getActiveCategories(menu), [menu]);
  const manageMenu = canManageMenu(staffRole);
  const activeProductsCount = useMemo(
    () => categories.reduce((total, category) => total + (category.products ?? []).filter((product) => product.active).length, 0),
    [categories],
  );

  const visibleProductsByCategory = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        products: (category.products ?? []).filter((product) => product.active),
      })),
    [categories],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleCreateCategory = async (name: string) => {
    await menuService.createCategory(restaurantId, { name });
    await onRefresh();
  };

  const handleCreateProduct = async (payload: CreateProductPayload) => {
    await menuService.createProduct(restaurantId, payload);
    await onRefresh();
  };

  const handleUpdateProduct = async (payload: CreateProductPayload) => {
    if (!editingProduct) return;
    await menuService.updateProduct(restaurantId, String(editingProduct.id), payload);
    await onRefresh();
    setEditingProduct(null);
  };

  const handleDelete = async () => {
    if (!deleteState) return;

    setDeleteSubmitting(true);

    try {
      if (deleteState.type === 'product') {
        await menuService.deleteProduct(restaurantId, String(deleteState.id));
      } else {
        await menuService.deleteCategory(restaurantId, String(deleteState.id));
      }

      await onRefresh();
      setDeleteState(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      Alert.alert('Error', deleteState.type === 'product' ? 'No se pudo eliminar el producto.' : 'No se pudo eliminar la categoría.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setCollapsedCategoryIds((current) =>
      current.includes(categoryId) ? current.filter((item) => item !== categoryId) : [...current, categoryId],
    );
  };

  const isExpanded = (categoryId: number) => !collapsedCategoryIds.includes(categoryId);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary.terracota]} />}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.summaryText}>
          {activeProductsCount} productos · {categories.length} categorías
        </Text>

        {manageMenu ? (
          <View style={styles.actionsRow}>
            <Pressable style={styles.secondaryAction} onPress={() => setCategoryModalVisible(true)}>
              <Ionicons name='add-circle-outline' size={ICON_SIZES.small} color={COLORS.primary.terracota} />
              <Text style={styles.secondaryActionText}>Nueva categoría</Text>
            </Pressable>

            <Pressable
              style={[styles.primaryAction, categories.length === 0 && styles.primaryActionDisabled]}
              onPress={() => {
                setEditingProduct(null);
                setProductModalVisible(true);
              }}
              disabled={categories.length === 0}>
              <Ionicons name='add' size={ICON_SIZES.small} color={COLORS.common.blanco} />
              <Text style={styles.primaryActionText}>Nuevo producto</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.readOnlyBanner}>
            <Ionicons name='eye-outline' size={ICON_SIZES.small} color={COLORS.primary.caramelo} />
            <Text style={styles.readOnlyText}>Vista de solo lectura: podés ver el menú, pero no editarlo.</Text>
          </View>
        )}

        {categories.length === 0 ? <Text style={styles.emptyText}>Todavía no hay categorías cargadas en este menú.</Text> : null}

        {visibleProductsByCategory.map((category) => {
          const expanded = isExpanded(category.id);

          return (
            <View key={category.id} style={styles.categoryBlock}>
              <View style={styles.categoryHeader}>
                <Pressable style={styles.categoryTitleRow} onPress={() => toggleCategory(category.id)}>
                  <View style={styles.categoryMarker} />
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <View style={styles.counterPill}>
                    <Text style={styles.counterPillText}>{category.products.length}</Text>
                  </View>
                </Pressable>

                <View style={styles.categoryActions}>
                  {manageMenu ? (
                    <Pressable style={styles.iconButtonSoft} onPress={() => setDeleteState({ type: 'category', id: category.id, name: category.name })}>
                      <Ionicons name='trash-outline' size={ICON_SIZES.small} color={COLORS.surface.rojo_texto} />
                    </Pressable>
                  ) : null}
                  <Pressable style={styles.iconButtonSoft} onPress={() => toggleCategory(category.id)}>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={ICON_SIZES.small} color={COLORS.common.gris_oscuro} />
                  </Pressable>
                </View>
              </View>

              {expanded ? (
                <View style={styles.categoryContent}>
                  {category.products.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                      {product.image ? (
                        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode='cover' />
                      ) : (
                        <View style={[styles.productImage, styles.productImagePlaceholder]}>
                          <Ionicons name='image-outline' size={ICON_SIZES.large} color={COLORS.surface.borde_calido} />
                        </View>
                      )}

                      <View style={styles.productBody}>
                        <Text style={styles.productName}>{product.name}</Text>
                        {product.description ? (
                          <Text style={styles.productDescription} numberOfLines={2}>
                            {product.description}
                          </Text>
                        ) : (
                          <Text style={styles.productDescriptionMuted}>Sin descripción.</Text>
                        )}
                        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                      </View>

                      {manageMenu ? (
                        <View style={styles.productActions}>
                          <Pressable
                            style={styles.iconButtonSoft}
                            onPress={() => {
                              setEditingProduct(product);
                              setProductModalVisible(true);
                            }}>
                            <MaterialCommunityIcons name='pencil-outline' size={ICON_SIZES.small} color={COLORS.primary.caramelo} />
                          </Pressable>
                          <Pressable
                            style={styles.iconButtonSoft}
                            onPress={() => setDeleteState({ type: 'product', id: product.id, name: product.name })}>
                            <Ionicons name='trash-outline' size={ICON_SIZES.small} color={COLORS.surface.rojo_texto} />
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  ))}

                  {manageMenu ? (
                    <Pressable
                      style={styles.addInlineButton}
                      onPress={() => {
                        setEditingProduct(null);
                        setProductModalVisible(true);
                      }}>
                      <Ionicons name='add' size={ICON_SIZES.small} color={COLORS.primary.caramelo} />
                      <Text style={styles.addInlineButtonText}>Agregar en {category.name}</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <MenuCategoryModal
        visible={categoryModalVisible}
        existingNames={categories.map((category) => category.name)}
        onClose={() => setCategoryModalVisible(false)}
        onCreate={handleCreateCategory}
      />

      <MenuProductFormModal
        visible={productModalVisible}
        categories={categories}
        product={editingProduct}
        onClose={() => {
          setProductModalVisible(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
      />

      <DeleteMenuItemModal
        visible={deleteState !== null}
        title={deleteState?.type === 'product' ? 'Eliminar producto' : 'Eliminar categoría'}
        description={
          deleteState?.type === 'product'
            ? `¿Eliminás ${deleteState.name}? Esta acción no se puede deshacer.`
            : `¿Eliminás ${deleteState?.name}? La categoría dejará de estar disponible en el menú.`
        }
        confirmLabel='Eliminar'
        onClose={() => setDeleteState(null)}
        onConfirm={handleDelete}
        submitting={deleteSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.medium,
    paddingBottom: SPACING.extra_large,
    gap: SPACING.medium,
  },
  summaryText: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'column',
    gap: SPACING.small,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1.5,
    borderColor: COLORS.primary.terracota,
    backgroundColor: COLORS.common.blanco,
    paddingVertical: SPACING.medium,
  },
  secondaryActionText: {
    color: COLORS.primary.terracota,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
    paddingVertical: SPACING.medium,
  },
  primaryActionDisabled: {
    opacity: 0.55,
  },
  primaryActionText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    backgroundColor: COLORS.surface.tarjeta_calida,
    padding: SPACING.medium,
  },
  readOnlyText: {
    flex: 1,
    color: COLORS.primary.caramelo,
    fontSize: FONT_SIZES.text_base,
    lineHeight: 22,
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
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  categoryContent: {
    gap: SPACING.small,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    backgroundColor: COLORS.common.blanco,
    padding: SPACING.small,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  productImage: {
    width: 78,
    height: 78,
    borderRadius: BORDER_RADIUS.medium,
  },
  productImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface.fondo_crema,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
  },
  productBody: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  productDescription: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_small,
    lineHeight: 20,
  },
  productDescriptionMuted: {
    color: COLORS.common.gris_medio,
    fontSize: FONT_SIZES.text_small,
  },
  productPrice: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
  },
  productActions: {
    gap: SPACING.small,
  },
  iconButtonSoft: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface.fondo_crema,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
  },
  addInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.small,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.surface.borde_calido,
    paddingVertical: SPACING.medium,
  },
  addInlineButtonText: {
    color: COLORS.primary.caramelo,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default RestaurantMenuManagementScreen;
