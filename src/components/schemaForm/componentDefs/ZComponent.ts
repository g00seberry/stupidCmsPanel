import z from 'zod';

const zEditInputText = z.object({
  name: z.literal('inputText'),
  props: z.object({
    label: z.string(),
    placeholder: z.string().optional(),
  }),
});

const zEditInputNumber = z.object({
  name: z.literal('inputNumber'),
  props: z.object({
    label: z.string(),
    placeholder: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
  }),
});

export const zEditComponent = z.discriminatedUnion('name', [zEditInputText, zEditInputNumber]);
export type ZEditComponent = z.infer<typeof zEditComponent>;
