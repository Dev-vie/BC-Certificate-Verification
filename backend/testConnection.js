require("dotenv").config();
const prisma = require("./src/prisma/prismaClient");

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Connection Failed");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
