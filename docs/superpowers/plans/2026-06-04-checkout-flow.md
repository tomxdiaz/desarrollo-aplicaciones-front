# Checkout Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the complete order flow: horizontal stepper in the menu → cart screen → confirm order screen → success screen.

**Architecture:** CartProvider is enriched with full `CartItem` objects and moved to the root `_layout.tsx` so the new `(checkout)` route group shares the same cart state as the menu. A reusable `CartStepper` handles horizontal `- count +` UI in both `MenuProductCard` and `CartScreen`. The checkout flow lives in a new `app/(checkout)` group with its own minimal layout (no Header2).

**Tech Stack:** React Native, Expo Router ~6, TypeScript, @expo/vector-icons (AntDesign + MaterialIcons).

---

## File Map

**Modify:**
- `src/providers/cart.provider.tsx` — enrich `CartItem` type, add `addProduct`, `cartTotal`
- `app/_layout.tsx` — add `CartProvider` at root
- `src/components/layout/Layout-2.tsx` — remove `CartProvider` (now at root)
- `src/components/restaurants/Menu/MenuProductCard.tsx` — use `CartStepper`, add `onAdd` prop
- `src/components/restaurants/Menu/RestaurantMenuScreen.tsx` — use `addProduct`, add "Ver pedido" bar
- `src/components/layout/Header-2.tsx` — wire cart icon to `/(checkout)/cart`

**Create:**
- `src/components/shared/CartStepper.tsx`
- `app/(checkout)/_layout.tsx`
- `src/components/cart/CartScreen.tsx`
- `app/(checkout)/cart.tsx`
- `src/components/checkout/ConfirmOrderScreen.tsx`
- `app/(checkout)/confirm.tsx`
- `src/components/checkout/OrderSuccessScreen.tsx`
- `app/(checkout)/success.tsx`

---

## Task 1: Enrich CartProvider

**Files:**
- Modify: `src/providers/cart.provider.tsx`

Replace the entire file. The item store changes from `Record<number, number>` to `CartItem[]`. A new `addProduct(product)` method creates-or-increments. A new `cartTotal` computed value sums `price × quantity`.

- [ ] **Step 1: Replace `src/providers/cart.provider.tsx`**

```tsx
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Product } from '../types/types';

export type CartItem = {
  productId: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  quantity: number;
};

export type CartSession = {
  restaurantId: string;
  restaurantName: string;
  tableCode?: string;
};

type CartContextType = {
  session: CartSession | null;
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  hasTable: boolean;
  setSession: (session: CartSession) => void;
  clearSession: () => void;
  getProductQuantity: (productId: number) => number;
  addProduct: (product: Product) => void;
  incrementProduct: (productId: number) => void;
  decrementProduct: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<CartSession | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const hasTable = Boolean(session?.tableCode);

  const setSession = useCallback((next: CartSession) => {
    setSessionState((prev) => {
      const restaurantChanged = prev?.restaurantId !== next.restaurantId;
      const tableChanged = prev?.tableCode !== next.tableCode;
      if (restaurantChanged || tableChanged) {
        setItems([]);
      }
      return next;
    });
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    setItems([]);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getProductQuantity = useCallback(
    (productId: number) => items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items],
  );

  const addProduct = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const incrementProduct = useCallback((productId: number) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  }, []);

  const decrementProduct = useCallback((productId: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (!item) return prev;
      if (item.quantity <= 1) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  }, []);

  const value = useMemo(
    () => ({
      session,
      items,
      cartCount,
      cartTotal,
      hasTable,
      setSession,
      clearSession,
      getProductQuantity,
      addProduct,
      incrementProduct,
      decrementProduct,
      clearCart,
    }),
    [
      session,
      items,
      cartCount,
      cartTotal,
      hasTable,
      setSession,
      clearSession,
      getProductQuantity,
      addProduct,
      incrementProduct,
      decrementProduct,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/providers/cart.provider.tsx
git commit -m "feat: enrich CartProvider with CartItem[], addProduct, cartTotal"
```

