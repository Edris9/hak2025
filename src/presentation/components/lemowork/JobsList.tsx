'use client';

import { useState, useEffect, useMemo } from 'react';
import { Briefcase, MapPin, Building2, Clock, Search, Loader2, Filter, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
  employment_type?: string;
  remote?: boolean;
  description?: {
    text?: string;
  };
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

interface JobsListProps {
  onJobSelectionChange?: (selectedJobs: Job[]) => void;
}

// Swedish regions (Län) and their municipalities (Orter)
const SWEDISH_REGIONS: Record<string, string[]> = {
  'Stockholms Län': ['Stockholm', 'Västerås', 'Uppsala'],
  'Västra Götalands Län': ['Göteborg', 'Borås', 'Trollhättan'],
  'Skåne Län': ['Malmö', 'Lund', 'Helsingborg'],
  'Östergötlands Län': ['Linköping', 'Norrköping', 'Motala'],
  'Jämtlands Län': ['Östersund', 'Åre'],
  'Västmanlands Län': ['Västerås', 'Västra'],
  'Dalarna Län': ['Falun', 'Borlänge'],
  'Gävleborgs Län': ['Gävle', 'Sandviken'],
  'Västernorrlands Län': ['Sundsvall', 'Örnsköldsvik'],
  'Norrbottens Län': ['Luleå', 'Kiruna'],
  'Södermanlands Län': ['Nyköping', 'Västervik'],
  'Örebro Län': ['Örebro', 'Västerhamn'],
  'Värmlands Län': ['Karlstad', 'Arvika'],
  'Hallands Län': ['Halmstad', 'Falkenberg'],
  'Blekinge Län': ['Karlskrona', 'Ronneby'],
  'Kalmar Län': ['Kalmar', 'Växjö'],
  'Gotlands Län': ['Visby'],
};

export function JobsList({ onJobSelectionChange }: JobsListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [total, setTotal] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Selected job for cover letter (only one job can be selected)
  const [selectedJobForCoverLetter, setSelectedJobForCoverLetter] = useState<string | null>(null);

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

  // Popular IT/Programming job titles
  const ITJobTitles = [
    'Utvecklare',
    'Programmerare',
    'Webbutvecklare',
    'Frontendutvecklare',
    'Backendutvecklare',
    'Full Stack Developer',
    'Java Developer',
    'C# Developer',
    'Python Developer',
    'JavaScript Developer',
    'React Developer',
    'Vue Developer',
    'Angular Developer',
    'DevOps Engineer',
    'System Architect',
    'IT Konsult',
    'IT Support',
    'IT Specialist',
    'Data Engineer',
    'Data Scientist',
  ];

  // Get popular job titles from current jobs
  const popularJobTitles = useMemo(() => {
    const titles = jobs.map((job) => {
      const headline = job.headline;
      const firstPart = headline.split(' - ')[0];
      return firstPart.trim();
    });
    const countMap: Record<string, number> = {};
    titles.forEach((title) => {
      countMap[title] = (countMap[title] || 0) + 1;
    });
    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title]) => title)
      .concat(
        ITJobTitles.filter(
          (job) => !Object.keys(countMap).includes(job)
        )
      );
  }, [jobs]);

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (selectedMunicipalities.length > 0) {
        if (
          !selectedMunicipalities.includes(
            job.workplace_address?.municipality || ''
          )
        ) {
          return false;
        }
      }

      if (selectedJobs.length > 0) {
        const jobTitle = job.headline.split(' - ')[0].trim();
        if (!selectedJobs.includes(jobTitle)) {
          return false;
        }
      }

      return true;
    });
  }, [
    jobs,
    selectedMunicipalities,
    selectedJobs,
  ]);

  const handleClearFilters = () => {
    setSelectedRegion('');
    setSelectedMunicipalities([]);
    setSelectedJobs([]);
  };

  const hasActiveFilters =
    selectedRegion ||
    selectedMunicipalities.length > 0 ||
    selectedJobs.length > 0;

  // Handle job selection for cover letter (only one job)
  const handleJobSelect = (job: Job) => {
    const newSelection = selectedJobForCoverLetter === job.id ? null : job.id;
    setSelectedJobForCoverLetter(newSelection);

    // Notify parent component
    if (onJobSelectionChange) {
      const selectedJobObjects = newSelection ? [job] : [];
      onJobSelectionChange(selectedJobObjects);
    }
  };

  return (
    <>
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
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Sök</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilter(true)}
              >
                <Filter className="h-4 w-4" />
                <span className="ml-2">Filter</span>
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
          {!loading && filteredJobs.length > 0 && (
            <>
              {selectedJobForCoverLetter && (
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium">
                    1 jobb valt för personligt brev
                  </p>
                </div>
              )}
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      onClick={() => handleJobSelect(job)}
                      className={`border-l-4 transition-colors cursor-pointer ${
                        selectedJobForCoverLetter === job.id
                          ? 'border-l-primary bg-primary/5'
                          : 'border-l-primary/30 hover:border-l-primary'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="mt-1">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedJobForCoverLetter === job.id
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                              }`}
                            >
                              {selectedJobForCoverLetter === job.id && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base line-clamp-2">
                              {job.headline}
                            </h3>
                          </div>
                        </div>

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
                              {job.workplace_address.region &&
                                `, ${job.workplace_address.region}`}
                            </span>
                          </div>
                        )}

                        {job.application_deadline && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>
                              Sista ansökningsdag:{' '}
                              {new Date(
                                job.application_deadline
                              ).toLocaleDateString('sv-SE')}
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
            </>
          )}

          {/* Empty State */}
          {!loading && filteredJobs.length === 0 && !error && (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Inga jobb hittades. Prova en annan sökning.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Panel */}
      <Sheet open={showFilter} onOpenChange={setShowFilter}>
        <SheetContent className="w-full sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Filter
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-auto p-0 text-xs"
                >
                  <X className="h-4 w-4 mr-1" />
                  Rensa
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-8 mt-8">
            {/* Ort (Län & Orter) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <Label htmlFor="region-select" className="text-lg font-bold">
                  Sökort
                </Label>
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region-select">
                  <SelectValue placeholder="Välj Län..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(SWEDISH_REGIONS).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRegion && (
                <div className="space-y-3 mt-4 pl-2">
                  <Label className="text-xs text-muted-foreground">
                    Orter i {selectedRegion}
                  </Label>
                  <div className="space-y-3">
                    {SWEDISH_REGIONS[selectedRegion].map((municipality) => (
                      <div key={municipality} className="flex items-center space-x-3">
                        <Checkbox
                          id={`municipality-${municipality}`}
                          checked={selectedMunicipalities.includes(municipality)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              setSelectedMunicipalities([
                                ...selectedMunicipalities,
                                municipality,
                              ]);
                            } else {
                              setSelectedMunicipalities(
                                selectedMunicipalities.filter(
                                  (m) => m !== municipality
                                )
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`municipality-${municipality}`}
                          className="font-normal cursor-pointer text-sm"
                        >
                          {municipality}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Yrke */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <Label className="text-lg font-bold">Yrkesroll</Label>
              </div>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {popularJobTitles.length > 0 ? (
                  popularJobTitles.map((job) => (
                    <div key={job} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={`job-${job}`}
                        checked={selectedJobs.includes(job)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setSelectedJobs([...selectedJobs, job]);
                          } else {
                            setSelectedJobs(
                              selectedJobs.filter((j) => j !== job)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`job-${job}`}
                        className="font-normal cursor-pointer text-sm flex-1"
                      >
                        {job}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      Sök först för att se tillgängliga yrkesroller
                    </p>
                    <p className="text-xs text-muted-foreground">
                      T.ex. "utvecklare", "programmerare", "IT"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
