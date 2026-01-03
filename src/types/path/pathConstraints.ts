import z from 'zod';
import { zId } from '../ZId';

export const zPathRefConstraints = z.object({ allowed_post_type_ids: zId.array() });
export type ZPathRefConstraints = z.infer<typeof zPathRefConstraints>;
export const zPathMediaConstraints = z.object({ allowed_mimes: z.string().array() });
export type ZPathMediaConstraints = z.infer<typeof zPathMediaConstraints>;
export const zPathConstraints = z.union([zPathRefConstraints, zPathMediaConstraints]);
export type ZPathConstraints = z.infer<typeof zPathConstraints>;
