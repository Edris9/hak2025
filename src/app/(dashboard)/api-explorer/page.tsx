'use client';

import { Loader2, Globe, Zap } from 'lucide-react';
import { APIExplorerProvider } from '@/presentation/providers';
import { useSwedishAPIs } from '@/presentation/hooks';
import {
  APISelector,
  EndpointList,
  RequestBuilder,
  ResponseViewer,
  APISetup,
} from '@/presentation/components/api-explorer';
import { Badge } from '@/components/ui/badge';

/**
 * API Explorer Page Content
 */
function APIExplorerContent() {
  const { isLoading, configuredCount, totalCount } = useSwedishAPIs();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">API Explorer</h1>
            <p className="text-xs text-muted-foreground">
              Test Swedish public APIs interactively
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          {configuredCount}/{totalCount} ready
        </Badge>
      </div>

      {/* API Selector - Horizontal Tabs */}
      <APISelector />

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Endpoints + Request */}
        <div className="space-y-4">
          <EndpointList />
          <RequestBuilder />
        </div>

        {/* Right: Response */}
        <div>
          <ResponseViewer />
        </div>
      </div>

      {/* API Setup Info - Collapsible at bottom */}
      <APISetup />
    </div>
  );
}

/**
 * API Explorer Page
 */
export default function APIExplorerPage() {
  return (
    <APIExplorerProvider>
      <APIExplorerContent />
    </APIExplorerProvider>
  );
}
