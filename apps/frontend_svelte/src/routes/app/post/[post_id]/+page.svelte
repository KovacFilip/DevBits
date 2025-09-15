<script lang="ts">
	import Post from '$lib/components/post/post.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if !data.content}
	<div>Unable to load the post</div>
{:else}
	<div>
		<Post {...data} />
	</div>
{/if}
