'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUpdateNotifications } from '@/presentation/hooks';

export function NotificationsForm() {
  const { user } = useAuth();
  const { mutate: updateNotifications, isPending } = useUpdateNotifications();

  const handleToggle = (key: string, value: boolean) => {
    updateNotifications({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications about your account activity.
            </p>
          </div>
          <Switch
            id="emailNotifications"
            checked={user?.notifications?.emailNotifications ?? true}
            onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
            disabled={isPending}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketingEmails">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about new features, updates, and promotions.
            </p>
          </div>
          <Switch
            id="marketingEmails"
            checked={user?.notifications?.marketingEmails ?? false}
            onCheckedChange={(checked) => handleToggle('marketingEmails', checked)}
            disabled={isPending}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="securityAlerts">Security Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about important security events on your account.
            </p>
          </div>
          <Switch
            id="securityAlerts"
            checked={user?.notifications?.securityAlerts ?? true}
            onCheckedChange={(checked) => handleToggle('securityAlerts', checked)}
            disabled={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
