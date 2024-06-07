import { z } from 'zod';

export const polictCreateFormSchema = z.object({
	title: z.string(),
	description: z.string().min(1).max(50)
});

export type PolictCreateFormSchema = typeof polictCreateFormSchema;
