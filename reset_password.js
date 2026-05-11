const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  const staffId = 'STAFF002';
  const newPassword = 'travel@123';
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const updatedStaff = await prisma.staff.update({
    where: { staffId },
    data: { passwordHash }
  });

  console.log(`Password reset successful for ${updatedStaff.name} (ID: ${staffId})`);
  console.log(`New password: ${newPassword}`);
}

resetPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
