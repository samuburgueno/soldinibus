const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const routes = require("./data/routes.js");

async function main() {
  try {
    // Load tables
    await prisma.route.createMany({
      data: routes,
      skipDuplicates: true,
    });
  } catch (e) {
    console.log(e);
  }
}

main()
  .catch((error) => {
    // Detengo el proceso
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
