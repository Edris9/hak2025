'use client';

/**
 * API Selector Component
 *
 * Cards for selecting which Swedish API to explore.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { SwedishAPIType } from '@/domain/models';
import { Cloud, Shield, BarChart3, Train, Key, Briefcase, Building2 } from 'lucide-react';

const API_ICONS: Record<SwedishAPIType, React.ElementType> = {
  smhi: Cloud,
  polisen: Shield,
  scb: BarChart3,
  trafikverket: Train,
  jobtech: Briefcase,
  goteborg: Building2,
};

export function APISelector() {
  const {
    availableAPIs,
    selectedAPI,
    setSelectedAPI,
    setSelectedEndpoint,
    setRequestParams,
    setRequestBody,
    clearResponse,
  } = useAPIExplorerContext();

  const handleSelectAPI = (apiType: SwedishAPIType) => {
    if (apiType === selectedAPI) return;

    setSelectedAPI(apiType);
    clearResponse();

    // Find the API config and set first endpoint
    const apiConfig = availableAPIs.find((api) => api.type === apiType);
    if (apiConfig && apiConfig.endpoints.length > 0) {
      const firstEndpoint = apiConfig.endpoints[0];
      setSelectedEndpoint(firstEndpoint);

      // Set default parameters
      const defaultParams: Record<string, string> = {};
      firstEndpoint.params?.forEach((param) => {
        if (param.default) {
          defaultParams[param.name] = param.default;
        }
      });
      setRequestParams(defaultParams);

      // Set default body
      setRequestBody(firstEndpoint.bodyTemplate || '');
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground px-1">APIs</h3>
      <div className="space-y-2">
        {availableAPIs.map((api) => {
          const Icon = API_ICONS[api.type];
          const isSelected = selectedAPI === api.type;

          return (
            <Card
              key={api.type}
              className={`cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm hover:-translate-y-0.5'
              }`}
              onClick={() => handleSelectAPI(api.type)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      isSelected ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors duration-200 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{api.name}</span>
                      {api.requiresApiKey && !api.isConfigured && (
                        <Key className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {api.endpoints.length} endpoints
                    </p>
                  </div>
                  {api.isConfigured ? (
                    <Badge variant="secondary" className="text-xs">
                      Ready
                    </Badge>
                  ) : api.requiresApiKey ? (
                    <Badge variant="outline" className="text-xs text-amber-600">
                      Key needed
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
