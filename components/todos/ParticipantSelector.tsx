'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useTodoParticipants,
  useSearchUsers,
  useAddParticipant,
  useRemoveParticipant,
  useUpdateParticipantRole,
} from '@/lib/hooks/useParticipants';
import { useAuth } from '@/lib/providers/auth-provider';

interface ParticipantSelectorProps {
  todoId: string;
  isOwner: boolean;
}

export function ParticipantSelector({ todoId, isOwner }: ParticipantSelectorProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { data: participants = [] } = useTodoParticipants(todoId);
  const { data: searchResults = [] } = useSearchUsers(searchQuery);
  const addParticipant = useAddParticipant();
  const removeParticipant = useRemoveParticipant();
  const updateRole = useUpdateParticipantRole();

  const handleAddParticipant = async (userId: string) => {
    await addParticipant.mutateAsync({ todoId, userId, role: 'viewer' });
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (confirm('Remove this participant?')) {
      await removeParticipant.mutateAsync({ todoId, userId });
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'owner' ? 'viewer' : 'owner';
    await updateRole.mutateAsync({ todoId, userId, role: newRole });
  };

  // Filter out participants who are already added
  const participantIds = participants.map((p) => p.user_id);
  const availableUsers = searchResults.filter((u) => !participantIds.includes(u.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Shared with ({participants.length})
        </h3>
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? 'Cancel' : '+ Add Person'}
          </Button>
        )}
      </div>

      {/* Search for users */}
      {showSearch && isOwner && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            autoFocus
          />

          {availableUsers.length > 0 && (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-48 overflow-y-auto">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleAddParticipant(user.id)}
                  disabled={addParticipant.isPending}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700">
                      {user.display_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {user.display_name || 'Unknown User'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && availableUsers.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-2">No users found</p>
          )}
        </div>
      )}

      {/* Current participants */}
      <div className="space-y-2">
        {participants.map((participant) => {
          const isCurrentUser = participant.user_id === user?.id;
          const displayName = participant.profiles?.display_name || 'Unknown User';

          return (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-700">
                  {displayName[0]?.toUpperCase() || '?'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {displayName}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-gray-500">(You)</span>
                  )}
                </p>
                <p className="text-xs text-gray-600">
                  {participant.role === 'owner' ? 'Can edit' : 'View only'}
                </p>
              </div>

              {isOwner && !isCurrentUser && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRole(participant.user_id, participant.role)}
                    disabled={updateRole.isPending}
                    className="text-xs"
                  >
                    {participant.role === 'owner' ? 'Make viewer' : 'Make editor'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveParticipant(participant.user_id)}
                    disabled={removeParticipant.isPending}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {participants.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Not shared with anyone yet
          </p>
        )}
      </div>
    </div>
  );
}
