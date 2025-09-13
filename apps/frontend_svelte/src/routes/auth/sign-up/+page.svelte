<script lang="ts">
	import GoogleIcon from '$lib/assets/icons/google-icon.svelte';
	import NavigationLink from '$lib/components/navigation/navigation-link.svelte';
	import H3 from '$lib/components/typography/h3.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
</script>

<div class="flex h-full flex-col items-center justify-center gap-8 bg-background text-foreground">
	<Card class="md:min-w-sm">
		<CardHeader><H3>Sign Up</H3></CardHeader>
		<CardContent class="flex flex-col gap-4">
			<Input placeholder="Email" type="email" />
			<Input type="password" placeholder="Password" />
			<Input type="password" placeholder="Confirm Password" />
			<Button>Sign Up</Button>
			<div class="flex justify-center">
				<Button
					class="h-8 w-64 bg-secondary-foreground hover:scale-105 hover:cursor-pointer hover:bg-muted-foreground"
				>
					<GoogleIcon />
				</Button>
			</div>

			<div class="flex items-center gap-2 text-sm text-muted-foreground">
				<span class="h-px flex-1 bg-border"></span>
				<span>or</span>
				<span class="h-px flex-1 bg-border"></span>
			</div>

			<p class="text-center text-sm text-muted-foreground">
				Already have an account?
				<NavigationLink path="/auth/sign-in">Sign in</NavigationLink>
			</p>
		</CardContent>
	</Card>
</div>
