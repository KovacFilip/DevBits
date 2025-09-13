<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { PostWithContentDTO } from '@devbits/shared';

	const { content, title, userId }: PostWithContentDTO = $props();

	const preview =
		content.replace(/[#*`_~]/g, '').slice(0, 150) + (content.length > 150 ? '...' : '');
</script>

<Card class="w-4xl cursor-pointer transition-shadow hover:shadow-lg hover:shadow-foreground">
	<CardHeader>
		<CardTitle>{title}</CardTitle>
		<CardDescription>Author ID: {userId}</CardDescription>
	</CardHeader>
	<CardContent>
		<p class="text-muted-foreground">{preview}</p>
	</CardContent>
</Card>
