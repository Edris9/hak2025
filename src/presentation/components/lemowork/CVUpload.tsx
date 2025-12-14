'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle2, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as pdfjsLib from 'pdfjs-dist';

interface ExtractedInfo {
  name: string;
  phone: string;
  email: string;
}

export function CVUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [editableInfo, setEditableInfo] = useState<ExtractedInfo | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set up the worker for pdfjs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use local worker file for better reliability
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }
  }, []);

  const extractInfoFromText = (text: string): ExtractedInfo => {
    // Extract email (standard email pattern)
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : '';

    // Extract phone number (various formats: +46, 070-xxx-xx-xx, 070 xxx xx xx, etc.)
    const phoneRegex = /(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?(\d{1,4}[\s-]?){2,}\d{1,9}/g;
    const phoneMatches = text.match(phoneRegex);
    // Filter out dates and other number sequences, prioritize phone-like patterns
    const phone = phoneMatches 
      ? phoneMatches
          .filter(p => {
            // Filter out dates (YYYY-MM-DD, DD/MM/YYYY, etc.)
            if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(p)) return false;
            // Filter out very short numbers
            if (p.replace(/\D/g, '').length < 7) return false;
            // Prefer numbers with + or starting with 0
            return true;
          })
          .sort((a, b) => {
            // Prioritize numbers with country code or starting with 0
            const aHasPlus = a.includes('+');
            const bHasPlus = b.includes('+');
            if (aHasPlus && !bHasPlus) return -1;
            if (!aHasPlus && bHasPlus) return 1;
            if (a.startsWith('0') && !b.startsWith('0')) return -1;
            if (!a.startsWith('0') && b.startsWith('0')) return 1;
            return 0;
          })[0] || ''
      : '';

    // Extract name (usually the first line or largest text at the top)
    // Get first few lines and try to identify the name
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let name = '';
    
    // Try to find name in first few lines (usually name is at the top)
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      // Skip if it's an email or phone
      if (emailRegex.test(line) || phoneRegex.test(line)) continue;
      // Skip if it's too long (likely not a name)
      if (line.length > 50) continue;
      // Skip common CV headers
      if (/^(CV|Resume|Curriculum Vitae|Contact|Personal|Professional)/i.test(line)) continue;
      // If it looks like a name (2-4 words, mostly letters)
      if (/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(line) && line.split(/\s+/).length >= 2 && line.split(/\s+/).length <= 4) {
        name = line;
        break;
      }
    }
    
    // If no name found, use first non-empty line that's not email/phone
    if (!name && lines.length > 0) {
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !emailRegex.test(trimmed) && !phoneRegex.test(trimmed) && trimmed.length < 100) {
          name = trimmed;
          break;
        }
      }
    }

    return {
      name: name || 'Not found',
      phone: phone || 'Not found',
      email: email || 'Not found',
    };
  };

  const extractTextFromPDF = async (file: File) => {
    setIsExtracting(true);
    try {
      // Ensure worker is set up
      if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';
      const textItems: Array<{ text: string; fontSize: number; y: number }> = [];

      // Extract text from first page with position info to find name
      const firstPage = await pdf.getPage(1);
      const textContent = await firstPage.getTextContent();
      
      // Collect text items with their font sizes and positions
      textContent.items.forEach((item: any) => {
        if (item.str) {
          fullText += item.str + ' ';
          if (item.transform) {
            textItems.push({
              text: item.str,
              fontSize: item.transform[0] || 12,
              y: item.transform[5] || 0,
            });
          }
        }
      });

      // Extract text from remaining pages (for phone/email search)
      for (let i = 2; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const pageTextContent = await page.getTextContent();
        const pageText = pageTextContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + ' ';
      }

      // Extract structured information
      const info = extractInfoFromText(fullText);
      setExtractedInfo(info);
      setEditableInfo(info);
      setIsConfirmed(false);
    } catch (error: any) {
      console.error('Error extracting text from PDF:', error);
      setExtractedInfo({
        name: 'Error extracting information',
        phone: '',
        email: '',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate PDF file
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        return;
      }
      setSelectedFile(file);
      setUploadSuccess(false);
      setExtractedInfo(null);
      setEditableInfo(null);
      setIsConfirmed(false);
      // Extract text from PDF
      await extractTextFromPDF(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Here you would typically upload to your backend
      // For now, we'll simulate an upload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setUploadSuccess(true);
      // Optionally clear the file after successful upload
      // setSelectedFile(null);
      // if (fileInputRef.current) {
      //   fileInputRef.current.value = '';
      // }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setExtractedInfo(null);
    setEditableInfo(null);
    setIsConfirmed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInfoChange = (field: keyof ExtractedInfo, value: string) => {
    if (editableInfo) {
      setEditableInfo({
        ...editableInfo,
        [field]: value,
      });
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    if (editableInfo) {
      setExtractedInfo(editableInfo);
      setIsConfirmed(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload CV
        </CardTitle>
        <CardDescription>
          Upload your CV as a PDF file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cv-upload">CV File (PDF)</Label>
          <Input
            id="cv-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="cursor-pointer"
            disabled={isUploading}
          />
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg border">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            {!isUploading && !uploadSuccess && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleRemove}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {uploadSuccess && (
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            )}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 animate-pulse" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload CV
            </>
          )}
        </Button>

        {uploadSuccess && (
          <p className="text-sm text-green-600 dark:text-green-400 text-center">
            CV uploaded successfully!
          </p>
        )}

        {isExtracting && (
          <p className="text-sm text-muted-foreground text-center">
            Extracting information from PDF...
          </p>
        )}

        {editableInfo && (
          <div className="mt-4 p-4 bg-accent rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Contact Information:</h3>
              {isConfirmed && (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Confirmed</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name-field" className="text-xs flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  Name
                </Label>
                <Input
                  id="name-field"
                  value={editableInfo.name}
                  onChange={(e) => handleInfoChange('name', e.target.value)}
                  placeholder="Enter name"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone-field" className="text-xs flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  Phone
                </Label>
                <Input
                  id="phone-field"
                  value={editableInfo.phone}
                  onChange={(e) => handleInfoChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email-field" className="text-xs flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  Email
                </Label>
                <Input
                  id="email-field"
                  type="email"
                  value={editableInfo.email}
                  onChange={(e) => handleInfoChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="text-sm"
                />
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              className="w-full"
              variant={isConfirmed ? "outline" : "default"}
            >
              {isConfirmed ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Information Confirmed
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Information
                </>
              )}
            </Button>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                These will be used as keywords for job applications
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

