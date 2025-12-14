'use client';

import { User, Mail, Phone, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Contact {
  name?: string;
  description?: string;
  email?: string;
  telephone?: string;
}

interface ContactInfoProps {
  contacts: Contact[];
  employer?: {
    name: string;
    workplace?: string;
  };
}

export function ContactInfo({ contacts, employer }: ContactInfoProps) {
  if (!contacts || contacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Kontaktuppgifter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Inga kontaktuppgifter tillgängliga för detta jobb.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4" />
          Ansvarig Rekryterare
        </CardTitle>
        <CardDescription>
          Kontakta för frågor om tjänsten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {employer && (
          <div className="pb-3 border-b">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{employer.name}</span>
            </div>
          </div>
        )}

        {contacts.map((contact, index) => (
          <div key={index} className="space-y-2">
            {(contact.name || contact.description) && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium">
                  {contact.name || contact.description}
                </span>
              </div>
            )}

            {contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-primary hover:underline truncate"
                >
                  {contact.email}
                </a>
              </div>
            )}

            {contact.telephone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`tel:${contact.telephone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {contact.telephone}
                </a>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
