# Warehouse - E-commerce Product Management App

A full-stack e-commerce product management application built with Next.js, Express.js, PostgreSQL, and Docker. Features a modern UI with product catalog, filtering, authentication, and CRUD operations.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL 15 with Prisma ORM
- **State Management**: Redux Toolkit (RTK Query)
- **Styling**: SCSS/SASS with shadcn/ui-inspired design system
- **Authentication**: JWT-based authentication
- **Form Management**: Formik with Yup validation
- **Containerization**: Docker & Docker Compose

## Project Structure

```
nextjs-postgres-docker/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Homepage (product catalog)
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.scss              # Global styles
│   │   ├── login/                    # Login page
│   │   │   ├── page.tsx
│   │   │   └── page.module.scss
│   │   └── products/[id]/            # Product detail pages
│   │       ├── page.tsx
│   │       ├── page.module.scss
│   │       └── edit/                 # Edit product page
│   │
│   ├── components/                   # React components
│   │   ├── ProductGalleryClient.tsx  # Main product gallery (client component)
│   │   ├── ProductHeader.tsx         # Header with logo and actions
│   │   ├── ProductFilters.tsx        # Sidebar filters (search, categories, price)
│   │   ├── ProductGrid.tsx           # Product grid container
│   │   ├── ProductCard.tsx           # Individual product card
│   │   ├── AddProductDialog.tsx      # Modal for adding products
│   │   ├── EditProductDialog.tsx     # Modal for editing products
│   │   ├── ProductActions.tsx        # Edit/Delete actions for products
│   │   ├── RelatedProductsSlider.tsx # Related products section
│   │   ├── AuthGuard.tsx             # Authentication wrapper
│   │   └── ReduxProvider.tsx         # Redux store provider
│   │
│   ├── server/                       # Express.js backend
│   │   ├── index.ts                  # Express app entry point
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.ts     # Authentication logic
│   │   │   └── productController.ts  # Product CRUD logic
│   │   ├── services/                 # Business logic
│   │   │   ├── authService.ts        # Auth service layer
│   │   │   └── productService.ts     # Product service layer
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.ts         # Auth endpoints
│   │   │   └── productRoutes.ts     # Product endpoints
│   │   ├── middleware/               # Express middleware
│   │   │   └── authMiddleware.ts     # JWT authentication middleware
│   │   ├── utils/                    # Utility functions
│   │   │   ├── jwt.ts                # JWT token utilities
│   │   │   └── password.ts           # Password hashing utilities
│   │   └── scripts/                  # Utility scripts
│   │       └── createUser.ts         # User creation script
│   │
│   ├── store/                        # Redux store configuration
│   │   ├── store.ts                  # Store setup
│   │   ├── hooks.ts                  # Typed Redux hooks
│   │   └── api/
│   │       └── productsApi.ts        # RTK Query API slice
│   │
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.tsx           # Authentication context
│   │
│   ├── lib/                          # Shared utilities
│   │   └── prisma.ts                 # Prisma client instance
│   │
│   └── styles/                       # Global SCSS styles
│       ├── _variables.scss           # Design tokens (colors, spacing, typography)
│       └── _mixins.scss              # Reusable SCSS mixins
│
├── prisma/                           # Prisma schema and migrations
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migration files
│
├── docker-compose.dev.yml            # Development Docker Compose config
├── docker-compose.yml                # Production Docker Compose config
├── Dockerfile                        # Production Next.js image
├── Dockerfile.dev                    # Development Next.js image
├── Dockerfile.server                 # Express.js API image
└── .env.example                      # Environment variables template
```

## Features

- 🔐 **Authentication**: JWT-based login system
- 📦 **Product Management**: Full CRUD operations for products
- 🔍 **Search & Filtering**: Search by title, filter by category, price range
- 🎨 **Modern UI**: shadcn/ui-inspired design system with smooth animations
- 📱 **Responsive Design**: Works on all device sizes
- 🐳 **Dockerized**: Easy development and deployment with Docker
- 🔄 **Hot Reload**: Fast development with hot module replacement
- 🎯 **Type Safety**: Full TypeScript coverage

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextjs-postgres-docker
```

### 2. Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_PORT=5433
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres?schema=public

# API Configuration
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
API_INTERNAL_URL=http://localhost:3001

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### 3. Start Development Environment

Start all services using Docker Compose:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will start:

- **PostgreSQL** database on port `5433`
- **Express API** server on port `3001`
- **Next.js** frontend on port `3000`

### 4. Database Setup

Run Prisma migrations to set up the database schema:

```bash
# Inside the API container
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate deploy

