// @ts-nocheck
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { useLanguage } from '@/lib/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const supabase = createClient();
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      // Load profile data
      const loadProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('display_name, phone_number')
          .eq('id', user.id)
          .single();

        if (data) {
          const profile = data as { display_name: string | null; phone_number: string | null };
          setDisplayName(profile.display_name || '');
          setPhoneNumber(profile.phone_number || '');
        }
      };

      loadProfile();
    }
  }, [user, supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      // @ts-ignore - Database types not properly generated yet
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          phone_number: phoneNumber || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: t.common.success });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : t.common.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl pt-safe-top">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-700">
          {t.auth.settings.title}
        </h1>
        <p className="mt-2 text-gray-600">
          {t.auth.settings.profile}
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-emerald-700 mb-4">
          {t.auth.settings.profile}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div
              className={`rounded-lg p-4 text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          <Input
            label={t.auth.settings.displayName}
            type="text"
            placeholder={t.auth.register.displayNamePlaceholder}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <Input
            label={t.auth.settings.phoneNumber}
            type="tel"
            placeholder={t.auth.settings.phoneNumberPlaceholder}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {t.auth.settings.updateProfile}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
