import { imIOwner } from '../owner';
import { Restaurant } from '../../types/types';

const restaurant = (ownerId: string): Restaurant => ({
  id: 1,
  name: 'Test',
  owner_id: ownerId,
  description: null,
  address: null,
  image: null,
});

describe('imIOwner', () => {
  it('devuelve true cuando el usuario es dueño del restaurante', () => {
    expect(imIOwner(restaurant('user-1'), 'user-1')).toBe(true);
  });

  it('devuelve false cuando el usuario no es dueño del restaurante', () => {
    expect(imIOwner(restaurant('user-1'), 'user-2')).toBe(false);
  });
});
