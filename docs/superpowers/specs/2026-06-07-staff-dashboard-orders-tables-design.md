# Diseño: Dashboard de staff — Pedidos y Mesas

Fecha: 2026-06-07

## Contexto

Hoy `MyRestaurantDetailScreen` (ruta `/my-restaurants/[id]`) es un placeholder que solo
muestra el nombre del restaurante y el rol del usuario. El staff de un restaurante
(`RestaurantStaff.role: RestaurantStaffEnum`) necesita un dashboard real para operar el
día a día: gestionar pedidos entrantes y el estado de las mesas, con permisos distintos
según su rol.

Este documento cubre **Pedidos** y **Mesas**. Personal y Menú quedan fuera de alcance
(se diseñarán en una sesión futura), pero la estructura de tabs queda preparada para
sumarlos sin reestructurar.

Las capturas de referencia que se compartieron muestran un diseño aspiracional que no
coincide 1:1 con el modelo de datos real del backend (estados de pedido más granulares,
método de pago, nombre+código de mesa separados, múltiples etiquetas, estados "Por
cerrar", QR). Este diseño se construye sobre el **modelo real** (`types.ts` /
`order.service.ts` / `table.service.ts`), no sobre las capturas.

## Permisos por rol de staff

`RestaurantStaffEnum`: `OWNER`, `ADMIN`, `CASHIER_PLUS`, `CASHIER`.

| Acción                                  | OWNER | ADMIN | CASHIER_PLUS | CASHIER |
|-----------------------------------------|:-----:|:-----:|:------------:|:-------:|
| Ver Pedidos                             |  ✅   |  ✅   |     ✅       |   ✅    |
| Cambiar estado de un pedido             |  ✅   |  ✅   |     ✅       |   ✅    |
| Ver Mesas                               |  ✅   |  ✅   |     ✅       |   ✅    |
| Crear / cerrar / eliminar mesas         |  ✅   |  ✅   |     ✅       |   ❌    |
| Ver / gestionar Personal (futuro)       |  ✅   |  ✅   |     ❌       |   ❌    |

Se centraliza esta lógica en `src/utils/staffPermissions.ts`:

```ts
canManageTables(role: RestaurantStaffEnum): boolean   // OWNER, ADMIN, CASHIER_PLUS
canUpdateOrderStatus(role: RestaurantStaffEnum): boolean // todos los roles de staff
canManageStaff(role: RestaurantStaffEnum): boolean    // OWNER, ADMIN (uso futuro)
```

CASHIER es el único rol limitado: solo puede ver Pedidos/Mesas y cambiar el estado de
los pedidos. No tiene acceso a acciones de gestión de mesas ni de personal.

## Arquitectura y navegación

`MyRestaurantDetailScreen` deja de ser un placeholder y pasa a ser el dashboard:

```
MyRestaurantDetailScreen (/my-restaurants/[id])
 ├─ fetch: restaurante (incluye tables) + myRestaurantStaffInfo (ya existe)
 ├─ si !myRestaurantStaffInfo → "No formás parte de este restaurante" (ya existe)
 ├─ Header: nombre del restaurante
 ├─ StaffTabs: [Pedidos] [Mesas]   (estilo MenuCategoryTabs; Personal/Menu se agregan después)
 └─ Contenido según tab activo:
     ├─ "orders" → RestaurantOrdersScreen (restaurantId, staffRole, tables)
     └─ "tables" → RestaurantTablesScreen (restaurantId, staffRole, tables, onViewOrdersForTable)
```

`RestaurantOrdersScreen` y `RestaurantTablesScreen` viven en
`src/components/restaurants/Staff/`.

## Pantalla de Pedidos (`RestaurantOrdersScreen`)

**Datos**: `orderService.getRestaurantOrders(restaurantId)`. Las mesas se reciben como
prop (del fetch del restaurante en `MyRestaurantDetailScreen`) y se arma un mapa
`table_id → RestaurantTable` para mostrar `code`/`area`.

**Filtros**: se reutiliza `ORDER_STATUS_FILTER_OPTIONS` y `ALL_ORDER_STATUS_FILTER` de
`src/types/restaurant-order-status.ts` (ya generan "Todos" + un tab por cada
`RestaurantOrderStatusEnum`, con sus labels en español), mostrados como tabs
horizontales con el patrón visual de `MenuCategoryTabs`.

**Tarjeta de pedido**:
- Encabezado: `Mesa {table.code} · #{order.number}` + badge de estado, reutilizando
  `RESTAURANT_ORDER_STATUS_LABELS` y `getRestaurantOrderStatusStyle` (las mismas
  constantes que usa `OrderCard` para el cliente — mismo pedido, misma etiqueta)
