'use client';

import { Check, ChevronsUpDown, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChatContext } from '@/presentation/providers';
import { AI_PROVIDERS } from '@/domain/models';

/**
 * ProviderSelector Component
 *
 * A dropdown menu to switch between configured AI providers.
 * Only shows providers that have API keys configured.
 */
export function ProviderSelector() {
  const { currentProvider, availableProviders, setCurrentProvider, isLoading } = useChatContext();

  // Filter to only configured providers
  const configuredProviders = availableProviders.filter((p) => p.isConfigured);

  // Don't show selector if only one provider is configured
  if (configuredProviders.length <= 1) {
    if (configuredProviders.length === 1) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bot className="h-4 w-4" />
          <span>{configuredProviders[0].name}</span>
        </div>
      );
    }
    return null;
  }

  const currentProviderConfig = currentProvider ? AI_PROVIDERS[currentProvider] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading} className="w-[200px] justify-between">
          <span className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            {currentProviderConfig?.name || 'Select Provider'}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>AI Provider</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {configuredProviders.map((provider) => (
          <DropdownMenuItem
            key={provider.type}
            onClick={() => setCurrentProvider(provider.type)}
            className="flex items-center justify-between"
          >
            <span>{provider.name}</span>
            {currentProvider === provider.type && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
