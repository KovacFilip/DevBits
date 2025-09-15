<script lang="ts">
	import PostCreatePreview from '$lib/components/post/post-create-preview.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';
	import { cn } from '$lib/utils';

	let newPost = $state<string>('');
</script>

<div class="flex h-full w-xs flex-col gap-2 sm:w-lg md:w-2xl lg:w-5xl xl:w-6xl">
	<div class="hidden h-full flex-row justify-between gap-2 lg:flex">
		<Textarea
			class="h-full flex-1 resize-none"
			placeholder="Type your new post here"
			id="new-post"
			bind:value={newPost}
		/>
		<PostCreatePreview content={newPost} className="flex-1" />
	</div>
	<Tabs.Root value="md" class="flex h-full w-full flex-col lg:hidden">
		<Tabs.List class="w-full">
			<Tabs.Trigger value="md">New Post</Tabs.Trigger>
			<Tabs.Trigger value="view">View</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="md" class="h-0 flex-1">
			<Textarea
				class="h-full w-full resize-none"
				placeholder="Type your new post here"
				id="new-post"
				bind:value={newPost}
			/>
		</Tabs.Content>
		<Tabs.Content value="view" class="h-0 flex-1">
			<PostCreatePreview content={newPost} className="h-full min-w-full" />
		</Tabs.Content>
	</Tabs.Root>
	<Button class={cn('w-32')} disabled={newPost === ''}>Save</Button>
</div>
