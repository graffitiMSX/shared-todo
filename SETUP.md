# Setup Guide

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: shared-todo (or your preferred name)
   - **Database Password**: Generate a secure password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait ~2 minutes for provisioning

### 2. Get Supabase Credentials

1. In your Supabase project dashboard:
   - Go to **Settings** (gear icon) → **API**
   - Find "Project URL" - copy this
   - Find "Project API keys" → "anon public" - copy this

2. Create `.env.local` in project root:
```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` and paste your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Migrations

In Supabase Dashboard:

1. Go to **SQL Editor** (in left sidebar)
2. Click "New query"
3. Open `supabase/migrations/001_initial_schema.sql` in your editor
4. Copy all contents
5. Paste into Supabase SQL Editor
6. Click **RUN** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

Repeat for `002_rls_policies.sql`:
1. Click "New query" again
2. Copy contents of `supabase/migrations/002_rls_policies.sql`
3. Paste and run
4. Verify success

### 4. Verify Database Setup

In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see these tables:
   - profiles
   - todos
   - todo_participants
   - todo_metadata
   - todo_notifications

3. Click on any table → go to **Policies** tab
4. Verify RLS is **enabled** (green toggle)
5. You should see multiple policies listed

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the landing page with:
- "Shared Todo" heading
- "Sign In" and "Get Started" buttons
- Features grid

### 6. Test Authentication Setup (Next Phase)

Once Phase 2 is complete, you'll be able to:
1. Click "Get Started"
2. Register with email/password
3. Login
4. Access the todos page

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database migration fails
- Make sure you're copying the ENTIRE SQL file
- Run migrations in order (001, then 002)
- Check for error messages in SQL Editor

### Environment variables not working
- File MUST be named `.env.local` (not `.env`)
- Restart dev server after changing `.env.local`
- Verify URLs have no trailing slashes
- Keys should be the full string (very long)

### RLS policies blocking access
This is expected! RLS policies require authentication.
Wait until Phase 2 (Authentication) is complete.

## What's Next?

**Phase 2: Authentication**
- Login page
- Registration page
- OAuth integration (Google, Apple)
- User profile management

**To start Phase 2:**
User confirms Phase 1 is working, then Claude will implement authentication.

## Files Created in Phase 1

```
shared-todo/
├── .env.local.example       ✅ Template for environment variables
├── README.md                ✅ Project documentation
├── SETUP.md                 ✅ This file
├── middleware.ts            ✅ Auth middleware
├── next.config.ts           ✅ Next.js configuration
├── tailwind.config.ts       ✅ Tailwind theme
├── app/
│   ├── layout.tsx          ✅ Root layout with providers
│   └── page.tsx            ✅ Landing page
├── lib/
│   ├── supabase/
│   │   ├── client.ts       ✅ Browser client
│   │   ├── server.ts       ✅ Server client
│   │   └── types.ts        ✅ Database types
│   ├── providers/
│   │   └── query-provider.tsx ✅ TanStack Query
│   └── utils.ts            ✅ Utility functions
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  ✅ Database tables
│       └── 002_rls_policies.sql    ✅ Security policies
└── docs/
    └── phase1-summary.md   ✅ Phase 1 summary
```

## Success Criteria

Before moving to Phase 2, verify:

- [ ] Supabase project created
- [ ] `.env.local` file exists with correct credentials
- [ ] Database migrations run successfully
- [ ] All 5 tables visible in Supabase Table Editor
- [ ] RLS enabled on all tables
- [ ] `npm run dev` starts without errors
- [ ] Landing page loads at http://localhost:3000
- [ ] No console errors in browser

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Verify all steps completed in order
3. Check Supabase logs (Dashboard → Logs)
4. Verify Node.js version: `node --version` (should be 18+)

---

**Phase 1 Complete!** Ready for Phase 2: Authentication 🚀
