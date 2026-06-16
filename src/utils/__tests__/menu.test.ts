import { formatPrice, getActiveCategories, getProductsForCategory, getCartCount } from '../menu';
import { Menu, Category, Product } from '../../types/types';

const product = (id: number, categoryId: number, active = true): Product => ({
  id,
  category_id: categoryId,
  name: `Product ${id}`,
  description: null,
  price: 100,
  image: null,
  active,
});

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

  describe('getProductsForCategory', () => {
    const menu: Menu = {
      id: 1,
      restaurant_id: 1,
      name: 'Main',
      categories: [
        category(1, true, [product(10, 1), product(11, 1, false)]),
        category(2, false, [product(20, 2)]),
        category(3, true, [product(30, 3)]),
      ],
    };

    it('devuelve los productos activos de la categoría indicada', () => {
      expect(getProductsForCategory(menu, 1).map((p) => p.id)).toEqual([10]);
    });

    it('cuando categoryId es null, devuelve los productos activos de todas las categorías activas', () => {
      // la categoría 2 está inactiva, por lo que su producto 20 se excluye; el 11 está inactivo.
      expect(getProductsForCategory(menu, null).map((p) => p.id)).toEqual([10, 30]);
    });

    it('devuelve un arreglo vacío para una categoría desconocida', () => {
      expect(getProductsForCategory(menu, 999)).toEqual([]);
    });

    it('devuelve un arreglo vacío para un menú indefinido', () => {
      expect(getProductsForCategory(undefined, 1)).toEqual([]);
      expect(getProductsForCategory(undefined, null)).toEqual([]);
    });
  });

  describe('getCartCount', () => {
    it('suma todas las cantidades', () => {
      expect(getCartCount({ 1: 2, 2: 3, 5: 1 })).toBe(6);
    });

    it('devuelve 0 para un carrito vacío', () => {
      expect(getCartCount({})).toBe(0);
    });
  });
});