- Lista de items: `{quantity}× {product_name}`, con `note` debajo si existe
- Footer: tiempo transcurrido desde `created_at`, total (`formatPrice`)
- Acción(es) según estado — visibles para **todos** los roles de staff:

| Estado (label de `RESTAURANT_ORDER_STATUS_LABELS`) | Acciones                                              |
|----------------------------------------------------|-------------------------------------------------------|
| `PENDING` ("Pendiente")                            | [Enviar a cocina] → `IN_PROCESS` · [Cancelar] → `CANCELLED` (con confirmación) |
| `IN_PROCESS` ("En proceso")                        | [Marcar entregado] → `DELIVERED`                      |
| `DELIVERED` ("Entregado")                          | (sin acciones, estado final)                           |
| `CANCELLED` ("Cancelado")                          | (informativo)                                          |

"Cancelar" solo está disponible en `PENDING` y muestra un `Alert` de confirmación antes
de llamar a `updateOrderStatus(restaurantId, orderId, CANCELLED)`.

**Refresh**: `RefreshControl` (pull-to-refresh) + recarga al enfocar la tab vía
`useFocusEffect`. Tras una acción de cambio de estado, se actualiza la card en el estado
local con la respuesta de `updateOrderStatus` (sin recargar toda la lista).

**Estados de carga/error/vacío**: spinner mientras carga; mensaje + botón "Reintentar"
si falla la carga; mensaje "No hay pedidos en esta categoría" si la lista filtrada está
vacía.

## Pantalla de Mesas (`RestaurantTablesScreen`)

**Datos**: lista de `RestaurantTable` recibida como prop desde `MyRestaurantDetailScreen`
(`restaurant.tables`).

**Grilla de mesas** (cards en columnas, similar visualmente a la captura pero sobre el
modelo real):
- Título: `code`
- Tag de `area` si existe (`area: string | null`)
- Indicador de estado: `FREE` → "Libre" (color neutro/gris), `OCCUPIED` → "Activa"
  (color `secondary.verde_oliva`)
- "Capacidad: {capacity} personas"
- Tap → selecciona la mesa y abre/cierra el panel de detalle debajo de la grilla
  (selección única; tocar la misma mesa lo cierra)

**Panel de detalle** (debajo de la grilla, reemplaza su contenido al seleccionar):
- Info: `code`, `area`, `capacity`, estado actual
- Si `FREE`:
  - Texto "Mesa disponible"
  - Si `canManageTables(role)`: botón **Eliminar mesa** (con `Alert` de confirmación) →
    `tableService.deleteTable`
- Si `OCCUPIED`:
  - **Ver pedido** (todos los roles) → cambia a la tab Pedidos con el filtro de mesa
    aplicado (se pasa el `table_id` seleccionado como filtro adicional sobre la lista de
    pedidos)
  - Si `canManageTables(role)`: botón **Cerrar mesa y liberar** →
    `tableService.updateTableStatus(restaurantId, tableId, FREE)` directo, sin
    confirmación adicional
  - **Eliminar mesa NO está disponible** mientras la mesa está `OCCUPIED` (para evitar
    borrar una mesa con actividad en curso); solo se puede eliminar una vez liberada

**Crear mesa** (card "+ Nueva" al final de la grilla, solo visible si
`canManageTables(role)`): abre un modal/bottom-sheet con:
- `code` (texto, requerido)
- `area` (texto libre, opcional)
- `capacity` (numérico, requerido)
- Botón "Crear mesa" → `tableService.createTable`; al éxito, se agrega la mesa a la
  lista local y se cierra el modal

CASHIER ve la grilla y el panel de detalle (incluyendo "Ver pedido"), pero no ve el
botón "+ Nueva" ni las acciones de cerrar/eliminar.

**Refresh**: igual patrón que Pedidos — `RefreshControl` + `useFocusEffect`.

## Fuera de alcance (explícitamente)

- Pestañas de **Personal** y **Menú** (sesión futura, con más capturas)
- Generación/visualización de **códigos QR** de mesa (requeriría agregar una librería
  nueva)
- Métodos de pago en pedidos (no existen en el modelo de `Order`)
- Estados de mesa adicionales tipo "Por cerrar" o nombres de mesa separados de `code`
  (no existen en `RestaurantTable`)
- Polling automático periódico (solo pull-to-refresh + recarga al enfocar)

## Testing

- Helpers de permisos (`staffPermissions.ts`): tests unitarios por combinación de rol/acción
- Mapeo de estado de pedido → etiqueta/acciones: tests unitarios de la función pura de mapeo
- Verificación manual en el simulador: flujo completo de cambio de estado de pedido,
  creación/cierre/eliminación de mesa, y visibilidad de acciones según rol (probar con
  al menos un usuario CASHIER y uno OWNER/ADMIN)
