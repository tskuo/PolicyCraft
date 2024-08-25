import { z } from 'zod';

export const policyCreateFormSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1)
		.max(80)
		.refine((value) => !/\r|\n/.test(value), {
			message: 'Input cannot include multiple lines or paragraphs'
		}),
	description: z
		.string()
		.trim()
		.min(1)
		.refine((value) => !/\r|\n/.test(value), {
			message: 'Input cannot include multiple lines or paragraphs'
		}),
	// survey for the study (should be removed later)
	survey: z.string().trim().array().nonempty({
		message: 'Please select at least one option'
	})
});

export const policyEditFormSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1)
		.max(80)
		.refine((value) => !/\r|\n/.test(value), {
			message: 'Input cannot include multiple lines or paragraphs'
		}),
	description: z
		.string()
		.trim()
		.min(1)
		.refine((value) => !/\r|\n/.test(value), {
			message: 'Input cannot include multiple lines or paragraphs'
		}),
	cases: z
		.object({
			caseId: z.string(),
			label: z.string()
		})
		.array(),
	// survey for the study (should be removed later)
	survey: z.string().trim().array().nonempty({
		message: 'Please select at least one option'
	})
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
	title: z.string().trim().min(1).max(50),
	description: z.string().trim().min(1),
	userVote: z.enum(['allow', 'disallow', 'unsure'], {
		required_error: 'You need to vote on the case.'
	}),
	reason: z.string().trim()
});

export const relatedCaseCreateFormSchema = z.object({
	title: z.string().trim().min(1).max(50),
	description: z.string().trim().min(1),
	userVote: z.enum(['allow', 'disallow', 'unsure'], {
		required_error: 'You need to vote on the case.'
	}),
	reason: z.string().trim(),
	label: z.enum(['allow', 'disallow', 'unsure'], {
		required_error: 'You need to label the case.'
	})
});

export const messageCreateFormSchema = z.object({
	message: z.string().trim().min(1),
	id: z.string()
});

export const discussionCreateFormSchema = z.object({
	title: z.string().trim().min(1).max(40),
	message: z.string().trim().min(1)
});

export const reasonCreateFormSchema = z.object({
	label: z.string().min(1),
	description: z.string().trim().min(1)
});

export const userLoginFormSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

export const userSignUpFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	displayName: z.string().trim().min(6),
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
