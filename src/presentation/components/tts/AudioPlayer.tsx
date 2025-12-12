'use client';

/**
 * Audio Player Component
 *
 * HTML5 audio player with play/pause controls and download button.
 */

import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTTSContext } from '@/presentation/providers/TTSProvider';
import { Play, Pause, Download, Volume2 } from 'lucide-react';

export function AudioPlayer() {
  const { generatedAudio, isPlaying, setIsPlaying, audioRef, error } = useTTSContext();

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, setIsPlaying]);

  // Load audio when generated
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !generatedAudio?.audioUrl) return;

    audio.src = generatedAudio.audioUrl;
    audio.load();
  }, [generatedAudio, audioRef]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  }, [audioRef, isPlaying]);

  const handleDownload = useCallback(() => {
    if (!generatedAudio?.audioUrl) return;

    const link = document.createElement('a');
    link.href = generatedAudio.audioUrl;
    link.download = `speech.${generatedAudio.format || 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedAudio]);

  // Show error state
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div className="rounded-full bg-destructive/10 p-4">
              <Volume2 className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-destructive">Generation Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state
  if (!generatedAudio) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center gap-3 py-8">
            <div className="rounded-full bg-muted p-4">
              <Volume2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No Audio Generated</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enter some text below and click Generate Speech
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show player
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Hidden audio element */}
          <audio ref={audioRef} className="hidden" />

          {/* Play/Pause button */}
          <Button
            variant="outline"
            size="lg"
            className="h-16 w-16 rounded-full"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          {/* Audio info */}
          <div className="text-center">
            <p className="text-sm font-medium">
              {isPlaying ? 'Playing...' : 'Ready to play'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Format: {generatedAudio.format?.toUpperCase() || 'MP3'}
              {generatedAudio.duration && ` • ${Math.round(generatedAudio.duration)}s`}
            </p>
          </div>

          {/* Download button */}
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
