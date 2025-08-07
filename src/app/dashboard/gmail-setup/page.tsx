'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '~/components/atoms/button';
import { Card } from '~/components/atoms/card';

export default function GmailSetupPage() {
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
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gmail Integration Setup</h1>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Connect Your Gmail Account</h2>
              <p className="text-slate-600">
                Authorize OJIR to access your Gmail account to automatically import bank transaction emails.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What this enables:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Automatic detection of bank transaction emails</li>
                <li>• Real-time transaction import when emails arrive</li>
                <li>• Support for Bank Mandiri, BCA, BNI, BRI, and other banks</li>
                <li>• Secure OAuth token storage with automatic refresh</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Privacy & Security:</h3>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Only reads emails from bank domains (mandiri, bca, bni, bri, etc.)</li>
                <li>• OAuth tokens are encrypted and stored securely</li>
                <li>• You can revoke access at any time from your Google Account</li>
                <li>• No email content is stored, only parsed transaction data</li>
              </ul>
            </div>

            <Button
              onClick={handleGmailAuth}
              disabled={isLoading || !session?.user?.id}
              className="w-full"
            >
              {isLoading ? 'Setting up...' : 'Connect Gmail Account'}
            </Button>

            {status && (
              <div className={`p-4 rounded-lg ${
                status.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' :
                status.includes('❌') ? 'bg-red-50 border border-red-200 text-red-800' :
                'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                {status}
              </div>
            )}

            {session?.user?.id && (
              <div className="text-sm text-slate-500">
                User ID: {session.user.id}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
