# Dashboard de staff (Pedidos y Mesas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the placeholder `MyRestaurantDetailScreen` (`/my-restaurants/[id]`) into a real staff dashboard with **Pedidos** and **Mesas** tabs, gated by `RestaurantStaff.role` permissions.

**Architecture:** `MyRestaurantDetailScreen` keeps its existing fetch (restaurant + staff info) and becomes the dashboard host: it owns `activeTab` and cross-tab `tableFilter` state, renders `StaffTabs`, and mounts either `RestaurantOrdersScreen` or `RestaurantTablesScreen` (both new, in `src/components/restaurants/Staff/`). Permissions are centralized in `src/utils/staffPermissions.ts`. Order-status labels/colors/filters are reused from the existing `src/types/restaurant-order-status.ts` (no duplication). Both screens use pull-to-refresh + `useFocusEffect` reloads, no polling.

**Tech Stack:** React Native, Expo Router, `@react-navigation/native` (`useFocusEffect`), existing `orderService` / `tableService` / `restaurantStaffService`. No automated test framework exists in this project — verification is manual on the simulator (per explicit user decision: "Sin tests automatizados; verificación manual").

---

## File Structure

- `src/utils/staffPermissions.ts` — **create**: `canManageTables`, `canUpdateOrderStatus`, `canManageStaff` helpers driven by `RestaurantStaffEnum`
- `src/components/restaurants/Staff/StaffTabs.tsx` — **create**: 2-tab bar (Pedidos / Mesas), visual pattern of `MenuCategoryTabs`
- `src/components/restaurants/Staff/OrderStatusFilterTabs.tsx` — **create**: horizontal status filter tabs, reusing `ORDER_STATUS_FILTER_OPTIONS`/`ALL_ORDER_STATUS_FILTER`
- `src/components/restaurants/Staff/StaffOrderCard.tsx` — **create**: order card for staff (table + number, status badge, items, note, elapsed time, total, status-driven actions)
- `src/components/restaurants/Staff/RestaurantOrdersScreen.tsx` — **create**: fetch + filter + list of orders, status updates, pull-to-refresh
- `src/components/restaurants/Staff/TableCard.tsx` — **create**: table grid card (code, area, status, capacity)
- `src/components/restaurants/Staff/CreateTableModal.tsx` — **create**: modal form to create a table
- `src/components/restaurants/Staff/TableDetailPanel.tsx` — **create**: detail panel for the selected table (free/occupied actions)
- `src/components/restaurants/Staff/RestaurantTablesScreen.tsx` — **create**: grid + detail panel + create modal, pull-to-refresh
- `src/components/restaurants/Detail/MyRestaurantDetailScreen.tsx` — **modify**: convert placeholder into the tabbed dashboard host

---

### Task 1: Permissions helper

**Files:**
- Create: `src/utils/staffPermissions.ts`

- [ ] **Step 1: Write the helper**

```ts
import { RestaurantStaffEnum } from '../types/types';

export const canManageTables = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER ||
  role === RestaurantStaffEnum.ADMIN ||
  role === RestaurantStaffEnum.CASHIER_PLUS;

// every staff role can update order status — only table/staff management is restricted
export const canUpdateOrderStatus = (_role: RestaurantStaffEnum) => true;

export const canManageStaff = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER || role === RestaurantStaffEnum.ADMIN;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: same baseline as before (2 pre-existing errors in `MyOrderDetailScreen.tsx` about `Order.user_id`); no new errors mentioning `staffPermissions.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/utils/staffPermissions.ts
git commit -m "feat: add staff permission helpers for restaurant dashboard"
```

---

### Task 2: StaffTabs (Pedidos / Mesas tab bar)

**Files:**
- Create: `src/components/restaurants/Staff/StaffTabs.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';

export type StaffTabKey = 'orders' | 'tables';

const STAFF_TABS: { key: StaffTabKey; label: string }[] = [
  { key: 'orders', label: 'Pedidos' },
  { key: 'tables', label: 'Mesas' },
];

