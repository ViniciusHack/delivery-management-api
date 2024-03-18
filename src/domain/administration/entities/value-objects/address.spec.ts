import { Address } from './address';

describe('Address Value Object', () => {
  it('should be able to create a valid Address', () => {
    const address = new Address({
      street: 'Rua das Flores',
      number: 123,
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      zipCode: '12345678',
    });

    expect(address.street).toBe('Rua das Flores');
    expect(address.number).toBe(123);
    expect(address.neighborhood).toBe('Centro');
    expect(address.city).toBe('São Paulo');
    expect(address.state).toBe('SP');
    expect(address.country).toBe('Brasil');
    expect(address.zipCode).toBe('12345678');
  });
});
