import { vi } from 'vitest';

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    then: vi.fn(),
  }),
};

// Mock user for authenticated tests
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    display_name: 'Test User',
  },
  created_at: '2024-01-01T00:00:00.000Z',
};

// Mock session
export const mockSession = {
  user: mockUser,
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_at: Date.now() + 3600000,
};

// Mock todos
export const mockTodos = [
  {
    id: 'todo-1',
    title: 'Test Todo 1',
    description: 'Description 1',
    completed: false,
    due_date: '2024-12-31',
    due_time: '10:00',
    created_by: 'test-user-id',
    created_at: '2024-01-01T00:00:00.000Z',
    is_owner: true,
  },
  {
    id: 'todo-2',
    title: 'Test Todo 2',
    description: null,
    completed: true,
    due_date: null,
    due_time: null,
    created_by: 'test-user-id',
    created_at: '2024-01-02T00:00:00.000Z',
    is_owner: true,
  },
];

// Mock participants
export const mockParticipants = [
  {
    id: 'participant-1',
    todo_id: 'todo-1',
    user_id: 'test-user-id',
    role: 'owner',
    profiles: {
      id: 'test-user-id',
      display_name: 'Test User',
      email: 'test@example.com',
    },
  },
];

// Mock notifications
export const mockNotifications = [
  {
    id: 'notification-1',
    todo_id: 'todo-1',
    notify_at: '2024-12-30T10:00:00.000Z',
    notification_type: 'local',
    message: 'Reminder!',
    sent: false,
    created_at: '2024-01-01T00:00:00.000Z',
  },
];

// Factory function to create Supabase mock with custom data
export function createSupabaseMock(overrides: Record<string, unknown> = {}) {
  return {
    ...mockSupabaseClient,
    ...overrides,
  };
}