const StaffTabs = ({ activeTab, onSelect }: { activeTab: StaffTabKey; onSelect: (tab: StaffTabKey) => void }) => {
  return (
    <View style={styles.container}>
      {STAFF_TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onSelect(tab.key)}
          >
            <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  tabActive: {
    backgroundColor: COLORS.primary.terracota,
  },
  tabInactive: {
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
  },
  tabText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  tabTextActive: {
    color: COLORS.common.blanco,
  },
  tabTextInactive: {
    color: COLORS.primary.terracota,
  },
});

export default StaffTabs;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `StaffTabs.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/StaffTabs.tsx
git commit -m "feat: add StaffTabs bar for Pedidos/Mesas dashboard navigation"
```

---

### Task 3: OrderStatusFilterTabs (reuses existing status-filter constants)

**Files:**
- Create: `src/components/restaurants/Staff/OrderStatusFilterTabs.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ORDER_STATUS_FILTER_OPTIONS, OrderStatusFilter } from '../../../types/restaurant-order-status';

const OrderStatusFilterTabs = ({
  selected,
  onSelect,
}: {
  selected: OrderStatusFilter;
  onSelect: (filter: OrderStatusFilter) => void;
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {ORDER_STATUS_FILTER_OPTIONS.map((option) => {
        const isActive = selected === option.key;

        return (
          <Pressable
            key={option.key}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onSelect(option.key)}
          >
            <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.extra_small,
  },
  tab: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  tabActive: {
    backgroundColor: COLORS.primary.terracota,
  },
  tabInactive: {
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
  },
  tabText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.common.blanco,
  },
  tabTextInactive: {
    color: COLORS.primary.terracota,
  },
});

export default OrderStatusFilterTabs;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `OrderStatusFilterTabs.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/OrderStatusFilterTabs.tsx
git commit -m "feat: add order status filter tabs reusing restaurant-order-status constants"
```

---

### Task 4: StaffOrderCard

**Files:**
- Create: `src/components/restaurants/Staff/StaffOrderCard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { formatPrice } from '../../../utils/menu';
import { getRestaurantOrderStatusStyle, RESTAURANT_ORDER_STATUS_LABELS } from '../../../types/restaurant-order-status';
import { Order, RestaurantOrderStatusEnum, RestaurantTable } from '../../../types/types';

const formatElapsed = (createdAt: string) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));

  if (minutes < 1) return 'Recién pedido';
  if (minutes < 60) return `Hace ${minutes} min`;

  return `Hace ${Math.floor(minutes / 60)} h`;
};

