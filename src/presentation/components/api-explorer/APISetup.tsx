'use client';

/**
 * API Setup Component
 *
 * Shows setup instructions for APIs that require configuration.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { Key, ExternalLink } from 'lucide-react';

export function APISetup() {
  const { availableAPIs } = useAPIExplorerContext();

  const apisRequiringSetup = availableAPIs.filter(
    (api) => api.requiresApiKey && !api.isConfigured
  );

  if (apisRequiringSetup.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Key Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {apisRequiringSetup.map((api) => (
          <div key={api.type} className="space-y-2">
            <h4 className="font-medium text-sm">{api.name}</h4>
            <p className="text-xs text-muted-foreground">{api.description}</p>
            <div className="text-sm space-y-1">
              <p className="font-medium text-xs">Required:</p>
              <code className="block bg-muted px-2 py-1 rounded text-xs">
                {api.apiKeyEnvVar}=your_api_key_here
              </code>
            </div>
            <a
              href={api.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Get API Key
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
