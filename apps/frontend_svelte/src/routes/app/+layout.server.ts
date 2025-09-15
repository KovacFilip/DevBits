import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		redirect(307, '/');
	}
};
