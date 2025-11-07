import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma: PrismaClient = global.prismaGlobal || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

// Test database connection on startup
async function testConnection() {
  const maxRetries = 10;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      console.log('Database connection successful!');
      return;
    } catch (error) {
      retries++;
      console.log(`Database connection attempt ${retries}/${maxRetries} failed, retrying...`);
      if (retries >= maxRetries) {
        console.error('Failed to connect to database after', maxRetries, 'attempts');
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Only test connection in production (Docker)
if (process.env.NODE_ENV === 'production') {
  testConnection().catch(console.error);
}


