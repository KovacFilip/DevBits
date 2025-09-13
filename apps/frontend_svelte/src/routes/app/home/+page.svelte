<script lang="ts">
	import PostCard from '$lib/components/post/post-card.svelte';
	import { samplePosts } from '$lib/data/posts';
</script>

<div class="flex h-full w-6xl flex-col items-center gap-4 py-8">
	{#each samplePosts as post (post.title)}
		<PostCard {...post} />
	{/each}
</div>
