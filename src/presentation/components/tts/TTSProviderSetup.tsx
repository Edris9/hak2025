'use client';

/**
 * TTS Provider Setup Component
 *
 * Shows instructions when no TTS provider is configured.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTTSContext } from '@/presentation/providers/TTSProvider';
import { Volume2, Key, ExternalLink } from 'lucide-react';

export function TTSProviderSetup() {
  const { availableProviders } = useTTSContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Volume2 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Text-to-Speech Setup</h2>
          <p className="text-muted-foreground">
            Configure at least one TTS provider to start generating speech.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {availableProviders.map((provider) => (
            <ProviderCard key={provider.type} provider={provider} />
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Environment Variables</p>
                <p className="text-muted-foreground mt-1">
                  Add your API keys to the <code className="bg-muted px-1 rounded">.env.local</code> file
                  in your project root, then restart the development server.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ProviderCardProps {
  provider: {
    type: string;
    name: string;
    description: string;
    isConfigured?: boolean;
  };
}

function ProviderCard({ provider }: ProviderCardProps) {
  const envVarName = provider.type === 'openai' ? 'OPENAI_API_KEY' : 'ELEVENLABS_API_KEY';
  const docsUrl =
    provider.type === 'openai'
      ? 'https://platform.openai.com/api-keys'
      : 'https://elevenlabs.io/app/settings/api-keys';

  return (
    <Card className={provider.isConfigured ? 'border-green-500/50 bg-green-500/5' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          {provider.name}
          {provider.isConfigured && (
            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
              Configured
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{provider.description}</p>

        {!provider.isConfigured && (
          <>
            <div className="text-sm">
              <p className="font-medium mb-1">Required:</p>
              <code className="bg-muted px-2 py-1 rounded text-xs block">
                {envVarName}=your_api_key_here
              </code>
            </div>

            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Get API Key
              <ExternalLink className="h-3 w-3" />
            </a>
          </>
        )}
      </CardContent>
    </Card>
  );
}