# Or if running locally
npx prisma migrate deploy
```

### 5. Create a User

Create an admin user for login:

```bash
# Inside the API container
docker-compose -f docker-compose.dev.yml exec api npm run create-user

# Or if running locally
npm run create-user
```

You'll be prompted to enter:

- Email
- Password

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Database**: localhost:5433 (if you need direct access)

## Development Workflow

### Running Services Individually

If you prefer to run services separately:

```bash
# Start database only
docker-compose -f docker-compose.dev.yml up db

# Start API only (in another terminal)
docker-compose -f docker-compose.dev.yml up api

# Start Next.js only (in another terminal)
docker-compose -f docker-compose.dev.yml up next
```

### Hot Reload

The development setup includes hot reload for:

- **Next.js**: Automatic page refresh on file changes
- **Express API**: Automatic server restart on file changes (via `tsx watch`)
- **SCSS**: Automatic style recompilation

### Database Migrations

Create a new migration:

```bash
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev --name migration_name
```

### Viewing Logs

View logs for all services:

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

View logs for a specific service:

```bash
docker-compose -f docker-compose.dev.yml logs -f next
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f db
```

### Stopping Services

Stop all services:

```bash
docker-compose -f docker-compose.dev.yml down
```

Stop and remove volumes (⚠️ this will delete database data):

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Project Architecture

### Frontend Architecture

- **Server Components**: Used for initial data fetching (homepage, product detail pages)
- **Client Components**: Used for interactive features (forms, modals, filters)
- **State Management**: Redux Toolkit with RTK Query for API state management
- **Styling**: SCSS modules with a centralized design system

### Backend Architecture

- **RESTful API**: Express.js with route-based controllers
- **Service Layer**: Business logic separated from controllers
- **Authentication**: JWT tokens stored in localStorage
- **Database**: Prisma ORM for type-safe database access

### API Endpoints

#### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (if implemented)

#### Products

- `GET /api/products` - Get all products (with optional query params for filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)

## Styling System

The app uses a shadcn/ui-inspired design system with:

- **Design Tokens**: Centralized colors, spacing, typography, shadows
- **Mixins**: Reusable button, input, card, and text styles
- **SCSS Modules**: Scoped styles per component
- **Responsive Design**: Mobile-first approach with breakpoints

Key files:

- `src/styles/_variables.scss` - Design tokens
- `src/styles/_mixins.scss` - Reusable mixins
- `src/app/globals.scss` - Global styles

## Troubleshooting

### Database Connection Issues

If you see connection errors:

1. Ensure PostgreSQL container is running:

   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

2. Check database health:

   ```bash
   docker-compose -f docker-compose.dev.yml exec db pg_isready -U postgres
   ```

3. Verify `DATABASE_URL` in your `.env` file matches the database configuration

### Port Already in Use

If ports 3000, 3001, or 5433 are already in use:

1. Change ports in `docker-compose.dev.yml`
2. Update `NEXT_PUBLIC_API_URL` and `API_INTERNAL_URL` in `.env` accordingly

### Prisma Client Not Generated

If you see Prisma client errors:

```bash
docker-compose -f docker-compose.dev.yml exec api npx prisma generate
docker-compose -f docker-compose.dev.yml exec next npx prisma generate
```

### Hot Reload Not Working

Ensure volumes are properly mounted in `docker-compose.dev.yml`. The dev setup uses:

- `./prisma:/app/prisma` - For Prisma schema changes
- Source code is copied into the image (rebuild if needed)

For true hot reload, you may need to run Next.js locally:

```bash
npm install
npm run dev
```

## Production Deployment

For production, use `docker-compose.yml`:

```bash
docker-compose up --build
```

This uses production-optimized Dockerfiles and runs migrations automatically.

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
