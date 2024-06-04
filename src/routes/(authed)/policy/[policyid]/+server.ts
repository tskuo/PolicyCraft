import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = async ({ params }) => {
	const policies = [
		{
			id: '1',
			watchList: ['user1', 'user2', 'user3'],
			title: 'Policy Title 1',
			content:
				'From server: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus vero facere, distinctio quasi alias corporis? Iste quidem impedit alias at consequatur earum, et eius magni temporibus, ab, illum inventore ut! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia quas eius inventore fugit blanditiis deserunt provident temporibus. Minus eius illum quam perferendis atque, magnam natus accusantium perspiciatis iure alias ipsum.',
			discussions: [
				{
					id: 'abc',
					title: 'Discussion title 1',
					open: true
				},
				{
					id: 'def',
					title: 'Discussion title 2',
					open: true
				},
				{
					id: 'ghi',
					title: 'Discussion title 3',
					open: true
				},
				{
					id: 'jkl',
					title: 'Closed discussion 1',
					open: false
				}
			]
		},
		{
			id: '2',
			watchList: ['user1', 'user2', 'user3', 'user4', 'user5'],
			title: 'Policy Title 2',
			content:
				'From server: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus vero facere, distinctio quasi alias corporis? Iste quidem impedit alias at consequatur earum, et eius magni temporibus, ab, illum inventore ut! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia quas eius inventore fugit blanditiis deserunt provident temporibus. Minus eius illum quam perferendis atque, magnam natus accusantium perspiciatis iure alias ipsum.',
			discussions: [
				{
					id: 'abc',
					title: 'Discussion title 1',
					open: true
				},
				{
					id: 'def',
					title: 'Discussion title 2',
					open: true
				},
				{
					id: 'ghi',
					title: 'Discussion title 3',
					open: true
				},
				{
					id: 'jkl',
					title: 'Closed discussion 1',
					open: false
				}
			]
		}
	];

	const policy = policies.find((p) => p.id == params.policyid);

	if (policy) {
		return json(policy);
	}

	throw error(404, `Policy #${params.policyid} doesn't exist.`);
};

// export const POST: RequestHandler = async (event) => {
// 	const body = await event.request.formData();

// 	// log all fields
// 	console.log([...body]);

// 	return json({
// 		// get a specific field's value
// 		name: body.get('name') ?? 'comment'
// 	});
// };
