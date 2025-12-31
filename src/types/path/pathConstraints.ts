import z from 'zod';
import { zId } from '../ZId';

export const zPatRefConstraint = z.object({
  type: z.literal('ref'),
  constraints: z.object({ allowed_post_type_ids: zId.array() }),
});
export const zPatMediaConstraint = z.object({
  type: z.literal('media'),
  constraints: z.object({ allowed_mimes: z.string().array() }),
});

export const zPathConstraint = z.discriminatedUnion('type', [
  zPatRefConstraint,
  zPatMediaConstraint,
]);

export type ZPathConstraint = z.infer<typeof zPathConstraint>;
