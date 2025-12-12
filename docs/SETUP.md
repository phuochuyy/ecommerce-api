# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create .env File

Create a `.env` file in the root directory with the following content:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**Note:** The `DATABASE_URL` format is: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

**Important:** Change `JWT_SECRET` to a secure random string in production!

## Step 3: Start Database

```bash
docker compose up -d
```

**Note:** If you get a "permission denied" error:
- Add your user to docker group: `sudo usermod -aG docker $USER` (then logout/login)
- Or use: `sudo docker compose up -d`

This will start PostgreSQL in a Docker container. Wait a few seconds for it to be ready.

## Step 4: Generate Prisma Client and Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will:
- Generate the Prisma Client (required before using the database)
- Create and apply database migrations to set up all tables

## Step 5: Start the Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

You should get: `{"status":"OK","message":"Server is running"}`

## Create an Admin User

To create an admin user, you can use the register endpoint and then update the database:

```bash
# First register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123"}'

# Then connect to the database and update the role
docker exec -it ecommerce-postgres psql -U postgres -d ecommerce
```

Then in the PostgreSQL prompt:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
\q
```

## Troubleshooting

### Database Connection Error

- Make sure Docker Compose is running: `docker-compose ps`
- Check if the database is healthy: `docker-compose logs postgres`
- Verify your `.env` file has correct database credentials

### Port Already in Use

- Change the `PORT` in `.env` file
- Or stop the service using port 3000

### Migration Errors

- Make sure the database is running
- Check `DATABASE_URL` in `.env` file
- Try resetting the database:
  ```bash
  docker compose down -v
  docker compose up -d
  npm run prisma:generate
  npm run prisma:migrate
  ```

