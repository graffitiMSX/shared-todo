# Shared Todo App

A cross-platform shared to-do application for couples to manage tasks together. Built with Next.js, Supabase, and Capacitor.

## Features

### ✅ Implemented (40% Complete)
- 🔐 User authentication (Email/Password)
- ✅ Create, edit, delete, and complete todos
- 👥 Share todos with participants (owner/viewer roles)
- 🔍 Search and add participants to tasks
- 🌍 Multi-language support (EN-US & PT-BR with auto-detection)
- 📅 Due date and time tracking
- 🎨 Modern, responsive UI with TailwindCSS
- 🔒 Row Level Security (RLS) for data protection

### 🚧 Planned Features
- 🔔 Multiple configurable notifications per task
- 📞 Rich metadata (phone numbers, links, addresses)
- ⚡ Real-time sync across devices
- 📱 Native mobile apps (iOS & Android via Capacitor)
- 🌐 Progressive Web App (PWA)
- 🔐 OAuth login (Google, Apple)

## Tech Stack

### Frontend
- **Next.js 14** (App Router) + React 18 + TypeScript
- **TailwindCSS** for styling
- **TanStack Query** for server state management
- **Zustand** for local state management

### Backend
- **Supabase** (PostgreSQL, Auth, Real-time, Storage)
- Row Level Security (RLS) for access control
- Real-time subscriptions for live updates

