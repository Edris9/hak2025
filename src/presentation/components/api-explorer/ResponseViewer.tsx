'use client';

/**
 * Response Viewer Component - Clean & Compact
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { Copy, Download, Check, Clock, AlertCircle, FileJson, FileText } from 'lucide-react';

export function ResponseViewer() {
  const { response, error, isLoading } = useAPIExplorerContext();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  const handleCopy = async () => {
    if (!response?.data) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(response.data, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!response?.data) return;

    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'response.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="border-2 border-gray-300 dark:border-gray-600 h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-5 w-20 bg-muted rounded" />
            </div>
            <div className="h-48 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-2 border-destructive/50 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Request Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No response state
  if (!response) {
    return (
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 h-full bg-muted/30">
        <CardContent className="py-16 text-center">
          <FileJson className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Execute a request to see the response</p>
        </CardContent>
      </Card>
    );
  }

  const isSuccess = response.status >= 200 && response.status < 300;
  const formattedData =
    typeof response.data === 'object'
      ? JSON.stringify(response.data, null, 2)
      : String(response.data);

  return (
    <Card className="border-2 border-gray-300 dark:border-gray-600">
      <CardContent className="p-4 space-y-3">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={isSuccess ? 'default' : 'destructive'}
              className={isSuccess ? 'bg-green-500 hover:bg-green-500' : ''}
            >
              {response.status}
            </Badge>
            <span className="text-sm text-muted-foreground">{response.statusText}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {response.timing}ms
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 w-7 p-0"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-7 w-7 p-0"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab('body')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'body'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <FileJson className="h-3 w-3" />
            Body
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'headers'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <FileText className="h-3 w-3" />
            Headers
          </button>
        </div>

        {/* Content */}
        {activeTab === 'body' && (
          <pre className="p-3 bg-muted rounded-lg overflow-auto max-h-[350px] text-xs font-mono">
            <code>{formattedData}</code>
          </pre>
        )}

        {activeTab === 'headers' && (
          <div className="p-3 bg-muted rounded-lg overflow-auto max-h-[350px]">
            {Object.entries(response.headers).length > 0 ? (
              <dl className="space-y-1.5">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-xs">
                    <dt className="font-medium text-muted-foreground min-w-[100px] font-mono">
                      {key}
                    </dt>
                    <dd className="break-all">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-xs text-muted-foreground">No headers available</p>
            )}
          </div>
        )}

        {response.error && (
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive">{response.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