const StaffOrderCard = ({
  order,
  table,
  onUpdateStatus,
}: {
  order: Order;
  table: RestaurantTable | undefined;
  onUpdateStatus: (order: Order, status: RestaurantOrderStatusEnum) => void;
}) => {
  const tableLabel = table ? `Mesa ${table.code}` : 'Mesa eliminada';

  const handleCancel = () => {
    Alert.alert('Cancelar pedido', `¿Cancelar el pedido #${order.number}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => onUpdateStatus(order, RestaurantOrderStatusEnum.CANCELLED) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>
          {tableLabel} · #{order.number}
        </Text>
        <Text style={[styles.status, getRestaurantOrderStatusStyle(order.status)]}>
          {RESTAURANT_ORDER_STATUS_LABELS[order.status]}
        </Text>
      </View>

      <View style={styles.itemsList}>
        {order.items?.map((item) => (
          <Text key={item.id} style={styles.itemText}>
            {item.quantity}× {item.product_name}
          </Text>
        ))}
        {order.note ? <Text style={styles.orderNote}>Nota: {order.note}</Text> : null}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.elapsed}>{formatElapsed(order.created_at)}</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>

      {order.status === RestaurantOrderStatusEnum.PENDING ? (
        <View style={styles.actionsRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => onUpdateStatus(order, RestaurantOrderStatusEnum.IN_PROCESS)}
          >
            <Text style={styles.primaryButtonText}>Enviar a cocina</Text>
          </Pressable>
        </View>
      ) : null}

      {order.status === RestaurantOrderStatusEnum.IN_PROCESS ? (
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => onUpdateStatus(order, RestaurantOrderStatusEnum.DELIVERED)}
          >
            <Text style={styles.primaryButtonText}>Marcar entregado</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    gap: SPACING.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  status: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  itemsList: {
    gap: SPACING.extra_small,
  },
  itemText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  orderNote: {
    fontSize: FONT_SIZES.text_small,
    fontStyle: 'italic',
    color: COLORS.common.gris_medio,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elapsed: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  total: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.status.error,
    backgroundColor: COLORS.common.blanco,
  },
  cancelButtonText: {
    color: COLORS.status.error,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  primaryButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
});

export default StaffOrderCard;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `StaffOrderCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/StaffOrderCard.tsx
git commit -m "feat: add StaffOrderCard with status-driven actions for staff dashboard"
```

---

### Task 5: RestaurantOrdersScreen

**Files:**
- Create: `src/components/restaurants/Staff/RestaurantOrdersScreen.tsx`

- [ ] **Step 1: Write the screen**

```tsx
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { orderService } from '../../../services/order.service';
import { ALL_ORDER_STATUS_FILTER, OrderStatusFilter } from '../../../types/restaurant-order-status';
import { Order, RestaurantOrderStatusEnum, RestaurantTable } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import OrderStatusFilterTabs from './OrderStatusFilterTabs';
import StaffOrderCard from './StaffOrderCard';

const RestaurantOrdersScreen = ({
  restaurantId,
  tables,
  tableFilter,
  onClearTableFilter,
}: {
  restaurantId: string;
  tables: RestaurantTable[];
  tableFilter: number | null;
  onClearTableFilter: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>(ALL_ORDER_STATUS_FILTER);

  const tablesById = new Map(tables.map((table) => [table.id, table]));

  const loadOrders = useCallback(async () => {
    try {
      setError(false);
      const data = await orderService.getRestaurantOrders(restaurantId);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching restaurant orders:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [restaurantId]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleUpdateStatus = async (order: Order, status: RestaurantOrderStatusEnum) => {
    try {
      const updated = await orderService.updateOrderStatus(restaurantId, String(order.id), status);
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      console.error('Error updating order status:', err);
      Alert.alert('Error', 'No se pudo actualizar el estado del pedido. Intentá de nuevo.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (tableFilter !== null && order.table_id !== tableFilter) return false;
    if (statusFilter !== ALL_ORDER_STATUS_FILTER && order.status !== statusFilter) return false;
    return true;
  });

  const filteredTable = tableFilter !== null ? tablesById.get(tableFilter) : undefined;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={COLORS.primary.terracota} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudieron cargar los pedidos.</Text>
        <Pressable style={styles.retryButton} onPress={loadOrders}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tableFilter !== null ? (
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>Mesa {filteredTable?.code ?? tableFilter}</Text>
          <Pressable onPress={onClearTableFilter}>
            <Text style={styles.filterChipClear}>Quitar filtro ✕</Text>
          </Pressable>
        </View>
      ) : null}

      <OrderStatusFilterTabs selected={statusFilter} onSelect={setStatusFilter} />

      <FlatList
        data={filteredOrders}
        keyExtractor={(order) => String(order.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary.terracota]} />}
        renderItem={({ item }) => (
          <StaffOrderCard order={item} table={tablesById.get(item.table_id)} onUpdateStatus={handleUpdateStatus} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.small }} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay pedidos en esta categoría</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  errorText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  retryButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.medium,
    marginTop: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: `${COLORS.primary.arena_calida}66`,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
  },
  filterChipText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  filterChipClear: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  listContent: {
    padding: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  emptyText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginTop: SPACING.extra_large,
  },
});

export default RestaurantOrdersScreen;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `RestaurantOrdersScreen.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/RestaurantOrdersScreen.tsx
git commit -m "feat: add RestaurantOrdersScreen with status filters and pull-to-refresh"
```

---

### Task 6: TableCard

**Files:**
- Create: `src/components/restaurants/Staff/TableCard.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `TableCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/TableCard.tsx
git commit -m "feat: add TableCard grid item for staff Mesas screen"
```

---

### Task 7: CreateTableModal

**Files:**
- Create: `src/components/restaurants/Staff/CreateTableModal.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { CreateTablePayload } from '../../../types/types';

const CreateTableModal = ({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTablePayload) => Promise<void>;
}) => {
  const [code, setCode] = useState('');
  const [area, setArea] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCode('');
    setArea('');
    setCapacity('');
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedCode = code.trim();
    const parsedCapacity = parseInt(capacity, 10);

    if (!trimmedCode) {
      Alert.alert('Falta el código', 'Ingresá el código de la mesa.');
      return;
    }

    if (!Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
      Alert.alert('Capacidad inválida', 'Ingresá un número de personas mayor a cero.');
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        code: trimmedCode,
        area: area.trim() || undefined,
        capacity: parsedCapacity,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating table:', error);
      Alert.alert('Error', 'No se pudo crear la mesa. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Nueva mesa</Text>

          <TextInput
            style={styles.input}
            placeholder='Código (ej: 1A)'
            placeholderTextColor={COLORS.common.gris_medio}
            value={code}
            onChangeText={setCode}
            autoCapitalize='characters'
          />
          <TextInput
            style={styles.input}
            placeholder='Área (opcional)'
            placeholderTextColor={COLORS.common.gris_medio}
            value={area}
            onChangeText={setArea}
          />
          <TextInput
            style={styles.input}
            placeholder='Capacidad (personas)'
            placeholderTextColor={COLORS.common.gris_medio}
            value={capacity}
            onChangeText={setCapacity}
            keyboardType='number-pad'
          />

          <View style={styles.actionsRow}>
            <Pressable style={styles.cancelButton} onPress={handleClose} disabled={submitting}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.createButton} onPress={handleSubmit} disabled={submitting}>
              {submitting ? <ActivityIndicator color={COLORS.common.blanco} /> : <Text style={styles.createButtonText}>Crear mesa</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  sheet: {
    width: '100%',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  cancelButtonText: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
  },
  createButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  createButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
  },
});

export default CreateTableModal;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `CreateTableModal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/CreateTableModal.tsx
git commit -m "feat: add CreateTableModal for staff Mesas screen"
```

---

### Task 8: TableDetailPanel

**Files:**
- Create: `src/components/restaurants/Staff/TableDetailPanel.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { RestaurantTable, RestaurantTableStatusEnum } from '../../../types/types';

const TableDetailPanel = ({
  table,
  canManage,
  onViewOrders,
  onCloseTable,
  onDeleteTable,
}: {
  table: RestaurantTable;
  canManage: boolean;
  onViewOrders: (tableId: number) => void;
  onCloseTable: (table: RestaurantTable) => void;
  onDeleteTable: (table: RestaurantTable) => void;
}) => {
  const isFree = table.status === RestaurantTableStatusEnum.FREE;

  const handleDelete = () => {
    Alert.alert('Eliminar mesa', `¿Eliminar la mesa ${table.code}? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onDeleteTable(table) },
    ]);
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Mesa {table.code}</Text>
      {table.area ? <Text style={styles.detail}>Área: {table.area}</Text> : null}
      <Text style={styles.detail}>Capacidad: {table.capacity} personas</Text>
      <Text style={styles.detail}>Estado: {isFree ? 'Libre' : 'Activa'}</Text>

      {isFree ? (
        <>
          <Text style={styles.hint}>Mesa disponible</Text>
          {canManage ? (
            <Pressable style={styles.dangerButton} onPress={handleDelete}>
              <Text style={styles.dangerButtonText}>Eliminar mesa</Text>
            </Pressable>
          ) : null}
        </>
      ) : (
        <>
          <Pressable style={styles.primaryButton} onPress={() => onViewOrders(table.id)}>
            <Text style={styles.primaryButtonText}>Ver pedido</Text>
          </Pressable>
          {canManage ? (
            <Pressable style={styles.outlineButton} onPress={() => onCloseTable(table)}>
              <Text style={styles.outlineButtonText}>Cerrar mesa y liberar</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    marginTop: SPACING.medium,
    gap: SPACING.small,
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    padding: SPACING.large,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  detail: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  hint: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    marginBottom: SPACING.small,
  },
  primaryButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  primaryButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
  },
  outlineButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
  },
  outlineButtonText: {
    color: COLORS.primary.caramelo,
    fontWeight: '700',
  },
  dangerButton: {
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.status.error,
  },
  dangerButtonText: {
    color: COLORS.status.error,
    fontWeight: '700',
  },
});

