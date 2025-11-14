import { z } from 'zod';

export const zId = z
  .number()
  .or(z.string())
  .transform((val: number | string) => String(val));

export type ZId = z.infer<typeof zId>;
