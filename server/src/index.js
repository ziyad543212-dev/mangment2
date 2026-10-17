import 'dotenv/config';
import { app } from './app.js';
import { prisma } from './lib/prisma.js';

const required = ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_ORIGIN'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} must be configured`);
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters');
}

const port = Number(process.env.PORT || 4000);
const server = app.listen(port, () => {
  console.log(`Project management API listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
