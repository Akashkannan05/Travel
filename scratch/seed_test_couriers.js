const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test couriers...');

  // 1) Ensure locations exist
  const locations = ['Main Branch', 'Branch B', 'Branch C', 'Branch D', 'Branch E', 'Branch F', 'Branch G'];
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { location: loc },
      update: {},
      create: { location: loc }
    });
  }

  // 2) Get staff id (STAFF001)
  const staff = await prisma.staff.findUnique({ where: { staffId: 'STAFF001' } });
  if (!staff) throw new Error('Staff STAFF001 not found');

  const staffId = staff.id;

  // 3) Create Couriers
  const couriersData = [
    {
      customerName: 'In Place User',
      phoneNumber: '1111111111',
      productDescription: 'InPlace Item',
      weight: 1.0,
      paymentMethod: 'PRE_PAYMENT',
      deadlineDate: new Date(),
      cashMethod: 'CASH',
      totalAmount: 100,
      origin: 'Main Branch',
      destination: 'Branch B',
      status: 'INPLACE'
    },
    {
      customerName: 'Shipping User',
      phoneNumber: '2222222222',
      productDescription: 'Shipping Item',
      weight: 2.0,
      paymentMethod: 'PRE_PAYMENT',
      deadlineDate: new Date(),
      cashMethod: 'CASH',
      totalAmount: 200,
      origin: 'Main Branch',
      destination: 'Branch C',
      status: 'SHIPPING'
    },
    {
      customerName: 'Incoming User',
      phoneNumber: '3333333333',
      productDescription: 'Incoming Item',
      weight: 3.0,
      paymentMethod: 'PRE_PAYMENT',
      deadlineDate: new Date(),
      cashMethod: 'CASH',
      totalAmount: 300,
      origin: 'Branch D',
      destination: 'Main Branch',
      status: 'SHIPPING'
    },
    {
      customerName: 'Received User',
      phoneNumber: '4444444444',
      productDescription: 'Received Item',
      weight: 4.0,
      paymentMethod: 'POST_PAYMENT',
      deadlineDate: new Date(),
      cashMethod: 'CASH',
      totalAmount: 400,
      origin: 'Branch E',
      destination: 'Main Branch',
      status: 'DELIVERED'
    },
    {
      customerName: 'Sent User',
      phoneNumber: '5555555555',
      productDescription: 'Sent Item',
      weight: 5.0,
      paymentMethod: 'POST_PAYMENT',
      deadlineDate: new Date(),
      cashMethod: 'CASH',
      totalAmount: 500,
      origin: 'Main Branch',
      destination: 'Branch F',
      status: 'DELIVERED'
    },
    {
      customerName: 'Pending User',
      phoneNumber: '6666666666',
      productDescription: 'Pending Item',
      weight: 6.0,
      paymentMethod: 'PRE_PAYMENT',
      deadlineDate: new Date(),
      cashMethod: 'CASH',
      totalAmount: 600,
      origin: 'Main Branch',
      destination: 'Branch G',
      status: 'PENDING'
    }
  ];

  for (const data of couriersData) {
    await prisma.courier.create({
      data: {
        ...data,
        staffId
      }
    });
  }

  console.log('✅ Test couriers seeded successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