export default TableDetailPanel;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `TableDetailPanel.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/TableDetailPanel.tsx
git commit -m "feat: add TableDetailPanel with role-gated free/occupied actions"
```

---

### Task 9: RestaurantTablesScreen

**Files:**
- Create: `src/components/restaurants/Staff/RestaurantTablesScreen.tsx`

- [ ] **Step 1: Write the screen**

```tsx
import { useCallback, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { canManageTables } from '../../../utils/staffPermissions';
import { tableService } from '../../../services/table.service';
import { CreateTablePayload, RestaurantStaffEnum, RestaurantTable, RestaurantTableStatusEnum } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import TableCard from './TableCard';
import TableDetailPanel from './TableDetailPanel';
import CreateTableModal from './CreateTableModal';

const RestaurantTablesScreen = ({
  restaurantId,
  staffRole,
  tables,
  onTablesChange,
  onRefresh,
  onViewOrdersForTable,
}: {
  restaurantId: string;
  staffRole: RestaurantStaffEnum;
  tables: RestaurantTable[];
  onTablesChange: (tables: RestaurantTable[]) => void;
  onRefresh: () => Promise<void>;
  onViewOrdersForTable: (tableId: number) => void;
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const canManage = canManageTables(staffRole);
  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? null;

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleSelect = (tableId: number) => {
    setSelectedTableId((current) => (current === tableId ? null : tableId));
  };

  const handleCreate = async (payload: CreateTablePayload) => {
    const created = await tableService.createTable(restaurantId, payload);
    onTablesChange([...tables, created]);
  };

  const handleCloseTable = async (table: RestaurantTable) => {
    try {
      const updated = await tableService.updateTableStatus(restaurantId, String(table.id), RestaurantTableStatusEnum.FREE);
      onTablesChange(tables.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error('Error closing table:', error);
      Alert.alert('Error', 'No se pudo cerrar la mesa. Intentá de nuevo.');
    }
  };

  const handleDeleteTable = async (table: RestaurantTable) => {
    try {
      await tableService.deleteTable(restaurantId, String(table.id));
      onTablesChange(tables.filter((item) => item.id !== table.id));
      setSelectedTableId(null);
    } catch (error) {
      console.error('Error deleting table:', error);
      Alert.alert('Error', 'No se pudo eliminar la mesa. Intentá de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary.terracota]} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {tables.map((table) => (
            <TableCard key={table.id} table={table} isSelected={table.id === selectedTableId} onPress={() => handleSelect(table.id)} />
          ))}
          {canManage ? (
            <Pressable style={styles.addCard} onPress={() => setModalVisible(true)}>
              <Text style={styles.addCardText}>+ Nueva</Text>
            </Pressable>
          ) : null}
        </View>

        {tables.length === 0 ? <Text style={styles.emptyText}>Todavía no hay mesas cargadas</Text> : null}

        {selectedTable ? (
          <TableDetailPanel
            table={selectedTable}
            canManage={canManage}
            onViewOrders={onViewOrdersForTable}
            onCloseTable={handleCloseTable}
            onDeleteTable={handleDeleteTable}
          />
        ) : null}
      </ScrollView>

      <CreateTableModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={handleCreate} />
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.medium,
  },
  addCard: {
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  emptyText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginTop: SPACING.extra_large,
  },
});

export default RestaurantTablesScreen;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors mentioning `RestaurantTablesScreen.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/restaurants/Staff/RestaurantTablesScreen.tsx
git commit -m "feat: add RestaurantTablesScreen with grid, detail panel and create modal"
```

---

### Task 10: Wire up MyRestaurantDetailScreen as the dashboard host

**Files:**
- Modify: `src/components/restaurants/Detail/MyRestaurantDetailScreen.tsx` (full rewrite of the component body, keeping the existing fetch logic and loading/error/no-staff states)

- [ ] **Step 1: Replace the file contents**

```tsx
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Restaurant, RestaurantStaff } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { restaurantStaffService } from '../../../services/restaurant_staff.service';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import StaffTabs, { StaffTabKey } from '../Staff/StaffTabs';
import RestaurantOrdersScreen from '../Staff/RestaurantOrdersScreen';
import RestaurantTablesScreen from '../Staff/RestaurantTablesScreen';

