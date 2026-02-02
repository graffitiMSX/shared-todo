# 🚀 Quick Start Guide

## Phase 1 is Complete! Just 2 Steps Left:

### Step 1: Run Database Migrations (5 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://chaarutunrhoyjhrsgfq.supabase.co
   - Click **SQL Editor** in left sidebar
   - Click **New query**

2. **Run First Migration**
   - Open file: `supabase/migrations/001_initial_schema.sql`
   - Copy ENTIRE contents (all ~150 lines)
   - Paste into Supabase SQL Editor
   - Click **RUN** (or Cmd+Enter)
   - Should see: ✅ "Success. No rows returned"

3. **Run Second Migration**
   - Click **New query** again
   - Open file: `supabase/migrations/002_rls_policies.sql`
   - Copy ENTIRE contents (all ~220 lines)
   - Paste into Supabase SQL Editor
   - Click **RUN**
   - Should see: ✅ "Success. No rows returned"

### Step 2: Verify & Start (2 minutes)

```bash
# Verify setup
npm run verify

# Start development server
npm run dev
```

Open: http://localhost:3000

You should see the **Shared Todo** landing page! 🎉

---

## ✅ Verification Checklist

After running migrations, verify in Supabase Dashboard:

**Go to Table Editor:**
- [ ] See `profiles` table
- [ ] See `todos` table
- [ ] See `todo_participants` table
- [ ] See `todo_metadata` table
- [ ] See `todo_notifications` table

**Click any table → Policies tab:**
- [ ] RLS is enabled (green toggle)
- [ ] Multiple policies listed

**Run locally:**
- [ ] `npm run verify` passes
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 shows landing page

---

## 🎯 What You'll Get

### Database Tables (5 tables)
- **profiles** - Your profile info
- **todos** - Todo items with due dates
- **todo_participants** - Share todos with partner
- **todo_metadata** - Phone numbers, links, addresses
- **todo_notifications** - Multiple reminders per todo

### Security
- ✅ Row Level Security on all tables
- ✅ Can only see your shared todos
- ✅ Owners control permissions

### Ready for Phase 2
Once migrations are done, ready for:
- ✅ Login/Registration
- ✅ OAuth (Google, Apple)
- ✅ User profiles

---

## 🆘 Need Help?

See **SETUP.md** for detailed instructions

See **NEXT-STEPS.md** for complete guide

**Quick fixes:**
```bash
# Module errors
rm -rf node_modules package-lock.json && npm install

# Clear cache
rm -rf .next && npm run dev

# Verify environment
cat .env.local  # Should have your Supabase URL/key
```

---

## 📞 Support

- Migration errors → Check you copied ENTIRE file
- RLS issues → Make sure both migrations ran
- Server won't start → Delete `.next` folder

**Once migrations are done, let Claude know to proceed with Phase 2!** 🚀
