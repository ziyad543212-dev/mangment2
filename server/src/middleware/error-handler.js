import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid request',
      details: error.issues.map(({ path, message }) => ({ path: path.join('.'), message }))
    });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return res.status(409).json({ error: 'A record with that value already exists' });
  }
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: 'An unexpected server error occurred' });
}
