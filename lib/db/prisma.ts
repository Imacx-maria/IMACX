import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper functions for common database operations

/**
 * Create a record in the database
 */
export async function createRecord<T, K>(
  model: any,
  data: T
): Promise<K> {
  return prisma[model].create({
    data,
  }) as Promise<K>;
}

/**
 * Find a record by ID
 */
export async function findById<T>(
  model: any,
  id: string,
  select?: Record<string, boolean>
): Promise<T | null> {
  return prisma[model].findUnique({
    where: { id },
    ...(select && { select }),
  }) as Promise<T | null>;
}

/**
 * Find a record by a specific field
 */
export async function findByField<T, M extends keyof typeof prisma>(
  model: M,
  field: string,
  value: unknown,
  select?: Record<string, boolean>
): Promise<T | null> {
  const where = { [field]: value };
  return prisma[model].findFirst({
    where,
    ...(select && { select }),
  }) as Promise<T | null>;
}

/**
 * Count records with optional filtering
 */
export async function count(
  model: any,
  where: Record<string, any> = {}
): Promise<number> {
  return prisma[model].count({
    where,
  });
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(callback);
}