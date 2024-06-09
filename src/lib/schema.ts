import { z } from 'zod';

export const policyCreateFormSchema = z.object({
	title: z.string().min(1).max(80),
	description: z.string().min(1)
});

export type PolicyCreateFormSchema = typeof policyCreateFormSchema;

export const caseCreateFormSchema = z.object({
	title: z.string().min(1).max(80),
	description: z.string().min(1),
	// userVote: z.enum(['disallow', 'allow', 'unsure'], {
	// 	required_error: 'You need to vote on the case.'
	// })
	userVote: z.string()
});

export type CaseCreateFormSchema = typeof caseCreateFormSchema;
