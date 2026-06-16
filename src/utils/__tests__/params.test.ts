import { getParam } from '../params';

describe('getParam', () => {
  it('devuelve el string tal cual', () => {
    expect(getParam('42')).toBe('42');
  });

  it('devuelve el primer elemento de un arreglo', () => {
    expect(getParam(['first', 'second'])).toBe('first');
  });

  it('devuelve undefined cuando el valor es undefined', () => {
    expect(getParam(undefined)).toBeUndefined();
  });

  it('devuelve undefined para un arreglo vacío', () => {
    expect(getParam([])).toBeUndefined();
  });
});