const MyRestaurantDetailScreen = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [myRestaurant, setMyRestaurant] = useState<Restaurant | null>(null);
  const [myRestaurantStaffInfo, setMyRestaurantStaffInfo] = useState<RestaurantStaff | null>(null);
  const [activeTab, setActiveTab] = useState<StaffTabKey>('orders');
  const [tableFilter, setTableFilter] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const restaurant = await restaurantService.getRestaurantById(id);
      setMyRestaurant(restaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setMyRestaurant(null);
      setLoading(false);
      return;
    }

    try {
      const staffInfo = await restaurantStaffService.getMyRestaurantStaffInfo(id);
      setMyRestaurantStaffInfo(staffInfo);
    } catch (error) {
      console.error('Error fetching restaurant staff info:', error);
      setMyRestaurantStaffInfo(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const refreshRestaurant = useCallback(async () => {
    try {
      const restaurant = await restaurantService.getRestaurantById(id);
      setMyRestaurant(restaurant);
    } catch (error) {
      console.error('Error refreshing restaurant:', error);
    }
  }, [id]);

  const handleTablesChange = (tables: Restaurant['tables']) => {
    setMyRestaurant((current) => (current ? { ...current, tables } : current));
  };

  const handleViewOrdersForTable = (tableId: number) => {
    setTableFilter(tableId);
    setActiveTab('orders');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={COLORS.primary.terracota} />
      </View>
    );
  }

  if (!myRestaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>El restaurante no existe</Text>
      </View>
    );
  }

  if (!myRestaurantStaffInfo) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No formás parte de este restaurante</Text>
      </View>
    );
  }

  const tables = myRestaurant.tables ?? [];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{myRestaurant.name}</Text>
      </View>

      <StaffTabs activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === 'orders' ? (
        <RestaurantOrdersScreen
          restaurantId={id}
          tables={tables}
          tableFilter={tableFilter}
          onClearTableFilter={() => setTableFilter(null)}
        />
      ) : (
        <RestaurantTablesScreen
          restaurantId={id}
          staffRole={myRestaurantStaffInfo.role}
          tables={tables}
          onTablesChange={handleTablesChange}
          onRefresh={refreshRestaurant}
          onViewOrdersForTable={handleViewOrdersForTable}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  message: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: SPACING.medium,
    paddingTop: SPACING.medium,
  },
  restaurantName: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
});

