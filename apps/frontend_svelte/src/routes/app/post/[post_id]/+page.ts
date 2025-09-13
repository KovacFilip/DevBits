import { samplePosts } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return samplePosts.find((post) => post.postId === params.post_id);
};
