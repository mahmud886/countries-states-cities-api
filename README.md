# Countries / States / Cities API (Next.js + Supabase)

Production-ready REST API + Swagger UI + Explorer UI.

## Attribution

Created and maintained by **Iqbal Mahmud** (Software Engineer). I build full-stack products with a focus on clean architecture and DRY, maintainable code.

- GitHub: https://github.com/mahmud886
- LinkedIn: https://www.linkedin.com/in/mahmud886/

## Prerequisites

- Node.js 20+
- A Supabase project

## Environment Variables

Create a local environment file (recommended: `.env.local`) with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

This repo currently contains an example `.env` with `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`; the app will also accept that as the public key if `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not set.

## 1) Create Database Schema (Supabase)

Run the SQL in [schema.sql](file:///Users/snigdho/Developer/GitHub/countries-states-cities-api/supabase/schema.sql) inside the Supabase SQL Editor.

This creates:

- `regions`, `subregions`, `countries`, `states`, `cities`
- indexes for read-heavy queries
- RLS enabled with public `SELECT` policies

## 2) Import CSV Data

CSV files live in `/csv`.

Run:

```bash
npm run import:data
```

Import order:

1. regions
2. subregions
3. countries
4. states
5. cities

## 3) Run the App

```bash
npm run dev
```

Open:

- Explorer UI: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/openapi`

## REST API

All list endpoints support:

- Pagination: `?page=1&limit=20` (limit 1..100)
- Search: `?search=dhaka` (name search)
- Sorting: `?sort=name&order=asc`

### Countries

- `GET /api/countries`
- `GET /api/countries/:id`
- `GET /api/countries/:id/states`
- `GET /api/countries/:id/cities`

### States

- `GET /api/states`
- `GET /api/states/:id`
- `GET /api/states/:id/cities`

### Cities

- `GET /api/cities`
- `GET /api/cities/:id`

## API Usage Terms (Summary)

- Free to use for personal and commercial projects.
- No abuse: add rate limiting and avoid excessive automated scraping.
- No illegal use, malware, or attempts to disrupt the service.
- Attribution is recommended when you publish or redistribute the API/product.
- No warranty: use at your own risk.

See [Terms](/terms) for the full version (optional).

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE).

You are free to:

- Use
- Modify
- Distribute