---

## Task 2: Move CartProvider to root + update Layout2

**Files:**
- Modify: `app/_layout.tsx`
- Modify: `src/components/layout/Layout-2.tsx`

`CartProvider` moves to the root so both `(header-2)` and `(checkout)` share the same cart instance.

- [ ] **Step 1: Replace `app/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AuthProvider } from '../src/providers/auth.provider';
import { CartProvider } from '../src/providers/cart.provider';

SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeAreaView}>
            <Stack screenOptions={{ animation: 'fade', headerShown: false }} />
          </SafeAreaView>
        </SafeAreaProvider>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
```

- [ ] **Step 2: Replace `src/components/layout/Layout-2.tsx`**

```tsx
import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../providers/auth.provider';
import Header2 from './Header-2';

export default function Layout2({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();

  if (!appUser && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <View style={styles.layout}>
      <Header2 />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
```

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx src/components/layout/Layout-2.tsx
git commit -m "feat: move CartProvider to root layout"
```

---

## Task 3: Create CartStepper shared component

**Files:**
- Create: `src/components/shared/CartStepper.tsx`

Horizontal `[-] [count] [+]` stepper. When `quantity === 0` the `-` button is disabled and visually dimmed (opacity 0.3). The component is self-contained and uses only constants from the project.

- [ ] **Step 1: Create `src/components/shared/CartStepper.tsx`**

```tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

type CartStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

