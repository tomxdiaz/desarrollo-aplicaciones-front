import { isRole } from '../role';
import { AppRoleEnum, AppUser } from '../../types/types';

const user = (role: AppRoleEnum): AppUser => ({
  id: 'user-1',
  email: 'user@example.com',
  global_role: role,
});

describe('isRole', () => {
  it('devuelve true cuando el rol del usuario está en la lista permitida', () => {
    expect(isRole(user(AppRoleEnum.OWNER), [AppRoleEnum.OWNER, AppRoleEnum.SUPER_USER])).toBe(true);
  });

  it('devuelve false cuando el rol del usuario no está en la lista permitida', () => {
    expect(isRole(user(AppRoleEnum.USER), [AppRoleEnum.OWNER, AppRoleEnum.SUPER_USER])).toBe(false);
  });

  it('devuelve false para una lista permitida vacía', () => {
    expect(isRole(user(AppRoleEnum.SUPER_USER), [])).toBe(false);
  });
});
