'use client';

/**
 * Endpoint List Component - Compact Horizontal Scroll
 */

import { Badge } from '@/components/ui/badge';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { APIEndpoint } from '@/domain/models';
import { ChevronRight } from 'lucide-react';

export function EndpointList() {
  const {
    selectedAPI,
    selectedEndpoint,
    setSelectedEndpoint,
    setRequestParams,
    setRequestBody,
    clearResponse,
    getCurrentAPIConfig,
  } = useAPIExplorerContext();

  const apiConfig = getCurrentAPIConfig();

  if (!selectedAPI || !apiConfig) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-muted/30">
        Select an API above to see endpoints
      </div>
    );
  }

  const handleSelectEndpoint = (endpoint: APIEndpoint) => {
    if (endpoint.id === selectedEndpoint?.id) return;

    setSelectedEndpoint(endpoint);
    clearResponse();

    const defaultParams: Record<string, string> = {};
    endpoint.params?.forEach((param) => {
      if (param.default) {
        defaultParams[param.name] = param.default;
      }
    });
    setRequestParams(defaultParams);
    setRequestBody(endpoint.bodyTemplate || '');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Endpoints</h3>
        <span className="text-xs text-muted-foreground">{apiConfig.endpoints.length} available</span>
      </div>
      <div className="grid gap-2">
        {apiConfig.endpoints.map((endpoint) => {
          const isSelected = selectedEndpoint?.id === endpoint.id;

          return (
            <button
              key={endpoint.id}
              onClick={() => handleSelectEndpoint(endpoint)}
              className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-200 group ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-sm'
                  : 'border-gray-300 dark:border-gray-600 bg-card hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                  className="text-[10px] px-1.5 py-0 h-4 font-mono"
                >
                  {endpoint.method}
                </Badge>
                <span className={`text-sm font-medium flex-1 truncate ${isSelected ? 'text-primary' : ''}`}>
                  {endpoint.name}
                </span>
                <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-primary' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate pl-12">
                {endpoint.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
