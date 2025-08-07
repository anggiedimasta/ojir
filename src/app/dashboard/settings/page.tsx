'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '~/components/atoms/button';
import { Card } from '~/components/atoms/card';
import { Mail, Settings as SettingsIcon, User, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  // Check for OAuth callback results
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const historyId = searchParams.get('historyId');

    if (success === 'true' && historyId) {
      setStatus(`✅ Gmail integration setup successfully! History ID: ${historyId}`);
    } else if (error) {
      setStatus(`❌ OAuth error: ${error}`);
    }
  }, [searchParams]);

  const handleGmailAuth = async () => {
    if (!session?.user?.id) {
      setStatus('❌ No user session found');
      return;
    }

    setIsLoading(true);
    setStatus('🔄 Redirecting to Google OAuth...');

    try {
      // Get OAuth URL from our API
      const response = await fetch('/api/gmail/auth?action=authorize');
      const data = await response.json();

      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get OAuth URL');
      }
    } catch (error) {
      console.error('Gmail auth error:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="h-8 w-8 text-rose-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text text-transparent">Settings</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Settings */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-semibold">Account</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <p className="text-slate-900">{session?.user?.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{session?.user?.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">User ID</label>
                  <p className="text-sm text-slate-500 font-mono">{session?.user?.id || 'Not available'}</p>
                </div>
              </div>
            </Card>

            {/* Gmail Integration */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-semibold">Gmail Integration</h2>
              </div>

              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Connect your Gmail account to automatically import bank transaction emails.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm">What this enables:</h3>
                  <ul className="text-blue-800 space-y-1 text-xs">
                    <li>• Automatic detection of bank transaction emails</li>
                    <li>• Real-time transaction import when emails arrive</li>
                    <li>• Support for Bank Mandiri, BCA, BNI, BRI, and other banks</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h3 className="font-semibold text-yellow-900 mb-2 text-sm">Privacy & Security:</h3>
                  <ul className="text-yellow-800 space-y-1 text-xs">
                    <li>• Only reads emails from bank domains</li>
                    <li>• OAuth tokens are encrypted and stored securely</li>
                    <li>• You can revoke access at any time</li>
                  </ul>
                </div>

                <Button
                  onClick={handleGmailAuth}
                  disabled={isLoading || !session?.user?.id}
                  className="w-full"
                  size="sm"
                >
                  {isLoading ? 'Setting up...' : 'Connect Gmail Account'}
                </Button>

                {status && (
                  <div className={`p-3 rounded-lg text-sm ${
                    status.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' :
                    status.includes('❌') ? 'bg-red-50 border border-red-200 text-red-800' :
                    'bg-blue-50 border border-blue-200 text-blue-800'
                  }`}>
                    {status}
                  </div>
                )}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email Notifications</label>
                    <p className="text-xs text-slate-500">Receive notifications about new transactions</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Push Notifications</label>
                    <p className="text-xs text-slate-500">Browser push notifications</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </Card>

            {/* Security */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Two-Factor Authentication</label>
                    <p className="text-xs text-slate-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Session Management</label>
                    <p className="text-xs text-slate-500">Manage active sessions</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
