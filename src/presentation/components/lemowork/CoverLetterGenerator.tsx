'use client';

import { useState } from 'react';
import { FileText, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Job {
  id: string;
  headline: string;
  employer?: {
    name: string;
  };
  description?: {
    text?: string;
  };
}

interface CoverLetterGeneratorProps {
  selectedJobs: Job[];
}

export function CoverLetterGenerator({ selectedJobs }: CoverLetterGeneratorProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateCoverLetter = async () => {
    if (selectedJobs.length === 0) {
      setError('Välj ett jobb från listan');
      return;
    }

    setLoading(true);
    setError(null);
    setCoverLetter('');

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobs: selectedJobs.map((job) => ({
            headline: job.headline,
            employer: job.employer?.name || 'företaget',
            description: job.description?.text || job.headline,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Misslyckades att generera personligt brev');
      }

      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Personligt Brev
        </CardTitle>
        <CardDescription>
          {selectedJobs.length > 0
            ? `Generera personligt brev baserat på valt jobb`
            : 'Välj ett jobb från listan för att generera ett personligt brev'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Job Summary */}
        {selectedJobs.length > 0 && (
          <div className="bg-accent/50 p-3 rounded-lg border space-y-1">
            <p className="text-sm font-medium">Valt jobb:</p>
            <p className="text-xs text-muted-foreground truncate">
              • {selectedJobs[0].headline}
              {selectedJobs[0].employer?.name && ` - ${selectedJobs[0].employer.name}`}
            </p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={generateCoverLetter}
          disabled={selectedJobs.length === 0 || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Genererar...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Generera Personligt Brev
            </>
          )}
        </Button>

        {/* Error */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Generated Cover Letter */}
        {coverLetter && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Genererat brev:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Kopierat!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Kopiera
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[300px] font-serif text-sm leading-relaxed"
              placeholder="Ditt personliga brev kommer att visas här..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
