# SaleScribe — AI Sales Page Generator

Transform raw product information into high-converting sales pages using Google Gemini AI.

## Tech Stack
- **Next.js 15** (App Router)
- **SQLite + Prisma** (Database)
- **Zustand** (State Management)
- **NextAuth v4** (Authentication)
- **Tailwind CSS** (Styling)
- **Google Gemini 1.5 Flash** (AI Generation)
- **Zod** (Validation)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and fill in:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

Get your Gemini API key at: https://aistudio.google.com/apikey

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Initialize the database
```bash
npm run db:push
```

### 4. Run the development server
```bash
npm run dev
```

Visit http://localhost:3000

## Features

### 🔐 Authentication
- Register / Login / Logout
- JWT-based sessions via NextAuth
- bcrypt password hashing

### 🤖 AI Generation
- Google Gemini 1.5 Flash
- Zod validation of AI output
- Auto-retry on failure (3 attempts)
- Structured JSON output

### 📄 Sales Page Sections
- Hero (Headline + Subheadline)
- Pain Points
- Description
- Benefits
- Features
- Social Proof / Testimonial
- Pricing with Guarantee
- CTA

### 🎨 Templates
- **Modern** — Clean purple gradient SaaS style
- **Bold** — High-contrast black/yellow direct response
- **Minimal** — Elegant serif editorial style

### 💾 CRUD Operations
- Auto-save on generation
- View all saved pages
- Regenerate with same input
- Delete pages
- Export as clean HTML

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/         # NextAuth + Register
│   │   ├── generate/     # AI generation endpoint
│   │   └── pages/        # CRUD for saved pages
│   ├── auth/             # Login & Register pages
│   ├── dashboard/        # Main app (protected)
│   └── page.tsx          # Landing page
├── components/
│   ├── forms/            # ProductForm
│   ├── preview/          # SalesPagePreview (3 templates)
│   ├── Navbar.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── gemini.ts         # Gemini AI integration
│   ├── prisma.ts         # Prisma client
│   ├── validations.ts    # Zod schemas
│   └── exportHtml.ts     # HTML export utility
├── store/
│   └── appStore.ts       # Zustand store
└── types/
    └── index.ts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/[...nextauth]` | NextAuth handlers |
| POST | `/api/generate` | Generate sales page |
| GET | `/api/pages` | List user's pages |
| GET | `/api/pages/:id` | Get single page |
| DELETE | `/api/pages/:id` | Delete page |
| PATCH | `/api/pages/:id` | Regenerate or update template |
