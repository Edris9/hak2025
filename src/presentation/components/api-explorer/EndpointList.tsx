'use client';

/**
 * Endpoint List Component
 *
 * List of available endpoints for the selected API.
 */

import { Badge } from '@/components/ui/badge';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { APIEndpoint } from '@/domain/models';

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
      <div className="text-sm text-muted-foreground text-center py-4">
        Select an API to see endpoints
      </div>
    );
  }

  const handleSelectEndpoint = (endpoint: APIEndpoint) => {
    if (endpoint.id === selectedEndpoint?.id) return;

    setSelectedEndpoint(endpoint);
    clearResponse();

    // Set default parameters
    const defaultParams: Record<string, string> = {};
    endpoint.params?.forEach((param) => {
      if (param.default) {
        defaultParams[param.name] = param.default;
      }
    });
    setRequestParams(defaultParams);

    // Set default body
    setRequestBody(endpoint.bodyTemplate || '');
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground px-1">
        Endpoints <span className="text-xs font-normal">(click to select)</span>
      </h3>
      <div className="space-y-1.5">
        {apiConfig.endpoints.map((endpoint) => {
          const isSelected = selectedEndpoint?.id === endpoint.id;

          return (
            <button
              key={endpoint.id}
              onClick={() => handleSelectEndpoint(endpoint)}
              className={`w-full text-left p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/10 text-primary border-primary shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm hover:-translate-y-0.5 text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                  className="text-[10px] px-1.5 py-0"
                >
                  {endpoint.method}
                </Badge>
                <span className="text-sm font-medium truncate">
                  {endpoint.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {endpoint.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
