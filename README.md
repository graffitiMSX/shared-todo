# Shared Todo App

A cross-platform shared to-do application for couples to manage tasks together. Built with Next.js, Supabase, and Capacitor.

## Features

- 🔐 User authentication (Email/Password + OAuth)
- ✅ Create, edit, and share todos
- 👥 Add participants to tasks
- 📱 Native mobile apps (iOS & Android via Capacitor)
- 🔔 Multiple configurable notifications per task
- 📞 Rich metadata (phone numbers, links, addresses)
- ⚡ Real-time sync across devices
- 🌐 Progressive Web App (PWA)

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

Run the SQL files in `supabase/migrations/` in your Supabase SQL editor:

1. `001_initial_schema.sql` - Creates tables and triggers
2. `002_rls_policies.sql` - Sets up Row Level Security policies

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
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (app)/             # Protected app routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Reusable UI components
│   ├── auth/              # Auth components
│   ├── todos/             # Todo components
│   └── shared/            # Shared components
├── lib/
│   ├── supabase/          # Supabase clients and types
│   ├── capacitor/         # Capacitor plugins (future)
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand stores
│   └── utils.ts           # Utility functions
├── supabase/
│   └── migrations/        # Database migrations
└── public/                # Static assets
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

**Phase 1: Project Setup & Backend** ✅ Complete
- Next.js project initialized
- Supabase clients configured
- Database schema created
- RLS policies defined
- Basic home page created

**Next Steps:**
- Phase 2: Authentication (login/register)
- Phase 3: Core Todo CRUD
- Phase 4: Participants & Sharing
- Phase 5: Rich Metadata
- Phase 6: Notification Settings
- Phase 7: Capacitor Setup
- Phase 8: Native Notifications
- Phase 9: UI Polish
- Phase 10: Testing & Deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
