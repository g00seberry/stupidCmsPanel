import { z } from 'zod';

export const zProblemJson = z
  .object({
    type: z.string().optional(),
    title: z.string().optional(),
    status: z.number().optional(),
    detail: z.string().optional(),
    instance: z.string().optional(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .catchall(z.unknown());

export type ZProblemJson = z.infer<typeof zProblemJson>;
