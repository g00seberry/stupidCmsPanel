import { z } from 'zod';

export const zId = z.number().or(z.string());

export type ZId = z.infer<typeof zId>;
