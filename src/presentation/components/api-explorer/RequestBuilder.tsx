'use client';

/**
 * Request Builder Component - Compact Form
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { useExecuteAPI } from '@/presentation/hooks/useExecuteAPI';
import { Loader2, Play, AlertCircle } from 'lucide-react';

export function RequestBuilder() {
  const {
    selectedAPI,
    selectedEndpoint,
    requestParams,
    requestBody,
    updateParam,
    setRequestBody,
    getCurrentAPIConfig,
  } = useAPIExplorerContext();

  const { executeRequest, isLoading } = useExecuteAPI();
  const apiConfig = getCurrentAPIConfig();

  if (!selectedAPI || !selectedEndpoint) {
    return (
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-muted/30">
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          Select an endpoint to configure the request
        </CardContent>
      </Card>
    );
  }

  if (apiConfig?.requiresApiKey && !apiConfig.isConfigured) {
    return (
      <Card className="border-2 border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-6 text-center">
          <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="font-medium text-amber-600 dark:text-amber-400">API Key Required</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add <code className="bg-muted px-1 rounded">{apiConfig.apiKeyEnvVar}</code> to .env.local
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-300 dark:border-gray-600">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Badge variant={selectedEndpoint.method === 'GET' ? 'secondary' : 'default'} className="font-mono">
              {selectedEndpoint.method}
            </Badge>
            <span className="font-medium text-sm">{selectedEndpoint.name}</span>
          </div>
        </div>

        {/* Path Preview */}
        <div>
          <Label className="text-xs text-muted-foreground">Endpoint</Label>
          <code className="block mt-1 p-2 bg-muted rounded text-xs break-all font-mono">
            {selectedEndpoint.path}
          </code>
        </div>

        {/* Parameters - Compact Grid */}
        {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Parameters</Label>
            <div className="grid gap-3">
              {selectedEndpoint.params.map((param) => (
                <div key={param.name} className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label htmlFor={param.name} className="text-xs font-medium">
                      {param.name}
                    </Label>
                    {param.required && <span className="text-destructive text-xs">*</span>}
                    <span className="text-[10px] text-muted-foreground ml-auto">{param.type}</span>
                  </div>
                  {param.options ? (
                    <Select
                      value={requestParams[param.name] || ''}
                      onValueChange={(value) => updateParam(param.name, value)}
                    >
                      <SelectTrigger id={param.name} className="h-8 text-sm">
                        <SelectValue placeholder={`Select ${param.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={param.name}
                      type={param.type === 'number' ? 'number' : 'text'}
                      value={requestParams[param.name] || ''}
                      onChange={(e) => updateParam(param.name, e.target.value)}
                      placeholder={param.default || param.description}
                      className="h-8 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body for POST */}
        {selectedEndpoint.method === 'POST' && selectedEndpoint.bodyTemplate && (
          <div className="space-y-1">
            <Label htmlFor="body" className="text-xs text-muted-foreground">
              Request Body
            </Label>
            <Textarea
              id="body"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="font-mono text-xs min-h-[100px] resize-none"
              placeholder="Request body..."
            />
          </div>
        )}

        {/* Execute Button */}
        <Button
          onClick={executeRequest}
          disabled={isLoading}
          className="w-full h-9"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Execute Request
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