export default MyRestaurantDetailScreen;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: same baseline as Task 1 (only the 2 pre-existing `MyOrderDetailScreen.tsx` errors); no errors mentioning `MyRestaurantDetailScreen.tsx` or any `Staff/*` file.

- [ ] **Step 3: Manual verification — full flow on the simulator**

Run the app (`npx expo start`) and sign in as staff of a restaurant that already has tables and at least one pending order (create one from the customer flow if needed: scan/enter a table code → add items → confirm order). Then, navigating to `/my-restaurants/[id]`:

1. **Tabs render**: "Pedidos" is selected by default; tapping "Mesas" switches the content below the tab bar.
2. **Pedidos — filters and actions** (test with an OWNER/ADMIN account):
   - The horizontal status tabs show "Todos" + the four statuses with the same Spanish labels used in the customer `OrderCard`.
   - A `PENDING` order shows "Enviar a cocina" and "Cancelar"; tapping "Enviar a cocina" moves it to `IN_PROCESS` (badge label/color updates in place, no full-list reload).
   - An `IN_PROCESS` order shows only "Marcar entregado"; tapping it moves the order to `DELIVERED` and the action disappears.
   - Tapping "Cancelar" on a `PENDING` order shows a confirmation `Alert`; confirming sets it to `CANCELLED`.
   - Pull-to-refresh reloads the list; switching away to "Mesas" and back to "Pedidos" reloads via `useFocusEffect`.
