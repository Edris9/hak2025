'use client';

import { ExternalLink, Key, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AIProviderStatus } from '@/domain/models';

/**
 * ProviderSetup Component
 *
 * Displays setup instructions for AI providers when none are configured.
 * Shows step-by-step instructions for getting API keys from each provider.
 *
 * This component is essential for workshop participants to understand
 * how to configure the AI chat feature.
 */
interface ProviderSetupProps {
  providers: AIProviderStatus[];
}

export function ProviderSetup({ providers }: ProviderSetupProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No AI Provider Configured</AlertTitle>
          <AlertDescription>
            To use the AI chat feature, you need to configure at least one AI provider.
            Follow the instructions below to get an API key from your preferred provider.
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
          <p className="text-muted-foreground">
            Choose any AI provider below and follow the setup instructions.
            You only need to configure <strong>one</strong> provider to start chatting.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {providers.map((provider) => (
            <Card key={provider.type} className={provider.isConfigured ? 'border-green-500' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    {provider.name}
                  </CardTitle>
                  {provider.isConfigured && (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded">
                      Configured
                    </span>
                  )}
                </div>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Setup Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {provider.apiKeyInstructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={provider.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Get API Key
                      </a>
                    </Button>
                  </div>

                  <div className="bg-muted rounded-md p-3 text-xs font-mono">
                    <span className="text-muted-foreground"># .env.local</span>
                    <br />
                    {provider.apiKeyEnvVar}=your-api-key-here
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>After Adding Your API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Create or edit <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> in your project root</li>
              <li>Add your API key as shown in the provider instructions above</li>
              <li>Restart your development server (<code className="bg-muted px-1 py-0.5 rounded">npm run dev</code>)</li>
              <li>Refresh this page to start chatting!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
