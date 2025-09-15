<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { PostWithContentDTO } from '@devbits/shared';

	const { content, title, postId, userId }: PostWithContentDTO = $props();

	const preview =
		content.replace(/[#*`_~]/g, '').slice(0, 150) + (content.length > 150 ? '...' : '');
</script>

<Card
	onclick={() => {
		goto(resolve(`/app/post/${postId}`));
	}}
	class="w-xs cursor-pointer transition-shadow hover:shadow-lg hover:shadow-foreground sm:w-md md:w-3xl lg:w-4xl xl:w-6xl"
>
	<CardHeader>
		<CardTitle>{title}</CardTitle>
		<CardDescription>Author ID: {userId}</CardDescription>
	</CardHeader>
	<CardContent>
		<p class="overflow-x-hidden text-muted-foreground">{preview}</p>
	</CardContent>
</Card>