### Mobile
- **Capacitor 6** for native iOS/Android apps
- Local notifications via native APIs
- Push notifications for real-time updates

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shared-todo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (copy from `.env.local.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key to `.env.local`
   - Run the database migrations (see Database Setup below)

### Database Setup

Run the SQL files in `supabase/migrations/` in your Supabase SQL editor **in order**:

1. `001_initial_schema.sql` - Creates tables and triggers
2. `002_rls_policies.sql` - Sets up Row Level Security policies
3. `003_fix_rls_policies.sql` - Fixes infinite recursion in participant policies

Alternatively, you can use the combined migration file:
```bash
# Copy content from supabase/combined_migration.sql and run it in Supabase SQL editor
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Supabase (if using Supabase CLI)
```bash
npx supabase init           # Initialize Supabase locally
npx supabase start          # Start local Supabase
npx supabase db reset       # Reset database with migrations
npx supabase gen types typescript --local > lib/supabase/types.ts  # Generate types
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

#### Web App
```bash
npm run build
npm start
```

#### Mobile Apps (Future Phase)

Will be added in Phase 7 using Capacitor.

## Project Structure

```
shared-todo/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Auth routes (login, register)
│   │   ├── login/page.tsx         # Login page
│   │   └── register/page.tsx      # Register page
│   ├── auth/
│   │   └── callback/route.ts      # OAuth callback handler
│   ├── forgot-password/page.tsx   # Password reset page
│   ├── settings/page.tsx          # User settings
│   ├── todos/page.tsx             # Todo list page
│   ├── layout.tsx                 # Root layout
│   ├── not-found.tsx              # 404 page
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── button.tsx             # Button component
│   │   └── input.tsx              # Input component
│   ├── auth/                      # Auth components
│   │   ├── LoginForm.tsx          # Login form
│   │   └── RegisterForm.tsx       # Register form
│   ├── todos/                     # Todo components
│   │   ├── TodoList.tsx           # Todo list with filters
│   │   ├── TodoCard.tsx           # Todo card item
│   │   ├── TodoForm.tsx           # Create/edit todo form
│   │   └── ParticipantSelector.tsx # Participant management
│   └── shared/                    # Shared components
│       └── LanguageSwitcher.tsx   # Language toggle
├── lib/
│   ├── supabase/                  # Supabase clients
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   └── middleware.ts          # Middleware client
│   ├── hooks/                     # Custom React hooks
│   │   ├── useTodos.ts            # Todo CRUD hooks
│   │   └── useParticipants.ts     # Participant hooks
│   ├── providers/                 # Context providers
│   │   ├── auth-provider.tsx      # Auth context
│   │   ├── query-provider.tsx     # TanStack Query
│   │   └── language-provider.tsx  # i18n context
│   ├── i18n/
│   │   └── translations.ts        # EN-US & PT-BR translations
│   └── utils.ts                   # Utility functions
├── supabase/
│   ├── migrations/                # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_fix_rls_policies.sql
│   └── combined_migration.sql     # All-in-one migration
├── docs/                          # Project documentation
│   └── IMPLEMENTATION-STATUS.md   # Detailed progress
└── public/                        # Static assets
```

## Database Schema

### Tables

- **profiles**: User profiles (extends auth.users)
- **todos**: Main todo items
- **todo_participants**: Many-to-many relationship between users and todos
- **todo_metadata**: Phone numbers, links, addresses for todos
- **todo_notifications**: Configurable reminder settings

See `supabase/migrations/001_initial_schema.sql` for full schema.

## Implementation Status

**Overall Progress: 40% Complete (4/10 Phases)**

### ✅ Completed Phases

**Phase 1: Project Setup & Backend** (Week 1)
- Next.js 14 with App Router and TypeScript
- Supabase client configuration (browser + server)
- Complete database schema with 5 tables
- Row Level Security (RLS) policies
- Auth middleware for protected routes
- Landing page with responsive design

**Phase 2: Authentication** (Week 1)
- Email/password registration and login
- Server-side session management
- Auth context provider
- Protected routes with middleware
- User profile management
- Automatic profile creation on signup

**Phase 3: Core Todo CRUD** (Week 2)
- Create, read, update, delete todos
- Mark todos as complete/incomplete
- Due date and time tracking
- Real-time updates with TanStack Query
- Optimistic UI updates
- Error handling and validation
- Empty state handling

**Phase 4: Participants & Sharing** (Week 2)
- Search users by email or name
- Add participants to todos (owner/viewer roles)
- Remove participants
- Toggle participant roles
- Role-based permissions
- Participant avatars and display names

### 🚧 In Progress / Upcoming Phases

**Phase 5: Rich Metadata** (Week 3) - Not Started
- Add phone numbers, links, addresses to todos
- Quick actions (call, open link, open maps)
- Metadata display and management

**Phase 6: Notification Settings** (Week 3) - Not Started
- Configure multiple reminders per todo
- Preset and custom reminder options
- Notification preferences

**Phase 7: Capacitor Setup** (Week 4) - Not Started
- Configure Capacitor for iOS/Android
- App icons and splash screens
- Platform detection utilities

**Phase 8: Native Notifications** (Week 4-5) - Not Started
- Local notifications (native alarms)
- Push notifications (real-time updates)
- Deep linking to todos

**Phase 9: UI Polish & Mobile UX** (Week 5) - Not Started
- Bottom navigation for mobile
- Swipe actions
- Haptic feedback
- Dark mode
- Animations and transitions

**Phase 10: Testing & Deployment** (Week 6) - Not Started
- Unit and integration tests
- E2E tests
- Production deployment (Vercel)
- Mobile app builds (APK/IPA)

### 📊 Statistics
- **Lines of Code**: ~4,000+
- **Files**: 40+
- **Components**: 15+
- **Database Tables**: 5
- **API Routes**: 1 (auth callback)
- **Migrations**: 3

## Recent Updates

### Latest Changes (Phase 4 Completion)

**Multi-Language Support**
- Added EN-US and PT-BR translations
- Auto-detection from browser settings
- Manual language switcher with flag icons
- Persistent language preference in localStorage
- SSR-compatible implementation

**UI/UX Improvements**
- Improved text contrast (black text on white backgrounds)
- Consistent button styling (dark gray/black theme)
- Added navigation elements (back to home, forgot password link)
- Custom 404 page for broken links
- Better empty state handling

**Bug Fixes**
- ✅ Fixed infinite recursion in RLS policy (critical)
- ✅ Fixed empty todos showing error message
- ✅ Fixed textarea text visibility in forms
- ✅ Fixed filter button styling inconsistency
- ✅ Fixed cancel button visibility
- ✅ Improved error logging for debugging

**Database Updates**
- Migration 003: Fixed RLS policy infinite recursion
- Allows todo creators to add themselves as participants
- Improved policy performance

## Troubleshooting

### Common Issues

**"Infinite recursion detected in policy"**
- Make sure you've run migration `003_fix_rls_policies.sql`
- This fixes the RLS policy that was checking todo_participants while inserting

**"Failed to load todos"**
- Check your Supabase connection in `.env.local`
- Verify RLS policies are enabled on all tables
- Ensure migrations have been run in order

**"Network error" or "Failed to fetch"**
- Check if Supabase project is running
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check browser console for CORS errors

**Language not auto-detecting**
- Clear browser localStorage and reload
- Check browser language settings
- Language preference is stored in localStorage as 'preferred-language'

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
