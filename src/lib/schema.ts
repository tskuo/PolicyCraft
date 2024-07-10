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

export const relatedCaseCreateFormSchema = z.object({
	title: z.string().min(1).max(80),
	description: z.string().min(1),
	userVote: z.enum(['allow', 'disallow', 'unsure'], {
		required_error: 'You need to vote on the case.'
	}),
	label: z.enum(['allow', 'disallow', 'unsure'], {
		required_error: 'You need to label the case.'
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
	description: z.string().min(1),
	label: z.string().min(1)
});

export const userLoginFormSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

export const userSignUpFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	displayName: z.string().min(6),
	code: z.string().min(1)
});

export type PolicyCreateFormSchema = typeof policyCreateFormSchema;
export type PolicyEditFormSchema = typeof policyEditFormSchema;
export type CaseCreateFormSchema = typeof caseCreateFormSchema;
export type RelatedCaseCreateFormSchema = typeof relatedCaseCreateFormSchema;
export type MessageCreateFormSchema = typeof messageCreateFormSchema;
export type DiscussionCreateFormSchema = typeof discussionCreateFormSchema;
export type ReasonCreateFormSchema = typeof reasonCreateFormSchema;
export type PolicyEditCaseFormSchema = typeof policyEditCaseFormSchema;
export type UserLoginFormSchema = typeof userLoginFormSchema;
export type UserSignUpFormSchema = typeof userSignUpFormSchema;
