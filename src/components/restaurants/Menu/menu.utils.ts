import { Category, Menu, Product } from '../../../types/types';

export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR')}`;
}

export function getActiveCategories(menu: Menu | undefined): Category[] {
  return (menu?.categories ?? []).filter((category) => category.active);
}

export function getProductsForCategory(menu: Menu | undefined, categoryId: number | null): Product[] {
  const categories = getActiveCategories(menu);

  if (categoryId === null) {
    return categories.flatMap((category) => (category.products ?? []).filter((product) => product.active));
  }

  const category = categories.find((item) => item.id === categoryId);
  return (category?.products ?? []).filter((product) => product.active);
}

export function getCartCount(quantities: Record<number, number>): number {
  return Object.values(quantities).reduce((total, quantity) => total + quantity, 0);
}
