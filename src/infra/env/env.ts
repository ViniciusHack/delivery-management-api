import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(8888),
  DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;
