import { model } from '$lib/firebase';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { prompt } = await request.json();
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();

		return json({ text: text }, { status: 201 });
	} catch {
		throw error(400, 'Fail to generate responses.');
	}
};
