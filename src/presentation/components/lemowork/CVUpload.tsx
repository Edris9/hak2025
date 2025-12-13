'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CVUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate PDF file
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        return;
      }
      setSelectedFile(file);
      setUploadSuccess(false);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      </CardContent>
    </Card>
  );
}

