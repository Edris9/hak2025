'use client';

/**
 * API Selector Component - Horizontal Tabs
 */

import { Badge } from '@/components/ui/badge';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { SwedishAPIType } from '@/domain/models';
import { Cloud, Shield, BarChart3, Train, Key, Briefcase, Building2 } from 'lucide-react';

const API_CONFIG: Record<SwedishAPIType, { icon: React.ElementType; color: string }> = {
  smhi: { icon: Cloud, color: 'blue' },
  polisen: { icon: Shield, color: 'red' },
  scb: { icon: BarChart3, color: 'purple' },
  trafikverket: { icon: Train, color: 'orange' },
  jobtech: { icon: Briefcase, color: 'green' },
  goteborg: { icon: Building2, color: 'cyan' },
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

    const apiConfig = availableAPIs.find((api) => api.type === apiType);
    if (apiConfig && apiConfig.endpoints.length > 0) {
      const firstEndpoint = apiConfig.endpoints[0];
      setSelectedEndpoint(firstEndpoint);

      const defaultParams: Record<string, string> = {};
      firstEndpoint.params?.forEach((param) => {
        if (param.default) {
          defaultParams[param.name] = param.default;
        }
      });
      setRequestParams(defaultParams);
      setRequestBody(firstEndpoint.bodyTemplate || '');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {availableAPIs.map((api) => {
        const config = API_CONFIG[api.type];
        const Icon = config.icon;
        const isSelected = selectedAPI === api.type;
        const needsKey = api.requiresApiKey && !api.isConfigured;

        return (
          <button
            key={api.type}
            onClick={() => handleSelectAPI(api.type)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
              isSelected
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-gray-300 dark:border-gray-600 bg-card hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm'
            } ${needsKey ? 'opacity-70' : ''}`}
          >
            <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
              {api.name}
            </span>
            {needsKey && <Key className="h-3 w-3 text-amber-500" />}
            {api.isConfigured && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {api.endpoints.length}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
