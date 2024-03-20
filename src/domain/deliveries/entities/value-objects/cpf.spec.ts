import { Cpf } from './cpf';

describe('CPF Value Object', () => {
  it('should be able to create a valid CPF', () => {
    const cpf = new Cpf('12345678909');
    expect(cpf.toString()).toBe('12345678909');
  });

  it('should not be able to create an invalid CPF', () => {
    expect(() => new Cpf('1vbxk331224')).toThrowError('Invalid CPF');
  });

  it('should be able to compare two CPFs', () => {
    const cpf1 = new Cpf('12345678909');
    const cpf2 = new Cpf('12345678909');
    expect(cpf1.isEqual(cpf2)).toBe(true);

    const differentCpf = new Cpf('49458997038');
    expect(cpf1.isEqual(differentCpf)).toBe(false);
  });

  it('should be able to validate a CPF', () => {
    expect(Cpf.isValid('12345678909')).toBe(true);
    expect(Cpf.isValid('1234567890')).toBe(false);
  });

  it('should return a masked CPF string', () => {
    const cpf = new Cpf('12345678909');
    expect(cpf.toMaskedString()).toBe('123.456.789-09');
  });
});
