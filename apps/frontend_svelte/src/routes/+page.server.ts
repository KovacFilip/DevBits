import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const accessToken = cookies.get('access_token');

	if (accessToken) {
		redirect(307, '/app/home');
	}
};
