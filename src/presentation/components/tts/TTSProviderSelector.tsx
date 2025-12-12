'use client';

/**
 * TTS Provider Selector Component
 *
 * Dropdown to select TTS provider and voice.
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTTSContext } from '@/presentation/providers/TTSProvider';
import { TTSProviderType } from '@/domain/models';

export function TTSProviderSelector() {
  const {
    currentProvider,
    setCurrentProvider,
    availableProviders,
    selectedVoice,
    setSelectedVoice,
    getVoicesForProvider,
    clearAudio,
  } = useTTSContext();

  const configuredProviders = availableProviders.filter((p) => p.isConfigured);
  const voices = getVoicesForProvider();

  const handleProviderChange = (value: string) => {
    const newProvider = value as TTSProviderType;
    setCurrentProvider(newProvider);

    // Set default voice for new provider
    const providerConfig = availableProviders.find((p) => p.type === newProvider);
    if (providerConfig?.voices?.length) {
      setSelectedVoice(providerConfig.voices[0].id);
    } else {
      setSelectedVoice(null);
    }

    // Clear any existing audio
    clearAudio();
  };

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
  };

  if (configuredProviders.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Provider selector */}
      <Select value={currentProvider || ''} onValueChange={handleProviderChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select provider" />
        </SelectTrigger>
        <SelectContent>
          {configuredProviders.map((provider) => (
            <SelectItem key={provider.type} value={provider.type}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Voice selector */}
      {voices.length > 0 && (
        <Select value={selectedVoice || ''} onValueChange={handleVoiceChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
