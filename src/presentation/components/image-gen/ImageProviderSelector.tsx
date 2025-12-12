'use client';

import { Check, ChevronsUpDown, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useImageGenContext } from '@/presentation/providers';
import { IMAGE_PROVIDERS } from '@/domain/models';

/**
 * ImageProviderSelector Component
 *
 * A dropdown menu to switch between configured image generation providers.
 * Only shows providers that have API keys configured.
 */
export function ImageProviderSelector() {
  const { currentProvider, availableProviders, setCurrentProvider, isLoading } = useImageGenContext();

  // Filter to only configured providers
  const configuredProviders = availableProviders.filter((p) => p.isConfigured);

  // Don't show selector if only one provider is configured
  if (configuredProviders.length <= 1) {
    if (configuredProviders.length === 1) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Image className="h-4 w-4" />
          <span>{configuredProviders[0].name}</span>
        </div>
      );
    }
    return null;
  }

  const currentProviderConfig = currentProvider ? IMAGE_PROVIDERS[currentProvider] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading} className="w-[200px] justify-between">
          <span className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            {currentProviderConfig?.name || 'Select Provider'}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Image Provider</DropdownMenuLabel>
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
