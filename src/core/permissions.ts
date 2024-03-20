export const permissions = {
  admin: [
    'create.shipper',
    'delete.shipper',
    'update.shipper',
    'read.shipper',
    'create.order',
    'delete.order',
    'update.order',
    'read.order',
    'create.addressee',
    'delete.addressee',
    'update.addressee',
    'read.addressee',
  ],
  shipper: ['update.order'],
};
