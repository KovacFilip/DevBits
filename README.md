# DevBits

## About

A platform for people to:
- Write and share posts
- Comment and discuss ideas
- Like and engage with content

## Tech Stack

### Monorepo
- Managed with [pnpm](https://pnpm.io) workspaces

### Frontend
- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)

### Backend
- [Node.js](https://nodejs.org/) + TypeScript
- [Fastify](https://fastify.dev/) for the web framework
- [InversifyJS](https://inversify.io/) for dependency injection
- [Prisma](https://www.prisma.io/) as the ORM

### Database
- [PostgreSQL](https://www.postgresql.org/)

## How to run locally

1. **Set up environment variables**

   * Copy `.env.example` to `.env` in the root directory and update values as needed.
   * Make sure to configure:

     * PostgreSQL connection string
     * Google OAuth credentials:

       ```env
       GOOGLE_CLIENT_ID=your-client-id
       GOOGLE_CLIENT_SECRET=your-client-secret
       ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start services with Docker (currently only db :/)**

   ```bash
   docker compose up -d
   ```

4. **Prepare the database**
   Navigate to the `apps/backend` directory:

   ```bash
   cd apps/backend
   pnpm db:migrate      # Run database migrations
   pnpm db:generate     # Generate Prisma client
   ```

5. **Run the application**
   From the project root:

   ```bash
   pnpm dev
   ```

6. **Authenticate via Google OAuth**

   * Open [http://localhost:3000/v1/auth/google](http://localhost:3000/v1/auth/google) in your browser.
   * After successful login, an `access-token` cookie will be set in your browser.
   * You can now call other protected endpoints with this token.

7. **Explore the API with Swagger**

   * Visit [http://localhost:3000/documentation](http://localhost:3000/documentation) to view and interact with the Swagger documentation.

8. **Access Prisma Studio (optional)**
   View and interact with your database:

   ```bash
   pnpm db:studio
   ```

9. **Run tests**

   * **Unit tests**

     ```bash
     pnpm test:unit
     pnpm test:unit:coverage
     ```

   * **Integration tests**

     ```bash
     pnpm test:integration
     ```
