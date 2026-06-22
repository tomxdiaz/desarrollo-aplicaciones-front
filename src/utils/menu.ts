import { Menu, Category } from '../types/types';

export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR')}`;
}

export function getActiveCategories(menu: Menu | undefined): Category[] {
  return (menu?.categories ?? []).filter((category) => category.active);
}
