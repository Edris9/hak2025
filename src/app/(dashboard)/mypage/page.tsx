'use client';

import { useState } from 'react';
import { CVUpload, JobsList, CoverLetterGenerator } from '@/presentation/components/lemowork';

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

export default function MyPage() {
  const [selectedJobsForCoverLetter, setSelectedJobsForCoverLetter] = useState<Job[]>([]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-600">LEMOWork</h1>
        <p className="text-muted-foreground mt-2">Välkommen till min sida!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CVUpload />
          <CoverLetterGenerator selectedJobs={selectedJobsForCoverLetter} />
        </div>
        <JobsList onJobSelectionChange={setSelectedJobsForCoverLetter} />
      </div>
    </div>
  );
}