'use client';

import { Loader2 } from 'lucide-react';
import { APIExplorerProvider } from '@/presentation/providers';
import { useSwedishAPIs } from '@/presentation/hooks';
import {
  APISelector,
  EndpointList,
  RequestBuilder,
  ResponseViewer,
  APISetup,
} from '@/presentation/components/api-explorer';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * API Explorer Page Content
 *
 * Dashboard-style layout for exploring Swedish public APIs.
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">API Explorer</h1>
            <p className="text-sm text-muted-foreground">
              Test Swedish public APIs - {configuredCount}/{totalCount} configured
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Dashboard Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Left Panel - API & Endpoint Selection */}
        <div className="lg:col-span-3 space-y-4 overflow-auto">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-6">
              <APISelector />
              <EndpointList />
              <APISetup />
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Request Builder */}
        <div className="lg:col-span-4 overflow-auto">
          <ScrollArea className="h-full pr-2">
            <RequestBuilder />
          </ScrollArea>
        </div>

        {/* Right Panel - Response Viewer */}
        <div className="lg:col-span-5 overflow-auto">
          <ScrollArea className="h-full pr-2">
            <ResponseViewer />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

/**
 * API Explorer Page
 *
 * Interactive dashboard for testing Swedish public APIs.
 *
 * Features:
 * - Multiple Swedish public APIs (SMHI, Polisen, SCB, Trafikverket)
 * - Dynamic endpoint selection
 * - Parameter configuration
 * - Response viewing with copy/download
 * - Server-side proxy to avoid CORS
 */
export default function APIExplorerPage() {
  return (
    <APIExplorerProvider>
      <div className="h-[calc(100vh-4rem)]">
        <APIExplorerContent />
      </div>
    </APIExplorerProvider>
  );
}
