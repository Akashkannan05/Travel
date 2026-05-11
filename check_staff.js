const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStaff() {
  const staff = await prisma.staff.findMany({
    where: {
      assignedLocation: {
        location: {
          contains: 'Bang',
          mode: 'insensitive'
        }
      }
    },
    include: {
      assignedLocation: true
    }
  });

  if (staff.length > 0) {
    console.log('Found staff members in Bangalore:');
    staff.forEach(s => {
      console.log(`- Name: ${s.name}, StaffID: ${s.staffId}, Location: ${s.assignedLocation.location}`);
    });
  } else {
    console.log('No staff members found in Bangalore.');
  }
}

checkStaff()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
