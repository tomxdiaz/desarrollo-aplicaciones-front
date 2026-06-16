import {
  canManageTables,
  canFreeTable,
  canManageMenu,
  canViewMenu,
  canUpdateOrderStatus,
  canManageStaff,
  canEditRestaurant,
  getStaffRoleRank,
  getAssignableRoles,
  canManageMember,
} from '../staffPermissions';
import { RestaurantStaffEnum } from '../../types/types';

const { OWNER, ADMIN, CASHIER_PLUS, CASHIER } = RestaurantStaffEnum;

describe('staffPermissions', () => {
  describe('canManageTables / canManageMenu (gestión de recursos)', () => {
    it('permite a OWNER, ADMIN y CASHIER_PLUS', () => {
      [OWNER, ADMIN, CASHIER_PLUS].forEach((role) => {
        expect(canManageTables(role)).toBe(true);
        expect(canManageMenu(role)).toBe(true);
      });
    });

    it('deniega al CASHIER simple', () => {
      expect(canManageTables(CASHIER)).toBe(false);
      expect(canManageMenu(CASHIER)).toBe(false);
    });
  });

  describe('permisos otorgados a todos los roles', () => {
    it('permite a cualquier rol liberar una mesa, ver el menú y actualizar el estado del pedido', () => {
      [OWNER, ADMIN, CASHIER_PLUS, CASHIER].forEach((role) => {
        expect(canFreeTable(role)).toBe(true);
        expect(canViewMenu(role)).toBe(true);
        expect(canUpdateOrderStatus(role)).toBe(true);
      });
    });
  });

  describe('canManageStaff / canEditRestaurant', () => {
    it('solo se permite a OWNER y ADMIN', () => {
      expect(canManageStaff(OWNER)).toBe(true);
      expect(canManageStaff(ADMIN)).toBe(true);
      expect(canManageStaff(CASHIER_PLUS)).toBe(false);
      expect(canManageStaff(CASHIER)).toBe(false);

      expect(canEditRestaurant(OWNER)).toBe(true);
      expect(canEditRestaurant(ADMIN)).toBe(true);
      expect(canEditRestaurant(CASHIER_PLUS)).toBe(false);
      expect(canEditRestaurant(CASHIER)).toBe(false);
    });
  });

  describe('getStaffRoleRank', () => {
    it('ordena los roles de OWNER (más alto) a CASHIER (más bajo)', () => {
      expect(getStaffRoleRank(OWNER)).toBe(4);
      expect(getStaffRoleRank(ADMIN)).toBe(3);
      expect(getStaffRoleRank(CASHIER_PLUS)).toBe(2);
      expect(getStaffRoleRank(CASHIER)).toBe(1);
    });

    it('produce un orden estricto', () => {
      expect(getStaffRoleRank(OWNER)).toBeGreaterThan(getStaffRoleRank(ADMIN));
      expect(getStaffRoleRank(ADMIN)).toBeGreaterThan(getStaffRoleRank(CASHIER_PLUS));
      expect(getStaffRoleRank(CASHIER_PLUS)).toBeGreaterThan(getStaffRoleRank(CASHIER));
    });
  });

  describe('getAssignableRoles', () => {
    it('OWNER puede asignar todos los roles que no sean owner', () => {
      expect(getAssignableRoles(OWNER)).toEqual([ADMIN, CASHIER_PLUS, CASHIER]);
    });

    it('ADMIN solo puede asignar roles de cajero', () => {
      expect(getAssignableRoles(ADMIN)).toEqual([CASHIER_PLUS, CASHIER]);
    });

    it('los roles de cajero no pueden asignar a nadie', () => {
      expect(getAssignableRoles(CASHIER_PLUS)).toEqual([]);
      expect(getAssignableRoles(CASHIER)).toEqual([]);
    });

    it('nunca permite que un rol asigne OWNER', () => {
      [OWNER, ADMIN, CASHIER_PLUS, CASHIER].forEach((role) => {
        expect(getAssignableRoles(role)).not.toContain(OWNER);
      });
    });
  });

  describe('canManageMember', () => {
    it('OWNER puede gestionar a cualquiera, incluido otro OWNER', () => {
      [OWNER, ADMIN, CASHIER_PLUS, CASHIER].forEach((their) => {
        expect(canManageMember(OWNER, their)).toBe(true);
      });
    });

    it('gestiona solo a miembros de rango estrictamente menor', () => {
      expect(canManageMember(ADMIN, CASHIER_PLUS)).toBe(true);
      expect(canManageMember(ADMIN, CASHIER)).toBe(true);
      expect(canManageMember(CASHIER_PLUS, CASHIER)).toBe(true);
    });

    it('no puede gestionar un rango igual o superior (que no sea owner)', () => {
      expect(canManageMember(ADMIN, ADMIN)).toBe(false);
      expect(canManageMember(ADMIN, OWNER)).toBe(false);
      expect(canManageMember(CASHIER, CASHIER)).toBe(false);
      expect(canManageMember(CASHIER, ADMIN)).toBe(false);
    });
  });
});
