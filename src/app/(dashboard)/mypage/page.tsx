'use client';

import { CVUpload, JobsList } from '@/presentation/components/lemowork';

export default function MyPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">LEMOWork</h1>
        <p className="text-muted-foreground mt-2">Välkommen till min sida!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CVUpload />
        <JobsList />
      </div>
    </div>
  )
}