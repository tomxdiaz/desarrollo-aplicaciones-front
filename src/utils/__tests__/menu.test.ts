import { formatPrice, getActiveCategories } from '../menu';
import { Menu, Category, Product } from '../../types/types';

const category = (id: number, active: boolean, products: Product[]): Category => ({
  id,
  menu_id: 1,
  name: `Category ${id}`,
  active,
  products,
});

describe('utilidades de menú', () => {
  describe('formatPrice', () => {
    it('formatea un precio entero usando el locale es-AR con el prefijo $', () => {
      expect(formatPrice(1500)).toBe('$1.500');
    });

    it('maneja el cero', () => {
      expect(formatPrice(0)).toBe('$0');
    });
  });

  describe('getActiveCategories', () => {
    it('devuelve solo las categorías activas', () => {
      const menu: Menu = {
        id: 1,
        restaurant_id: 1,
        name: 'Main',
        categories: [category(1, true, []), category(2, false, []), category(3, true, [])],
      };
      expect(getActiveCategories(menu).map((c) => c.id)).toEqual([1, 3]);
    });

    it('devuelve un arreglo vacío para un menú indefinido o sin categorías', () => {
      expect(getActiveCategories(undefined)).toEqual([]);
      expect(getActiveCategories({ id: 1, restaurant_id: 1, name: null })).toEqual([]);
    });
  });
});