const CartStepper = ({ quantity, onDecrement, onIncrement }: CartStepperProps) => {
  return (
    <View style={styles.stepper}>
      <Pressable
        style={[styles.button, quantity === 0 && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={quantity === 0}
      >
        <AntDesign name='minus' size={ICON_SIZES.extra_small} color={COLORS.primary.terracota} />
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable style={styles.button} onPress={onIncrement}>
        <AntDesign name='plus' size={ICON_SIZES.extra_small} color={COLORS.primary.terracota} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.extra_small,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  quantity: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
});

export default CartStepper;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shared/CartStepper.tsx
git commit -m "feat: add CartStepper reusable horizontal stepper"
```

---

## Task 4: Update MenuProductCard and RestaurantMenuScreen

**Files:**
- Modify: `src/components/restaurants/Menu/MenuProductCard.tsx`
- Modify: `src/components/restaurants/Menu/RestaurantMenuScreen.tsx`

`MenuProductCard` gains a new `onAdd` prop. When `quantity === 0` and `hasTable`, it shows only a `+` circle button. When `quantity > 0` it shows `CartStepper`. `RestaurantMenuScreen` wires `addProduct` from the provider and adds a sticky "Ver pedido" bar at the bottom when the cart has items.

- [ ] **Step 1: Replace `src/components/restaurants/Menu/MenuProductCard.tsx`**

```tsx
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Product } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { formatPrice } from '../../../utils/menu';
import CartStepper from '../../shared/CartStepper';

type MenuProductCardProps = {
  product: Product;
  hasTable: boolean;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

const PLACEHOLDER_IMAGE = require('../../../../assets/images/restaurant.jpg');

const MenuProductCard = ({
  product,
  hasTable,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: MenuProductCardProps) => {
  const imageSource = product.image ? { uri: product.image } : PLACEHOLDER_IMAGE;

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        {product.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
      {hasTable ? (
        quantity === 0 ? (
          <Pressable style={styles.addButton} onPress={onAdd}>
            <AntDesign name='plus' size={ICON_SIZES.extra_small} color={COLORS.primary.terracota} />
          </Pressable>
        ) : (
          <CartStepper quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    padding: SPACING.small,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.small,
  },
  content: {
    flex: 1,
    gap: SPACING.extra_small,
  },
  name: {
    color: COLORS.common.negro_principal,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  description: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_small,
  },
  price: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuProductCard;
```

- [ ] **Step 2: Replace `src/components/restaurants/Menu/RestaurantMenuScreen.tsx`**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Menu/MenuProductCard.tsx src/components/restaurants/Menu/RestaurantMenuScreen.tsx
git commit -m "feat: update MenuProductCard with CartStepper and add Ver pedido bar"
```

---

## Task 5: Wire Header2 cart button

**Files:**
- Modify: `src/components/layout/Header-2.tsx`

Replace the `handleCartPress` TODO with a `router.push` call. Also remove leftover `console.log` statements.

- [ ] **Step 1: Edit `src/components/layout/Header-2.tsx`**

Replace:
```tsx
  const handleCartPress = () => {
    // TODO: navegar a pantalla de carrito
  };

  console.log('hasTable', hasTable);
  console.log('tableLabel', tableLabel);
```

With:
```tsx
  const handleCartPress = () => {
    router.push('/(checkout)/cart');
  };
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Header-2.tsx
git commit -m "feat: wire Header2 cart button to checkout/cart route"
```

---

## Task 6: Create (checkout) layout

**Files:**
- Create: `app/(checkout)/_layout.tsx`

Minimal Stack layout with auth guard (mirrors the pattern in `Layout-2.tsx`). No `Header2` or any custom header — each screen renders its own.

- [ ] **Step 1: Create `app/(checkout)/_layout.tsx`**

```tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/providers/auth.provider';

export default function CheckoutLayout() {
  const { appUser, loading } = useAuth();

  if (!appUser && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <Stack screenOptions={{ animation: 'slide_from_right', headerShown: false }} />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(checkout)/_layout.tsx
git commit -m "feat: add (checkout) route group layout"
```

---

## Task 7: CartScreen

**Files:**
- Create: `src/components/cart/CartScreen.tsx`
- Create: `app/(checkout)/cart.tsx`

Shows all cart items with `CartStepper`, a summary card (Subtotal / Servicio Incluido / Total), and a "Continuar →" button. Redirects to `/` if the cart is empty.

- [ ] **Step 1: Create `src/components/cart/CartScreen.tsx`**

```tsx
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCart } from '../../providers/cart.provider';
import CartStepper from '../shared/CartStepper';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { formatPrice } from '../../utils/menu';

const PLACEHOLDER_IMAGE = require('../../../assets/images/restaurant.jpg');

const CartScreen = () => {
  const { session, items, cartTotal, incrementProduct, decrementProduct } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/');
    }
  }, [items]);

  if (!session || items.length === 0) return null;

  const tableLabel = `Mesa ${session.tableCode}`;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name='arrowleft' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
        </Pressable>
        <Text style={styles.headerTitle}>{tableLabel}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsList}>
          {items.map((item) => {
            const imageSource = item.image ? { uri: item.image } : PLACEHOLDER_IMAGE;
            return (
              <View key={item.productId} style={styles.itemCard}>
                <Image source={imageSource} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemUnitPrice}>
                    {formatPrice(item.price)} × {item.quantity}
                  </Text>
                </View>
                <CartStepper
                  quantity={item.quantity}
                  onIncrement={() => incrementProduct(item.productId)}
                  onDecrement={() => decrementProduct(item.productId)}
                />
                <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servicio</Text>
            <Text style={styles.summaryValue}>Incluido</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.continueButton} onPress={() => router.push('/(checkout)/confirm')}>
        <Text style={styles.continueText}>Continuar →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.common.blanco,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gris_claro,
  },
  backButton: {
    width: ICON_SIZES.extra_large,
    height: ICON_SIZES.extra_large,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_muy_claro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  headerSpacer: {
    width: ICON_SIZES.extra_large,
  },
  scrollContent: {
    padding: SPACING.medium,
    gap: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  itemsList: {
    gap: SPACING.small,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.small,
  },
  itemContent: {
    flex: 1,
    gap: SPACING.extra_small,
  },
  itemName: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  itemUnitPrice: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
  itemTotal: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.terracota,
  },
  summaryCard: {
    backgroundColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    gap: SPACING.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  summaryValue: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.common.gris_medio,
  },
  totalLabel: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  totalValue: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  continueButton: {
    margin: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
  },
});

export default CartScreen;
```

- [ ] **Step 2: Create `app/(checkout)/cart.tsx`**

```tsx
import CartScreen from '../../src/components/cart/CartScreen';

export default function CartPage() {
  return <CartScreen />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/cart/CartScreen.tsx app/(checkout)/cart.tsx
git commit -m "feat: add CartScreen with item list, stepper, and summary"
```

---

## Task 8: ConfirmOrderScreen

**Files:**
- Create: `src/components/checkout/ConfirmOrderScreen.tsx`
- Create: `app/(checkout)/confirm.tsx`

Shows order summary, payment method selection (UI-only, three radio-style options), and a "Confirmar Pedido" button that calls `orderService.createOrder`. On success: `clearCart()` then navigate to `/(checkout)/success`. On error: shows an inline error message.

- [ ] **Step 1: Create `src/components/checkout/ConfirmOrderScreen.tsx`**

```tsx
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '../../providers/cart.provider';
import { orderService } from '../../services/order.service';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { formatPrice } from '../../utils/menu';

type PaymentMethod = 'efectivo' | 'tarjeta' | 'billetera';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'billetera', label: 'Billetera virtual' },
];

const ConfirmOrderScreen = () => {
  const { session, items, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!session || !session.tableCode) {
    router.replace('/');
    return null;
  }

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      await orderService.createOrder({
        table_code: session.tableCode!,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      });
      clearCart();
      router.replace('/(checkout)/success');
    } catch {
      setErrorMessage('No se pudo enviar el pedido. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name='arrowleft' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirmá tu pedido</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tableCard}>
          <View style={styles.tableIconContainer}>
            <MaterialIcons name='restaurant' size={ICON_SIZES.medium} color={COLORS.common.gris_oscuro} />
          </View>
          <View>
            <Text style={styles.tableName}>Mesa {session.tableCode}</Text>
            <Text style={styles.tableCode}>Código: {session.tableCode}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>RESUMEN</Text>
        <View style={styles.summaryCard}>
          {items.map((item) => (
            <View key={item.productId} style={styles.summaryRow}>
              <Text style={styles.summaryItemLabel}>
                {item.quantity}× {item.name}
              </Text>
              <Text style={styles.summaryItemValue}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>MÉTODO DE PAGO</Text>
        <View style={styles.paymentList}>
          {PAYMENT_OPTIONS.map((option) => {
            const isSelected = paymentMethod === option.value;
            return (
              <Pressable
                key={option.value}
                style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                onPress={() => setPaymentMethod(option.value)}
              >
                <Text style={[styles.paymentLabel, isSelected && styles.paymentLabelSelected]}>
                  {option.label}
                </Text>
                {isSelected ? (
                  <AntDesign name='checkcircle' size={ICON_SIZES.small} color={COLORS.primary.terracota} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.common.blanco} />
          ) : (
            <Text style={styles.confirmText}>Confirmar Pedido</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.common.blanco,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gris_claro,
  },
  backButton: {
    width: ICON_SIZES.extra_large,
    height: ICON_SIZES.extra_large,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_muy_claro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  headerSpacer: {
    width: ICON_SIZES.extra_large,
  },
  scrollContent: {
    padding: SPACING.medium,
    gap: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  tableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.medium,
    backgroundColor: COLORS.common.gris_muy_claro,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    padding: SPACING.medium,
  },
  tableIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_claro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableName: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  tableCode: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
    letterSpacing: 0.8,
  },
  summaryCard: {
    backgroundColor: COLORS.common.gris_muy_claro,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  summaryItemLabel: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  summaryItemValue: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.primary.terracota,
  },
  totalLabel: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  totalValue: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  paymentList: {
    gap: SPACING.small,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary.terracota,
    backgroundColor: '#FDF3EF',
  },
  paymentLabel: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '600',
    color: COLORS.common.negro_principal,
  },
  paymentLabelSelected: {
    color: COLORS.primary.terracota,
  },
  errorText: {
    color: COLORS.status.error,
    fontSize: FONT_SIZES.text_small,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.medium,
    backgroundColor: COLORS.common.blanco,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gris_claro,
  },
  confirmButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
  },
});

export default ConfirmOrderScreen;
```

- [ ] **Step 2: Create `app/(checkout)/confirm.tsx`**

```tsx
import ConfirmOrderScreen from '../../src/components/checkout/ConfirmOrderScreen';

export default function ConfirmPage() {
  return <ConfirmOrderScreen />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/checkout/ConfirmOrderScreen.tsx app/(checkout)/confirm.tsx
git commit -m "feat: add ConfirmOrderScreen with payment selection and order submission"
```

---

## Task 9: OrderSuccessScreen

**Files:**
- Create: `src/components/checkout/OrderSuccessScreen.tsx`
- Create: `app/(checkout)/success.tsx`

Shows a centered success state. The time shown is captured at render (immediately after the API call). Both action buttons replace the full navigation stack.

- [ ] **Step 1: Create `src/components/checkout/OrderSuccessScreen.tsx`**

```tsx
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCart } from '../../providers/cart.provider';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

const OrderSuccessScreen = () => {
  const { session } = useCart();

  const time = useMemo(() => {
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const tableLabel = session?.tableCode ? `Mesa ${session.tableCode}` : 'Tu mesa';

  return (
    <View style={styles.screen}>
      <View style={styles.iconContainer}>
        <AntDesign name='checkcircleo' size={ICON_SIZES.large} color={COLORS.secondary.verde_oliva} />
      </View>

      <Text style={styles.title}>¡Pedido enviado!</Text>
      <Text style={styles.subtitle}>El personal ya recibió tu orden.</Text>
      <Text style={styles.meta}>
        {tableLabel} · {time}
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.primaryButtonText}>Volver al inicio</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/my-orders')}>
          <Text style={styles.secondaryButtonText}>Ver mis pedidos</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.gris_muy_claro,
    paddingHorizontal: SPACING.large,
    gap: SPACING.small,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_claro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  meta: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  actions: {
    width: '100%',
    gap: SPACING.medium,
    marginTop: SPACING.medium,
  },
  primaryButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    backgroundColor: COLORS.common.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '600',
  },
});

export default OrderSuccessScreen;
```

- [ ] **Step 2: Create `app/(checkout)/success.tsx`**

```tsx
import OrderSuccessScreen from '../../src/components/checkout/OrderSuccessScreen';

export default function SuccessPage() {
  return <OrderSuccessScreen />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/checkout/OrderSuccessScreen.tsx app/(checkout)/success.tsx
git commit -m "feat: add OrderSuccessScreen"
```

---

## Final verification

- [ ] Run the dev server: `npx expo start -c`
- [ ] Open on iOS/Android simulator
- [ ] Scan QR or navigate to a restaurant with a table param
- [ ] Verify the `+` button appears on each product card (quantity 0 shows only `+`, no `-`)
- [ ] Tap `+` on a product → stepper `- 1 +` appears horizontally, "Ver pedido" bar appears at the bottom
- [ ] Tap the cart icon in Header2 or the "Ver pedido" bar → CartScreen opens
- [ ] Adjust quantities in CartScreen, verify total updates
- [ ] Tap "Continuar" → ConfirmOrderScreen opens
- [ ] Select a payment method (borde terracota + check)
- [ ] Tap "Confirmar Pedido" → loading spinner → navigates to OrderSuccessScreen
- [ ] Tap "Volver al inicio" → lands on home screen with empty cart badge
