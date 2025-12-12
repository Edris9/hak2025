'use client';

import { ExternalLink, Image, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImageProviderStatus } from '@/domain/models';

interface ImageProviderSetupProps {
  providers: ImageProviderStatus[];
}

/**
 * ImageProviderSetup Component
 *
 * Displays setup instructions when no image provider is configured.
 * Shows step-by-step instructions for each supported provider.
 */
export function ImageProviderSetup({ providers }: ImageProviderSetupProps) {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Image Provider Configured</AlertTitle>
        <AlertDescription>
          To use image generation, you need to configure at least one AI provider API key.
          Follow the instructions below to set up your preferred provider.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.type} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                {provider.name}
              </CardTitle>
              <CardDescription>{provider.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {provider.apiKeyInstructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
              <a
                href={provider.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
              >
                Get API Key
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ))}

        <Card className="flex flex-col bg-muted/50">
          <CardHeader>
            <CardTitle>After Setup</CardTitle>
            <CardDescription>
              Once you&apos;ve added your API key:
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Save your .env.local file</li>
              <li>Restart the development server</li>
              <li>Refresh this page</li>
              <li>Start generating images!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
