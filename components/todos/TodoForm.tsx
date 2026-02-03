'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateTodo, useUpdateTodo, type Todo } from '@/lib/hooks/useTodos';
import { ParticipantSelector } from './ParticipantSelector';
import { MetadataDisplay } from './MetadataDisplay';
import { MetadataForm } from './MetadataForm';
import { ChecklistDisplay } from './ChecklistDisplay';
import { ChecklistForm } from './ChecklistForm';
import { NotificationDisplay } from './NotificationDisplay';
import { NotificationForm } from './NotificationForm';
import { useLanguage } from '@/lib/providers/language-provider';
import { useAddChecklistItem } from '@/lib/hooks/useChecklist';
import { useAddParticipant, useSearchUsers, type UserProfile } from '@/lib/hooks/useParticipants';
import type { TodoMetadata } from '@/lib/hooks/useMetadata';
import type { ChecklistItem } from '@/lib/hooks/useChecklist';
import type { TodoNotification } from '@/lib/hooks/useNotifications';

interface PendingChecklistItem {
  id: string; // temp id for key
  text: string;
}

interface PendingParticipant {
  userId: string;
  displayName: string;
  role: 'owner' | 'viewer';
}

interface TodoFormProps {
  todo?: Todo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TodoForm({ todo, onSuccess, onCancel }: TodoFormProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(todo?.due_date || '');
  const [dueTime, setDueTime] = useState(todo?.due_time || '');
  const [error, setError] = useState('');
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [editingMetadata, setEditingMetadata] = useState<TodoMetadata | null>(null);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [editingChecklistItem, setEditingChecklistItem] = useState<ChecklistItem | null>(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<TodoNotification | null>(null);

  // For creation mode - pending items to add after todo is created
  const [pendingChecklistItems, setPendingChecklistItems] = useState<PendingChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [pendingParticipants, setPendingParticipants] = useState<PendingParticipant[]>([]);
  const [participantSearch, setParticipantSearch] = useState('');

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const addChecklistItem = useAddChecklistItem();
  const addParticipant = useAddParticipant();
  const { data: searchResults = [] } = useSearchUsers(participantSearch);

  const isLoading = createTodo.isPending || updateTodo.isPending;
  const isCreating = !todo;

  // Add pending checklist item (for creation mode)
  const handleAddPendingChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setPendingChecklistItems([
      ...pendingChecklistItems,
      { id: `temp-${Date.now()}`, text: newChecklistText.trim() },
    ]);
    setNewChecklistText('');
  };

  // Remove pending checklist item
  const handleRemovePendingChecklistItem = (id: string) => {
    setPendingChecklistItems(pendingChecklistItems.filter((item) => item.id !== id));
  };

  // Add pending participant (for creation mode)
  const handleAddPendingParticipant = (user: UserProfile) => {
    if (pendingParticipants.some((p) => p.userId === user.id)) return;
    setPendingParticipants([
      ...pendingParticipants,
      { userId: user.id, displayName: user.display_name || 'Unknown', role: 'viewer' },
    ]);
    setParticipantSearch('');
  };

  // Remove pending participant
  const handleRemovePendingParticipant = (userId: string) => {
    setPendingParticipants(pendingParticipants.filter((p) => p.userId !== userId));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (todo) {
        // Update existing todo
        await updateTodo.mutateAsync({
          id: todo.id,
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate || undefined,
          due_time: dueTime || undefined,
        });
      } else {
        // Create new todo
        const newTodo = await createTodo.mutateAsync({
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate || undefined,
          due_time: dueTime || undefined,
        });

        // Add pending checklist items
        for (let i = 0; i < pendingChecklistItems.length; i++) {
          await addChecklistItem.mutateAsync({
            todo_id: newTodo.id,
            text: pendingChecklistItems[i].text,
            position: i,
          });
        }

        // Add pending participants
        for (const participant of pendingParticipants) {
          await addParticipant.mutateAsync({
            todoId: newTodo.id,
            userId: participant.userId,
            role: participant.role,
          });
        }
      }

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setPendingChecklistItems([]);
      setPendingParticipants([]);

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save todo');
    }
  };

