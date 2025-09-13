import type { PostWithContentDTO } from '@devbits/shared';

export const samplePosts: PostWithContentDTO[] = [
	{
		postId: '550e8400-e29b-41d4-a716-446655440000',
		userId: '123e4567-e89b-12d3-a456-426614174000',
		title: 'Getting Started with SvelteKit',
		content: `
# Getting Started

Welcome to **SvelteKit** 🎉  

Here’s what we’ll cover:


- Project setup
- File-based routing
- Running the dev server


\`\`\`bash
pnpm create svelte@latest my-app
\`\`\``
	},
	{
		postId: '8f14e45f-e29b-41d4-a716-556655440001',
		userId: '223e4567-e89b-12d3-a456-426614174111',
		title: 'Understanding Zod Schemas',
		content: `## Why Zod?

Zod is great for:

1. **Type safety** in TypeScript
2. **Runtime validation** for incoming data
3. Composability with other schemas

Example:

\`\`\`ts
import { z } from "zod";

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1)
});
\`\`\``
	},
	{
		postId: 'c9f0f895-e29b-41d4-a716-556655440002',
		userId: '323e4567-e89b-12d3-a456-426614174222',
		title: 'Monorepos with pnpm',
		content: `### Benefits of a Monorepo

- Shared code across apps
- Easier dependency management
- One source of truth for types

\`\`\`yaml
packages:
  - "apps/*"
  - "packages/*"
\`\`\`

👉 Perfect setup for fullstack projects.`
	},
	{
		postId: '45c48cce-e29b-41d4-a716-556655440003',
		userId: '423e4567-e89b-12d3-a456-426614174333',
		title: 'Deploying to Vercel',
		content: `# Deploying to Vercel 🚀

1. Push your repo to GitHub
2. Connect GitHub repo to Vercel
3. Done ✅

> **Note:** Make sure to set your environment variables in the Vercel dashboard.`
	},
	{
		postId: '6512bd43-e29b-41d4-a716-556655440004',
		userId: '523e4567-e89b-12d3-a456-426614174444',
		title: 'Type-Safe APIs with tRPC',
		content: `tRPC lets you build **end-to-end type safe APIs**.

### Example

\`\`\`ts
const appRouter = t.router({
  post: t.procedure.input(createPostSchema).mutation(({ input }) => {
    return db.post.create({ data: input });
  })
});
\`\`\`

Now both frontend and backend share the same types. 🪄`
	}
];
