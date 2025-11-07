# Development Setup with Hot Reload

This guide explains how to set up hot reload for styling and frontend development.

## Option 1: Run Next.js Locally (Recommended for Styling)

This is the fastest way to develop and style components with instant hot reload.

### Steps:

1. **Start only the database and API in Docker:**
   ```bash
   docker compose up db api
   ```

2. **Install dependencies locally (if not already done):**
   ```bash
   npm install
   ```

3. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

4. **Create `.env.local` file:**
   ```bash
   cp .env.local.example .env.local
   ```

5. **Run Next.js locally:**
   ```bash
   npm run dev
   ```

Now you can edit SCSS files and see changes instantly without rebuilding Docker!

- Next.js: `http://localhost:3000` (local, hot reload enabled)
- API: `http://localhost:3001` (Docker)
- Database: `localhost:5433` (Docker)

## Option 2: Run Everything in Docker with Hot Reload

If you prefer to keep everything in Docker, use the development override:

### Steps:

1. **Start services with dev override:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

   Or use the convenience script:
   ```bash
   ./dev.sh
   ```

2. **Edit files** - Changes to `src/`, `public/`, and SCSS files will hot reload automatically.

### Stop services:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

## Which Option to Choose?

- **Option 1 (Local Next.js)**: Best for styling, fastest hot reload, easier debugging
- **Option 2 (Docker with volumes)**: Keeps everything containerized, good for testing full Docker setup

## Troubleshooting

### Port conflicts:
- Make sure ports 3000, 3001, and 5433 are available
- Check if other services are using these ports

### Prisma client issues:
- Run `npm run prisma:generate` after pulling changes
- Make sure `DATABASE_URL` is set correctly

### Hot reload not working:
- Check that volumes are mounted correctly (Option 2)
- Restart the dev server
- Clear `.next` cache: `rm -rf .next`

