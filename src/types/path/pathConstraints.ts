import z from 'zod';
import { zId } from '../ZId';

export const zPatRefConstraints = z.object({ allowed_post_type_ids: zId.array() });
export type ZPatRefConstraints = z.infer<typeof zPatRefConstraints>;
export const zPatMediaConstraints = z.object({ allowed_mimes: z.string().array() });
export type ZPatMediaConstraints = z.infer<typeof zPatMediaConstraints>;

export const zPatRefConstraintDescriptior = z.object({
  data_type: z.literal('ref'),
  constraints: zPatRefConstraints,
});
export const zPatMediaConstraintDescriptior = z.object({
  data_type: z.literal('media'),
  constraints: zPatMediaConstraints,
});

export const zPathConstraints = z.union([zPatRefConstraints, zPatMediaConstraints]);
export type ZPathConstraints = z.infer<typeof zPathConstraints>;
