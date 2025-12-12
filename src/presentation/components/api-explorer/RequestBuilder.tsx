'use client';

/**
 * Request Builder Component
 *
 * Form for building API requests with parameters and body.
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAPIExplorerContext } from '@/presentation/providers/APIExplorerProvider';
import { useExecuteAPI } from '@/presentation/hooks/useExecuteAPI';
import { Loader2, Play } from 'lucide-react';

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
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Select an API and endpoint to build a request
        </CardContent>
      </Card>
    );
  }

  // Check if API requires auth but isn't configured
  if (apiConfig?.requiresApiKey && !apiConfig.isConfigured) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-amber-600 font-medium mb-2">API Key Required</p>
          <p className="text-sm text-muted-foreground">
            Add <code className="bg-muted px-1 rounded">{apiConfig.apiKeyEnvVar}</code> to your .env.local file
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{selectedEndpoint.name}</CardTitle>
          <Badge variant={selectedEndpoint.method === 'GET' ? 'secondary' : 'default'}>
            {selectedEndpoint.method}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedEndpoint.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Path */}
        <div>
          <Label className="text-xs text-muted-foreground">Endpoint</Label>
          <code className="block mt-1 p-2 bg-muted rounded text-xs break-all">
            {selectedEndpoint.path}
          </code>
        </div>

        {/* Parameters */}
        {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Parameters</Label>
            {selectedEndpoint.params.map((param) => (
              <div key={param.name} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor={param.name} className="text-sm">
                    {param.name}
                    {param.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                </div>
                {param.options ? (
                  <Select
                    value={requestParams[param.name] || ''}
                    onValueChange={(value) => updateParam(param.name, value)}
                  >
                    <SelectTrigger id={param.name}>
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
                  />
                )}
                <p className="text-xs text-muted-foreground">{param.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Body for POST requests */}
        {selectedEndpoint.method === 'POST' && selectedEndpoint.bodyTemplate && (
          <div className="space-y-1">
            <Label htmlFor="body" className="text-xs text-muted-foreground">
              Request Body
            </Label>
            <Textarea
              id="body"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="font-mono text-xs min-h-[150px]"
              placeholder="Request body..."
            />
          </div>
        )}

        {/* Execute Button */}
        <Button
          onClick={executeRequest}
          disabled={isLoading}
          className="w-full"
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
