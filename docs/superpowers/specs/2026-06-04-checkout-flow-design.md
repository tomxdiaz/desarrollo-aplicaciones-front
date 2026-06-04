# Checkout Flow Design

**Date:** 2026-06-04  
**Scope:** Flujo completo de pedido desde el menú hasta la confirmación de envío.

---

## 1. Contexto

El proyecto es una app de restaurante (Expo Router + React Native). Los clientes escanean un QR en su mesa, eligen productos del menú, y envían el pedido. El header `Header2` ya muestra un ícono de carrito con badge, pero la navegación al carrito no estaba implementada (TODO en `Header2`). El `CartProvider` ya maneja el estado de ítems (`Record<number, number>`), pero no guarda datos de producto.

---

## 2. Objetivo

Implementar:
1. **MenuProductCard** — stepper horizontal reutilizable.
2. **CartScreen** — pantalla de carrito con ítems, cantidades y total.
3. **ConfirmOrderScreen** — resumen de pedido + selección de método de pago (UI-only) + llamada a API.
4. **OrderSuccessScreen** — pantalla de éxito post-pedido.

---

## 3. Cambios de arquitectura

### 3.1 CartProvider sube al root

`CartProvider` se mueve de `Layout2` a `app/_layout.tsx` para que el grupo `(checkout)` acceda al mismo contexto de carrito que el menú.

`Layout2` mantiene `Header2` pero ya no envuelve en `CartProvider`.

### 3.2 CartProvider enriquecido

El tipo de ítem cambia de `Record<number, number>` a un array de `CartItem`:

```ts
type CartItem = {
  productId: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  quantity: number;
};
```

Métodos del provider:
- `addProduct(product: Product)` — agrega producto o incrementa si ya existe.
- `incrementProduct(productId: number)` — incrementa quantity.
- `decrementProduct(productId: number)` — decrementa; elimina si llega a 0.
- `clearCart()` — vacía ítems.
- `getProductQuantity(productId: number): number` — helper de lectura.
- `cartCount: number` — total de unidades.
- `cartTotal: number` — suma de `price * quantity`.
- `items: CartItem[]` — array público.

`MenuProductCard` siempre llama `addProduct(product)` al presionar `+`. El provider decide internamente si crear el ítem nuevo o incrementar el existente — no hay distinción en la interfaz pública.

### 3.3 Nuevo grupo de rutas `(checkout)`

```
app/
  _layout.tsx                        ← agrega CartProvider
  (header-2)/
    _layout.tsx                      ← Layout2 sin CartProvider
    restaurants/[id]/
      menu.tsx                       ← sin cambios en la ruta
  (checkout)/
    _layout.tsx                      ← fondo gris_muy_claro, sin Header2
    cart.tsx                         ← pantalla carrito
    confirm.tsx                      ← pantalla confirmación
    success.tsx                      ← pantalla éxito
```

`Header2` conecta el botón del carrito a `router.push('/(checkout)/cart')`.

---

## 4. Componentes

### 4.1 `CartStepper` (nuevo)

**Ruta:** `src/components/shared/CartStepper.tsx`

Stepper horizontal: `[-] [count] [+]`

Props:
```ts
type CartStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};
```

Comportamiento:
- Cuando `quantity === 0`, el botón `-` tiene `opacity: 0.3` y está deshabilitado.
- Usa constantes `COLORS`, `SPACING`, `BORDER_RADIUS`, `ICON_SIZES`.
- Íconos `AntDesign` (`plus`, `minus`).

### 4.2 `MenuProductCard` (modificado)

**Ruta:** `src/components/restaurants/Menu/MenuProductCard.tsx`

- Cuando `hasTable && quantity === 0`: muestra solo el botón `+` en el lado derecho.
- Cuando `hasTable && quantity > 0`: muestra `<CartStepper>` completo.
- `onIncrement` invoca `addProduct(product)` si `quantity === 0`, sino `incrementProduct`.
- El tag ("Sin tacc") no está en el tipo `Product` actual — se omite por ahora y se agrega cuando el backend exponga ese campo.

