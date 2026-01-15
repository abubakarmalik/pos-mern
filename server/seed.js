const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const env = require('./config/env');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');
const Setting = require('./src/models/setting.model');

const sampleProducts = [
  {
    name: 'Glyphosate 480SL Herbicide',
    sku: 'HERB-01',
    category: 'Herbicides',
    costPrice: 1600,
    salePrice: 2100,
    taxRate: 0.05,
    unit: '1 Litre',
    stockOnHand: 45,
  },
  {
    name: 'Chlorpyrifos 40% EC',
    sku: 'INSECT-01',
    category: 'Insecticides',
    costPrice: 1400,
    salePrice: 1850,
    taxRate: 0.05,
    unit: '1 Litre',
    stockOnHand: 30,
  },
  {
    name: 'Copper Sulfate (Neela Thotha)',
    sku: 'FUNG-01',
    category: 'Fungicides',
    costPrice: 650,
    salePrice: 850,
    taxRate: 0.05,
    unit: '1 kg',
    stockOnHand: 60,
  },
  {
    name: 'Neem Oil Extract (Organic)',
    sku: 'ORG-01',
    category: 'Bio Pesticide',
    costPrice: 1500,
    salePrice: 1980,
    taxRate: 0,
    unit: '500ml',
    stockOnHand: 25,
  },
  {
    name: 'Klerat Rodenticide Bait',
    sku: 'RODENT-01',
    category: 'Rodent Control',
    costPrice: 700,
    salePrice: 950,
    taxRate: 0.05,
    unit: '150gm',
    stockOnHand: 100,
  },
  {
    name: 'Lambda Cyhalothrin 2.5% EC',
    sku: 'INSECT-02',
    category: 'Insecticides',
    costPrice: 950,
    salePrice: 1350,
    taxRate: 0.05,
    unit: '1 Litre',
    stockOnHand: 20,
  },
  {
    name: 'Bifenthrin (Talstar)',
    sku: 'INSECT-03',
    category: 'Insecticides',
    costPrice: 1100,
    salePrice: 1550,
    taxRate: 0.05,
    unit: '250ml',
    stockOnHand: 40,
  },
  {
    name: 'Manual Pressure Sprayer',
    sku: 'EQUIP-01',
    category: 'Equipment',
    costPrice: 2100,
    salePrice: 2800,
    taxRate: 0.1,
    unit: '5 Litre',
    stockOnHand: 12,
  },
  {
    name: 'Nitrile Protective Gloves',
    sku: 'PPE-01',
    category: 'Safety Gear',
    costPrice: 1700,
    salePrice: 2200,
    taxRate: 0.1,
    unit: 'Box (100)',
    stockOnHand: 15,
  },
  {
    name: 'Deltamethrin Spray',
    sku: 'INSECT-04',
    category: 'Insecticides',
    costPrice: 600,
    salePrice: 850,
    taxRate: 0.05,
    unit: '500ml',
    stockOnHand: 55,
  },
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
      email: 'admin@pos.com',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
    {
      name: 'Cashier',
      email: 'cashier@pos.com',
      passwordHash: cashierHash,
      role: 'CASHIER',
    },
  ]);

  await Setting.create({
    shopName: 'Point of Sale',
    address: '123 Market Street',
    phone: '555-0101',
    currencySymbol: 'PKR',
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
