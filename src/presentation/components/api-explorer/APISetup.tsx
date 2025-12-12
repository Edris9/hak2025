'use client';

/**
 * API Setup Component - Collapsible Info Banner
 */

import { useState } from 'react';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { Key, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export function APISetup() {
  const { availableAPIs } = useAPIExplorerContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const apisRequiringSetup = availableAPIs.filter(
    (api) => api.requiresApiKey && !api.isConfigured
  );

  if (apisRequiringSetup.length === 0) {
    return null;
  }

  return (
    <div className="border-2 border-amber-500/30 bg-amber-500/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-amber-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">
            {apisRequiringSetup.length} API{apisRequiringSetup.length > 1 ? 's' : ''} need configuration
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 grid gap-3 md:grid-cols-2">
          {apisRequiringSetup.map((api) => (
            <div key={api.type} className="bg-background rounded-lg p-3 border">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{api.name}</h4>
                <a
                  href={api.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Get Key
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <code className="block bg-muted px-2 py-1 rounded text-xs font-mono">
                {api.apiKeyEnvVar}=your_key
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