### 4.3 `CartScreen` (nuevo)

**Ruta:** `src/components/cart/CartScreen.tsx`  
**Ruta expo-router:** `app/(checkout)/cart.tsx`

Estructura:
```
[← ] Mesa {tableCode}
─────────────────────────
Card por ítem:
  [imagen] Nombre        [-] [n] [+]
           $precio × qty
─────────────────────────
Card resumen:
  Subtotal          $XXX
  Servicio          Incluido
  ─────────────────
  Total (bold)      $XXX (terracota)
─────────────────────────
[Continuar →]  (botón primario full-width)
```

Comportamiento:
- Si `items` está vacío, `router.replace('/(header-2)/restaurants/{restaurantId}/menu')`.
- El ícono de imagen del ítem usa `uri` si existe, sino placeholder.

### 4.4 `ConfirmOrderScreen` (nuevo)

**Ruta:** `src/components/checkout/ConfirmOrderScreen.tsx`  
**Ruta expo-router:** `app/(checkout)/confirm.tsx`

Estructura:
```
[← ] Confirmá tu pedido
─────────────────────────
Card mesa:
  [🍽] Mesa {tableCode}
       Código: {tableCode}
─────────────────────────
RESUMEN
Card:
  1× Nombre           $XXX
  ─────────────────────
  Total (bold)        $XXX (terracota)
─────────────────────────
MÉTODO DE PAGO
  [ ] Efectivo
  [ ] Tarjeta
  [✓] Billetera virtual   ← selección con borde terracota + check
─────────────────────────
[Confirmar Pedido]  (botón primario)
```

Comportamiento:
- Estado local `paymentMethod` ('efectivo' | 'tarjeta' | 'billetera'), default `'efectivo'`.
- Al confirmar: llama `orderService.createOrder({ table_code: session.tableCode, items: [...] })`.
- En éxito: `clearCart()` + `router.replace('/(checkout)/success')`.
- En error: muestra mensaje inline (sin pantalla de error separada).
- Botón con `loading` state mientras procesa.

### 4.5 `OrderSuccessScreen` (nuevo)

**Ruta:** `src/components/checkout/OrderSuccessScreen.tsx`  
**Ruta expo-router:** `app/(checkout)/success.tsx`

Estructura:
```
        [✓]   (círculo gris + check verde)
   ¡Pedido enviado!
   El personal ya recibió tu orden.
   Mesa {tableCode} · {hora HH:mm a.m./p.m.}

[Volver al inicio]      (botón primario)
[Ver mis pedidos]       (botón outline)
```

Comportamiento:
- `"Volver al inicio"` → `router.replace('/')`.
- `"Ver mis pedidos"` → `router.replace('/my-orders')`.
- La hora se formatea con `toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })`.
- Pantalla centrada verticalmente, sin scroll.

---

## 5. Flujo de navegación

```
Menú → [Ver pedido] → CartScreen
CartScreen → [Continuar] → ConfirmOrderScreen
ConfirmOrderScreen → [Confirmar Pedido] → (API call) → OrderSuccessScreen
OrderSuccessScreen → [Volver al inicio] → Home (/)
OrderSuccessScreen → [Ver mis pedidos] → /my-orders
```

El botón `"Ver pedido"` flotante en el menú (barra inferior) ya existe en el proyecto. `Header2` también navega al carrito con el ícono del carrito.

---

## 6. Lo que NO se implementa en este spec

- Tags de producto (ej: "Sin tacc") — requiere campo en el backend.
- Pago online — el método de pago es UI-only; se gestiona en persona en la caja.
- Notificaciones push al staff — fuera de alcance.
- Persistencia del carrito entre sesiones — se limpia al confirmar o al cambiar restaurante/mesa.
