# Product Catalog Application

A full-stack Product Catalog Application built with Next.js, TypeScript, Redux Toolkit Query, Formik, SASS, Docker, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 14 (with TypeScript)
- **Styling**: SASS
- **State Management**: Redux Toolkit Query
- **Forms**: Formik with Yup validation
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker & Docker Compose

## Features

### Product Listing Page (`/`)
- Grid layout with product cards displaying image, title, and price
- "Add Product" button that opens a form dialog
- Search bar for filtering products by title
- Category filter with checkboxes
- Price range filter (min/max inputs)
- Sort by price (High to Low, Low to High)

### Product Detail Page (`/products/[id]`)
- Full product details (image, title, description, category, price, availability)
- Related products section (3-4 items from the same category)
- Edit and Delete product buttons

### Product Management
- Create new products with auto-generated IDs
- Update existing products
- Delete products
- Form validation using Formik and Yup

## Database Schema

The Product schema includes:
- `title` (string, required)
- `description` (text, required)
- `image` (string, required) - Image URL
- `category` (enum, required) - Clothing, Shoes, Electronics, Books, Home, Sports, Toys, Beauty, Other
- `price` (decimal, required)
- `availability` (boolean, required)

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-postgres-docker
   ```

2. **Build and start the application**
   ```bash
   docker compose up --build
   ```

   This will:
   - Build the Next.js application
   - Start the PostgreSQL database
   - Run database migrations automatically
   - Start the application on http://localhost:3000

3. **Create initial database migration** (if needed)
   ```bash
   docker compose exec app npx prisma migrate dev --name init
   ```

### Development

To run the application in development mode:

```bash
# Start containers
docker compose up

# In another terminal, run migrations (if schema changed)
docker compose exec app npx prisma migrate dev --name migration_name

# View logs
docker compose logs -f app
```

### Database Management

**Create a new migration:**
```bash
docker compose exec app npx prisma migrate dev --name migration_name
```

**Apply existing migrations:**
```bash
docker compose exec app npx prisma migrate deploy
```

**View database in Prisma Studio:**
```bash
docker compose exec app npx prisma studio
```

**Reset database (WARNING: deletes all data):**
```bash
docker compose exec app npx prisma migrate reset
```

## API Endpoints

### Products

- `GET /api/products` - Get all products with optional filters
  - Query parameters: `search`, `category`, `minPrice`, `maxPrice`, `sortBy`
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product
- `GET /api/products/[id]/related` - Get related products

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── products/         # Product detail pages
│   │   ├── layout.tsx        # Root layout with Redux Provider
│   │   ├── page.tsx          # Product listing page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── AddProductDialog.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ReduxProvider.tsx
│   ├── lib/
│   │   └── prisma.ts         # Prisma client
│   └── store/
│       ├── api/              # Redux Toolkit Query API slices
│       ├── hooks.ts          # Typed Redux hooks
│       └── store.ts          # Redux store configuration
├── prisma/
│   └── schema.prisma         # Database schema
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker image configuration
└── package.json             # Dependencies and scripts
```

## Environment Variables

The application uses the following environment variables:

- `DATABASE_URL` - PostgreSQL connection string (automatically set in Docker)

For local development (outside Docker), create a `.env` file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres?schema=public"
```

## Database Credentials

Default credentials (configured in `docker-compose.yml`):
- **Username**: `postgres`
- **Password**: `postgres`
- **Database**: `postgres`
- **Port**: `5433` (host) / `5432` (container)

## Usage

1. **Access the application**: http://localhost:3000
2. **Add a product**: Click "Add Product" button and fill in the form
3. **Search products**: Use the search bar to filter by title
4. **Filter by category**: Select one or more categories
5. **Filter by price**: Enter min/max price values
6. **Sort products**: Select sort order from the dropdown
7. **View product details**: Click on any product card
8. **Edit/Delete products**: Use buttons on the product detail page

## Troubleshooting

### Database connection issues

If you encounter database connection errors:

1. Ensure Docker containers are running:
   ```bash
   docker compose ps
   ```

2. Check database logs:
   ```bash
   docker compose logs db
   ```

3. Restart containers:
   ```bash
   docker compose down
   docker compose up --build
   ```

### Migration issues

If migrations fail:

1. Check if database is accessible:
   ```bash
   docker compose exec app npx prisma migrate status
   ```

2. Reset and recreate migrations:
   ```bash
   docker compose exec app npx prisma migrate reset
   docker compose exec app npx prisma migrate dev --name init
   ```

## Production Deployment

For production deployment:

1. Update database credentials in `docker-compose.yml`
2. Set `NODE_ENV=production` in environment variables
3. Build and deploy:
   ```bash
   docker compose -f docker-compose.prod.yml up --build
   ```

## License

This project is part of a developer assignment.

## Demo

**Live Demo URL**: [To be provided]

**Admin Panel Credentials**: [To be provided]

---

Built with ❤️ using Next.js, TypeScript, Redux Toolkit Query, Formik, SASS, Docker, and PostgreSQL.
