import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create roles
  console.log('Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      name: 'manager',
      description: 'Manager with elevated access',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'staff' },
    update: {},
    create: {
      name: 'staff',
      description: 'Staff with limited access',
    },
  });

  console.log('Roles created:', { adminRole, managerRole, staffRole });

  // Create demo users
  // Note: In a real application, you would create users through Supabase Auth
  // and then link them to profiles in your database
  console.log('Creating demo users...');

  // For demo purposes, we'll create placeholder users
  // In a real app, you'd use Supabase Auth to create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'admin-user-id',
      email: 'admin@example.com',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          roleId: adminRole.id,
        },
      },
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      id: 'manager-user-id',
      email: 'manager@example.com',
      profile: {
        create: {
          firstName: 'Manager',
          lastName: 'User',
          roleId: managerRole.id,
        },
      },
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      id: 'staff-user-id',
      email: 'staff@example.com',
      profile: {
        create: {
          firstName: 'Staff',
          lastName: 'User',
          roleId: staffRole.id,
        },
      },
    },
  });

  console.log('Users created:', { adminUser, managerUser, staffUser });

  // Create inventory categories
  console.log('Creating inventory categories...');
  const rawMaterialsCategory = await prisma.category.upsert({
    where: { id: 'raw-materials' },
    update: {},
    create: {
      id: 'raw-materials',
      name: 'Raw Materials',
      description: 'Raw materials used in production',
    },
  });

  const finishedGoodsCategory = await prisma.category.upsert({
    where: { id: 'finished-goods' },
    update: {},
    create: {
      id: 'finished-goods',
      name: 'Finished Goods',
      description: 'Completed products ready for sale',
    },
  });

  const packagingCategory = await prisma.category.upsert({
    where: { id: 'packaging' },
    update: {},
    create: {
      id: 'packaging',
      name: 'Packaging',
      description: 'Packaging materials',
    },
  });

  console.log('Categories created:', { 
    rawMaterialsCategory, 
    finishedGoodsCategory,
    packagingCategory
  });

  // Create inventory items
  console.log('Creating inventory items...');
  const items = [
    {
      name: 'Aluminum Sheet',
      description: 'Standard aluminum sheet, 1mm thickness',
      sku: 'RAW-AL-001',
      quantity: 500,
      unitPrice: 25.99,
      categoryId: rawMaterialsCategory.id,
    },
    {
      name: 'Steel Rod',
      description: 'Steel rod, 10mm diameter',
      sku: 'RAW-ST-001',
      quantity: 300,
      unitPrice: 15.50,
      categoryId: rawMaterialsCategory.id,
    },
    {
      name: 'Metal Cabinet',
      description: 'Standard metal cabinet, 2-door',
      sku: 'FIN-CAB-001',
      quantity: 50,
      unitPrice: 299.99,
      categoryId: finishedGoodsCategory.id,
    },
    {
      name: 'Cardboard Box (Large)',
      description: 'Large cardboard box for shipping',
      sku: 'PKG-BOX-001',
      quantity: 1000,
      unitPrice: 2.50,
      categoryId: packagingCategory.id,
    },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: item,
    });
  }

  console.log(`Created ${items.length} inventory items`);

  // Create customers
  console.log('Creating customers...');
  const customers = [
    {
      id: 'cust-001',
      name: 'Acme Corporation',
      email: 'orders@acme.com',
      phone: '555-123-4567',
      address: '123 Main St',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    {
      id: 'cust-002',
      name: 'Globex Industries',
      email: 'purchasing@globex.com',
      phone: '555-987-6543',
      address: '456 Tech Blvd',
      city: 'Silicon Valley',
      state: 'CA',
      zipCode: '94025',
      country: 'USA',
    },
    {
      id: 'cust-003',
      name: 'Wayne Enterprises',
      email: 'procurement@wayne.com',
      phone: '555-789-0123',
      address: '1 Wayne Tower',
      city: 'Gotham',
      state: 'NJ',
      zipCode: '07101',
      country: 'USA',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: customer,
    });
  }

  console.log(`Created ${customers.length} customers`);

  // Create quotes
  console.log('Creating quotes...');
  const quotes = [
    {
      id: 'quote-001',
      quoteNumber: 'Q-2025-001',
      customerId: 'cust-001',
      status: 'sent',
      totalAmount: 1499.95,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes: 'Standard delivery terms apply',
    },
    {
      id: 'quote-002',
      quoteNumber: 'Q-2025-002',
      customerId: 'cust-002',
      status: 'draft',
      totalAmount: 775.00,
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      notes: 'Expedited shipping requested',
    },
  ];

  for (const quote of quotes) {
    await prisma.quote.upsert({
      where: { id: quote.id },
      update: {},
      create: quote,
    });
  }

  console.log(`Created ${quotes.length} quotes`);

  // Create quote items
  console.log('Creating quote items...');
  const quoteItems = [
    {
      id: 'qitem-001',
      quoteId: 'quote-001',
      inventoryItemId: await prisma.inventoryItem.findFirst({ where: { sku: 'FIN-CAB-001' } }).then((item: any) => item!.id),
      quantity: 5,
      unitPrice: 299.99,
      discount: 0,
    },
    {
      id: 'qitem-002',
      quoteId: 'quote-002',
      inventoryItemId: await prisma.inventoryItem.findFirst({ where: { sku: 'RAW-AL-001' } }).then((item: any) => item!.id),
      quantity: 30,
      unitPrice: 25.99,
      discount: 0.05, // 5% discount
    },
  ];

  for (const item of quoteItems) {
    await prisma.quoteItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  console.log(`Created ${quoteItems.length} quote items`);

  // Create production orders
  console.log('Creating production orders...');
  const productionOrders = [
    {
      id: 'prod-001',
      orderNumber: 'PO-2025-001',
      status: 'in_progress',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notes: 'Priority production run',
    },
  ];

  for (const order of productionOrders) {
    await prisma.productionOrder.upsert({
      where: { id: order.id },
      update: {},
      create: order,
    });
  }

  console.log(`Created ${productionOrders.length} production orders`);

  // Create production tasks
  console.log('Creating production tasks...');
  const productionTasks = [
    {
      id: 'task-001',
      productionOrderId: 'prod-001',
      name: 'Material Preparation',
      description: 'Prepare raw materials for production',
      status: 'completed',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 'task-002',
      productionOrderId: 'prod-001',
      name: 'Assembly',
      description: 'Assemble components',
      status: 'in_progress',
      startDate: new Date(),
      endDate: null,
    },
    {
      id: 'task-003',
      productionOrderId: 'prod-001',
      name: 'Quality Control',
      description: 'Perform quality checks',
      status: 'pending',
      startDate: null,
      endDate: null,
    },
  ];

  for (const task of productionTasks) {
    await prisma.productionTask.upsert({
      where: { id: task.id },
      update: {},
      create: task,
    });
  }

  console.log(`Created ${productionTasks.length} production tasks`);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });