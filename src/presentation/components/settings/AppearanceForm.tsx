'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useAuth, useUpdatePreferences } from '@/presentation/hooks';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'sv', label: 'Svenska' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Francais' },
  { value: 'es', label: 'Espanol' },
];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
];

const timeFormats = [
  { value: '12h', label: '12-hour (AM/PM)' },
  { value: '24h', label: '24-hour' },
];

export function AppearanceForm() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { mutate: updatePreferences, isPending } = useUpdatePreferences();

  const handlePreferenceChange = (key: string, value: string) => {
    updatePreferences({ [key]: value });
    if (key === 'theme') {
      setTheme(value);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize how the application looks on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePreferenceChange('theme', 'light')}
              className="flex items-center gap-2"
              disabled={isPending}
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePreferenceChange('theme', 'dark')}
              className="flex items-center gap-2"
              disabled={isPending}
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePreferenceChange('theme', 'system')}
              className="flex items-center gap-2"
              disabled={isPending}
            >
              <Monitor className="h-4 w-4" />
              System
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Select your preferred theme. System will match your device settings.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>
            Set your preferred language and regional formats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={user?.preferences?.language || 'en'}
              onValueChange={(value) => handlePreferenceChange('language', value)}
              disabled={isPending}
            >
              <SelectTrigger id="language" className="w-full md:w-[280px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This will change the display language of the application.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select
              value={user?.preferences?.dateFormat || 'MM/DD/YYYY'}
              onValueChange={(value) => handlePreferenceChange('dateFormat', value)}
              disabled={isPending}
            >
              <SelectTrigger id="dateFormat" className="w-full md:w-[280px]">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="timeFormat">Time Format</Label>
            <Select
              value={user?.preferences?.timeFormat || '12h'}
              onValueChange={(value) => handlePreferenceChange('timeFormat', value)}
              disabled={isPending}
            >
              <SelectTrigger id="timeFormat" className="w-full md:w-[280px]">
                <SelectValue placeholder="Select time format" />
              </SelectTrigger>
              <SelectContent>
                {timeFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