  // Filter out already added participants from search results
  const availableSearchResults = searchResults.filter(
    (user) => !pendingParticipants.some((p) => p.userId === user.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <Input
        label="Title"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          placeholder="Add more details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date (optional)"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <Input
          label="Due Time (optional)"
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>

      {/* Checklist section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
            <span>✓</span>
            {t.todos.checklist.title}
          </h3>
        </div>

        {isCreating ? (
          // Creation mode - local checklist management
          <div className="space-y-3">
            {/* Add new item input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.todos.checklist.textPlaceholder || 'e.g., Buy milk'}
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPendingChecklistItem();
                  }
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddPendingChecklistItem}
                className="px-4"
              >
                +
              </Button>
            </div>

            {/* Pending items list */}
            {pendingChecklistItems.length > 0 && (
              <div className="space-y-2">
                {pendingChecklistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded border-2 border-emerald-300" />
                    <span className="flex-1 text-sm text-gray-900">{item.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingChecklistItem(item.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pendingChecklistItems.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                {t.todos.checklist.empty || 'No checklist items yet'}
              </p>
            )}
          </div>
        ) : (
          // Edit mode - use existing components
          <>
            {!showChecklistForm && !editingChecklistItem && (
              <button
                type="button"
                onClick={() => setShowChecklistForm(true)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-3"
              >
                {t.todos.checklist.addNew}
              </button>
            )}
            {showChecklistForm || editingChecklistItem ? (
              <ChecklistForm
                todoId={todo.id}
                editingItem={editingChecklistItem}
                onSuccess={() => {
                  setShowChecklistForm(false);
                  setEditingChecklistItem(null);
                }}
                onCancel={() => {
                  setShowChecklistForm(false);
                  setEditingChecklistItem(null);
                }}
              />
            ) : (
              <ChecklistDisplay
                todoId={todo.id}
                isParticipant={true}
                onEdit={(item) => setEditingChecklistItem(item)}
              />
            )}
          </>
        )}
      </div>

      {/* Sharing/Participants section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-emerald-700">
            👥 Share with
          </h3>
        </div>

        {isCreating ? (
          // Creation mode - local participant management
          <div className="space-y-3">
            {/* Search input */}
            <input
              type="text"
              placeholder="Search by name..."
              value={participantSearch}
              onChange={(e) => setParticipantSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />

            {/* Search results */}
            {participantSearch.length >= 2 && availableSearchResults.length > 0 && (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-32 overflow-y-auto">
                {availableSearchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleAddPendingParticipant(user)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-emerald-50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-emerald-700">
                        {user.display_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.display_name || 'Unknown'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {participantSearch.length >= 2 && availableSearchResults.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">No users found</p>
            )}

            {/* Pending participants list */}
            {pendingParticipants.length > 0 && (
              <div className="space-y-2">
                {pendingParticipants.map((participant) => (
                  <div
                    key={participant.userId}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-emerald-700">
                        {participant.displayName[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {participant.displayName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingParticipant(participant.userId)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pendingParticipants.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                Not shared with anyone yet
              </p>
            )}
          </div>
        ) : (
          // Edit mode - use existing ParticipantSelector
          <ParticipantSelector todoId={todo.id} isOwner={todo.is_owner || false} />
        )}
      </div>

      {/* Metadata section - only show when editing existing todo */}
      {todo && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-emerald-700">
              {t.todos.metadata.title}
            </h3>
            {!showMetadataForm && !editingMetadata && (
              <button
                type="button"
                onClick={() => setShowMetadataForm(true)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                {t.todos.metadata.addNew}
              </button>
            )}
          </div>

          {showMetadataForm || editingMetadata ? (
            <MetadataForm
              todoId={todo.id}
              editingMetadata={editingMetadata}
              onSuccess={() => {
                setShowMetadataForm(false);
                setEditingMetadata(null);
              }}
              onCancel={() => {
                setShowMetadataForm(false);
                setEditingMetadata(null);
              }}
            />
          ) : (
            <MetadataDisplay
              todoId={todo.id}
              isOwner={todo.is_owner || false}
              onEdit={(metadata) => setEditingMetadata(metadata)}
            />
          )}
        </div>
      )}

      {/* Notifications/Reminders section - only show when editing existing todo */}
      {todo && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
              <span>🔔</span>
              {t.todos.notifications.title}
            </h3>
            {!showNotificationForm && !editingNotification && (
              <button
                type="button"
                onClick={() => {
                  if (!dueDate) {
                    alert(t.todos.notifications.requiresDueDate);
                    return;
                  }
                  setShowNotificationForm(true);
                }}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                {t.todos.notifications.addNew}
              </button>
            )}
          </div>

          {!dueDate ? (
            <p className="text-sm text-gray-500 text-center py-2">
              {t.todos.notifications.requiresDueDate}
            </p>
          ) : showNotificationForm || editingNotification ? (
            <NotificationForm
              todoId={todo.id}
              dueDate={dueDate}
              dueTime={dueTime || null}
              editingNotification={editingNotification}
              onSuccess={() => {
                setShowNotificationForm(false);
                setEditingNotification(null);
              }}
              onCancel={() => {
                setShowNotificationForm(false);
                setEditingNotification(null);
              }}
            />
          ) : (
            <NotificationDisplay
              todoId={todo.id}
              onEdit={(notification) => setEditingNotification(notification)}
            />
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          {todo ? 'Update Todo' : 'Create Todo'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
