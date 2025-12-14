'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building2, Clock, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Job {
  id: string;
  headline: string;
  employer?: {
    name: string;
  };
  workplace_address?: {
    municipality: string;
    region: string;
  };
  publication_date?: string;
  application_deadline?: string;
  webpage_url?: string;
}

interface JobsResponse {
  success: boolean;
  data?: {
    hits: Job[];
    total: {
      value: number;
    };
  };
  error?: string;
}

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [total, setTotal] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (municipality) params.append('municipality', municipality);
      params.append('limit', '20');

      const response = await fetch(`/api/jobb?${params.toString()}`);
      const result: JobsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch jobs');
      }

      if (result.data?.hits) {
        setJobs(result.data.hits);
        setTotal(result.data.total?.value || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Lediga Jobb
        </CardTitle>
        <CardDescription>
          Sök bland {total.toLocaleString('sv-SE')} lediga jobb från Arbetsförmedlingen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Sök jobb (t.ex. developer, lärare)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Kommun (t.ex. Stockholm)"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="w-48"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Jobs List */}
        {!loading && jobs.length > 0 && (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card key={job.id} className="border-l-4 border-l-primary/30 hover:border-l-primary transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-2">
                      {job.headline}
                    </h3>

                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      {job.employer?.name && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{job.employer.name}</span>
                        </div>
                      )}

                      {job.workplace_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {job.workplace_address.municipality}
                            {job.workplace_address.region && `, ${job.workplace_address.region}`}
                          </span>
                        </div>
                      )}

                      {job.application_deadline && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Sista ansökningsdag: {new Date(job.application_deadline).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                      )}
                    </div>

                    {job.webpage_url && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <a
                            href={job.webpage_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Läs mer och ansök
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Inga jobb hittades. Prova en annan sökning.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
