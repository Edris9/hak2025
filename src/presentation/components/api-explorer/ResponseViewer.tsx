'use client';

/**
 * Response Viewer Component
 *
 * Displays API response with syntax highlighting and metadata.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { Copy, Download, Check, Clock, AlertCircle } from 'lucide-react';

export function ResponseViewer() {
  const { response, error, isLoading } = useAPIExplorerContext();
  const [copied, setCopied] = useState(false);

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
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // No response state
  if (!response) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p className="text-sm">Execute a request to see the response</p>
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Response</CardTitle>
            <Badge variant={isSuccess ? 'default' : 'destructive'}>
              {response.status} {response.statusText}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {response.timing}ms
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Tabs defaultValue="body">
          <TabsList className="h-8">
            <TabsTrigger value="body" className="text-xs">
              Body
            </TabsTrigger>
            <TabsTrigger value="headers" className="text-xs">
              Headers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-2">
            <div className="relative">
              <pre className="p-3 bg-muted rounded-md overflow-auto max-h-[400px] text-xs">
                <code>{formattedData}</code>
              </pre>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 px-2"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-7 px-2"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-2">
            <div className="p-3 bg-muted rounded-md overflow-auto max-h-[400px]">
              {Object.entries(response.headers).length > 0 ? (
                <dl className="space-y-1">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2 text-xs">
                      <dt className="font-medium text-muted-foreground min-w-[120px]">
                        {key}:
                      </dt>
                      <dd className="break-all">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-xs text-muted-foreground">No headers</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {response.error && (
          <div className="p-3 bg-destructive/10 rounded-md">
            <p className="text-sm text-destructive">{response.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
