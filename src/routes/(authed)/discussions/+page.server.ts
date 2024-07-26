import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ fetch }) => {
	const resDiscussionInit = await fetch('/api/discussions/initiate');
	const discussionInit = await resDiscussionInit.json();

	const resDiscussionParticipate = await fetch('/api/discussions/participate');
	const discussionParticipate = await resDiscussionParticipate.json();

	return { discussionInit, discussionParticipate };
};
