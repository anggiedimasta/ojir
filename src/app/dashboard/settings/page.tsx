"use client";

import { Bell, Settings as SettingsIcon, Shield, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/atoms/button";
import { Card } from "~/components/atoms/card";
import { DashboardPageLayout } from "~/components/templates";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <DashboardPageLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-rose-600" />
          <h1 className="bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text font-bold text-3xl text-transparent">
            Settings
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Settings */}
          <Card className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <User className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-xl">Account</h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-slate-700 text-sm">Name</div>
                <p className="text-slate-900">
                  {session?.user?.name || "Not set"}
                </p>
              </div>
              <div>
                <div className="font-medium text-slate-700 text-sm">Email</div>
                <p className="text-slate-900">
                  {session?.user?.email || "Not set"}
                </p>
              </div>
              <div>
                <div className="font-medium text-slate-700 text-sm">
                  User ID
                </div>
                <p className="font-mono text-slate-500 text-sm">
                  {session?.user?.id || "Not available"}
                </p>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-xl">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-700 text-sm">
                    Email Notifications
                  </div>
                  <p className="text-slate-500 text-xs">
                    Receive notifications about new transactions
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-700 text-sm">
                    Push Notifications
                  </div>
                  <p className="text-slate-500 text-xs">
                    Browser push notifications
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-xl">Security</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-700 text-sm">
                    Two-Factor Authentication
                  </div>
                  <p className="text-slate-500 text-xs">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-700 text-sm">
                    Session Management
                  </div>
                  <p className="text-slate-500 text-xs">
                    Manage active sessions
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
