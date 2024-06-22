import { z } from 'zod';

export const policyCreateFormSchema = z.object({
	title: z.string().min(1).max(80),
	description: z.string().min(1)
});

export const policyEditFormSchema = z.object({
	title: z.string().min(1).max(80),
	description: z.string().min(1),
	cases: z
		.object({
			caseId: z.string(),
			label: z.string()
		})
		.array()
});

export const policyEditCaseFormSchema = z.object({
	cases: z
		.object({
			caseId: z.string(),
			label: z.string()
		})
		.array()
});

export const caseCreateFormSchema = z.object({
	title: z.string().min(1).max(80),
	description: z.string().min(1),
	userVote: z.enum(['allow', 'disallow', 'unsure'], {
		required_error: 'You need to vote on the case.'
	})
});

export const messageCreateFormSchema = z.object({
	message: z.string().min(1),
	id: z.string()
});

export const discussionCreateFormSchema = z.object({
	title: z.string().min(1).max(30),
	message: z.string().min(1)
});

export const reasonCreateFormSchema = z.object({
	title: z.string().min(1).max(50),
	description: z.string().min(1),
	label: z.enum(['allow', 'disallow', 'upvote', 'downvote'], {
		required_error: 'You need to label the reason.'
	})
});

export type PolicyCreateFormSchema = typeof policyCreateFormSchema;
export type PolicyEditFormSchema = typeof policyEditFormSchema;
export type CaseCreateFormSchema = typeof caseCreateFormSchema;
export type MessageCreateFormSchema = typeof messageCreateFormSchema;
export type DiscussionCreateFormSchema = typeof discussionCreateFormSchema;
export type ReasonCreateFormSchema = typeof reasonCreateFormSchema;
export type PolicyEditCaseFormSchema = typeof policyEditCaseFormSchema;
