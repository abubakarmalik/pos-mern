const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const env = require('./config/env');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');
const Setting = require('./src/models/setting.model');

const sampleProducts = [
  { name: 'Bottled Water', sku: 'WATER-01', category: 'Beverages', costPriceCents: 30, salePriceCents: 100, taxRate: 0, unit: 'pcs', stockOnHand: 50 },
  { name: 'Soda Can', sku: 'SODA-01', category: 'Beverages', costPriceCents: 50, salePriceCents: 150, taxRate: 0, unit: 'pcs', stockOnHand: 40 },
  { name: 'Potato Chips', sku: 'SNACK-01', category: 'Snacks', costPriceCents: 80, salePriceCents: 200, taxRate: 0, unit: 'pcs', stockOnHand: 35 },
  { name: 'Chocolate Bar', sku: 'SNACK-02', category: 'Snacks', costPriceCents: 60, salePriceCents: 180, taxRate: 0, unit: 'pcs', stockOnHand: 60 },
  { name: 'Milk 1L', sku: 'DAIRY-01', category: 'Dairy', costPriceCents: 120, salePriceCents: 250, taxRate: 0, unit: 'pcs', stockOnHand: 25 },
  { name: 'Bread Loaf', sku: 'BAKERY-01', category: 'Bakery', costPriceCents: 90, salePriceCents: 220, taxRate: 0, unit: 'pcs', stockOnHand: 30 },
  { name: 'Eggs 12-pack', sku: 'DAIRY-02', category: 'Dairy', costPriceCents: 180, salePriceCents: 350, taxRate: 0, unit: 'pcs', stockOnHand: 20 },
  { name: 'Coffee Beans', sku: 'COFFEE-01', category: 'Beverages', costPriceCents: 500, salePriceCents: 900, taxRate: 0, unit: 'pcs', stockOnHand: 15 },
  { name: 'Dish Soap', sku: 'HOME-01', category: 'Home', costPriceCents: 200, salePriceCents: 400, taxRate: 0, unit: 'pcs', stockOnHand: 18 },
  { name: 'Toothpaste', sku: 'CARE-01', category: 'Personal Care', costPriceCents: 150, salePriceCents: 320, taxRate: 0, unit: 'pcs', stockOnHand: 22 },
];

const seed = async () => {
  if (!env.MONGODB_URL) throw new Error('MONGODB_URL is missing');
  await mongoose.connect(env.MONGODB_URL);

  await User.deleteMany({});
  await Product.deleteMany({});
  await Setting.deleteMany({});

  const adminHash = await bcrypt.hash('Admin@123', 10);
  const cashierHash = await bcrypt.hash('Cashier@123', 10);

  await User.create([
    {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
    {
      name: 'Cashier',
      email: 'cashier@example.com',
      passwordHash: cashierHash,
      role: 'CASHIER',
    },
  ]);

  await Setting.create({
    shopName: 'Minimal POS',
    address: '123 Market Street',
    phone: '555-0101',
    currencySymbol: '$',
    allowNegativeStock: false,
  });

  await Product.insertMany(sampleProducts);

  console.log('✅ Seed completed');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
