'use client';

import { useState, useEffect } from 'react';
import { CVUpload, JobsList, CoverLetterGenerator, ContactInfo } from '@/presentation/components/lemowork';

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

interface Contact {
  name?: string;
  description?: string;
  email?: string;
  telephone?: string;
}

export default function MyPage() {
  const [selectedJobsForCoverLetter, setSelectedJobsForCoverLetter] = useState<Job[]>([]);
  const [jobContacts, setJobContacts] = useState<Contact[]>([]);
  const [jobEmployer, setJobEmployer] = useState<{ name: string; workplace?: string } | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // CV Upload state
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [applicantInfo, setApplicantInfo] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  // Fetch job details when a job is selected
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (selectedJobsForCoverLetter.length === 0) {
        setJobContacts([]);
        setJobEmployer(null);
        return;
      }

      setLoadingContacts(true);
      try {
        const jobId = selectedJobsForCoverLetter[0].id;
        const response = await fetch(`/api/jobb/${jobId}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Extract contact information
          const contacts = result.data.application_contacts || [];
          setJobContacts(contacts);

          // Extract employer information
          if (result.data.employer) {
            setJobEmployer({
              name: result.data.employer.name,
              workplace: result.data.employer.workplace,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setJobContacts([]);
        setJobEmployer(null);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchJobDetails();
  }, [selectedJobsForCoverLetter]);

  // Get recipient email from contacts
  const recipientEmail = jobContacts.length > 0 ? jobContacts[0].email || null : null;
  const recipientName = jobContacts.length > 0 ? (jobContacts[0].name || jobContacts[0].description || null) : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-600">LEMOWork</h1>
        <p className="text-muted-foreground mt-2">Välkommen till min sida!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CVUpload
            onFileUpload={setCvFileName}
            onInfoConfirm={setApplicantInfo}
          />
          {selectedJobsForCoverLetter.length > 0 && (
            <ContactInfo
              contacts={jobContacts}
              employer={jobEmployer || undefined}
            />
          )}
          <CoverLetterGenerator
            selectedJobs={selectedJobsForCoverLetter}
            cvFileName={cvFileName}
            applicantInfo={applicantInfo}
            recipientEmail={recipientEmail}
            recipientName={recipientName}
          />
        </div>
        <JobsList onJobSelectionChange={setSelectedJobsForCoverLetter} />
      </div>
    </div>
  );
}