3. **Mesas — grid and detail panel** (OWNER/ADMIN/CASHIER_PLUS):
   - Tapping a `FREE` table opens the panel with "Mesa disponible" and an "Eliminar mesa" button (with confirmation `Alert`); tapping the same table again closes the panel.
   - Tapping an `OCCUPIED` table shows "Ver pedido" and "Cerrar mesa y liberar" (no confirmation); "Eliminar mesa" is **not** shown for occupied tables.
   - Tapping "Ver pedido" switches to the "Pedidos" tab, shows a "Mesa {code}" filter chip, and the list only shows that table's orders; tapping "Quitar filtro ✕" clears it.
   - Tapping "Cerrar mesa y liberar" sets the table to `FREE` immediately (status badge/detail update without a full reload); the table can now be deleted once selected again.
   - "+ Nueva" opens the create modal; submitting with empty code or invalid capacity shows a validation `Alert`; a valid submission creates the table, closes the modal, and the new card appears in the grid.
4. **CASHIER restrictions** (sign in with a CASHIER staff account):
   - Pedidos tab: status-change actions are still available (per spec, all staff roles can update order status).
   - Mesas tab: the "+ Nueva" card is hidden, the detail panel never shows "Eliminar mesa" or "Cerrar mesa y liberar", and "Ver pedido" is still available on occupied tables.

- [ ] **Step 4: Commit**

```bash
git add src/components/restaurants/Detail/MyRestaurantDetailScreen.tsx
git commit -m "feat: turn MyRestaurantDetailScreen into staff dashboard with Pedidos/Mesas tabs"
```

---

## Self-Review Notes

- **Spec coverage**: permissions table → Task 1; navigation/tabs architecture → Tasks 2 & 10; Pedidos screen (data, filters reusing existing constants, card layout, status→action table, refresh, loading/error/empty states) → Tasks 3, 4, 5; Mesas screen (grid, detail panel for FREE/OCCUPIED incl. delete-only-when-FREE, create modal, CASHIER restrictions, refresh) → Tasks 6, 7, 8, 9; cross-tab "Ver pedido" → table filter wiring → Task 10. Out-of-scope items (Personal/Menu, QR, payment methods, "Por cerrar", polling) are not touched anywhere in this plan.
- **No automated tests**: per explicit user decision, every verification step is a manual simulator walkthrough — there are no test-writing or test-running steps.
- **Type consistency check performed**: `StaffTabKey` is exported from `StaffTabs.tsx` and consumed identically in `MyRestaurantDetailScreen.tsx`; `OrderStatusFilter`/`ALL_ORDER_STATUS_FILTER`/`ORDER_STATUS_FILTER_OPTIONS`/`RESTAURANT_ORDER_STATUS_LABELS`/`getRestaurantOrderStatusStyle` are imported from `restaurant-order-status.ts` with the same names everywhere; `canManageTables`/`canUpdateOrderStatus`/`canManageStaff` signatures match between `staffPermissions.ts` (Task 1) and their only call site (`canManageTables` in `RestaurantTablesScreen.tsx`, Task 9); `tableService.createTable/deleteTable/updateTableStatus` and `orderService.getRestaurantOrders/updateOrderStatus` are called with the exact `(restaurantId: string, ...)` / `(restaurantId, id, ...)` signatures from the existing services (ids coerced to `String(...)` since the services type them as strings but `Order`/`RestaurantTable` ids are numbers).
