import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/cases');
	const cases = await res.json();

	if (res.ok) {
		for (const c of cases) {
			const reasons = [];
			for (const reasonId of c.reasons) {
				const response = await fetch(`/api/reasons/${reasonId}`);
				if (response.ok) {
					const r = await response.json();
					reasons.push(r);
				}
			}
			c.reasons = reasons;
		}
		return { cases };
	}

	throw error(404, 'Fail to load cases.');
};
