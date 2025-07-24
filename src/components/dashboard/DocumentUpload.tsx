import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import dummyProcessingResults from "@/lib/dummyProcessingResults.json";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedData?: any;
}

export const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.includes('image/') || file.type.includes('pdf');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format. Please upload images or PDFs.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    const uploadFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
    
    // Simulate processing for demo
    uploadFiles.forEach(uploadFile => {
      simulateProcessing(uploadFile.id);
    });
  };

  const simulateProcessing = async (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing' } : f
    ));

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: i } : f
      ));
    }

    // Pick a random dummy result
    const dummy = dummyProcessingResults[Math.floor(Math.random() * dummyProcessingResults.length)];

    setFiles(prev => prev.map(f => 
      f.id === fileId ? { 
        ...f, 
        status: dummy.status === 'error' ? 'error' : 'completed',
        progress: 100,
        extractedData: dummy
      } : f
    ));

    // Store in Supabase (if user is logged in)
    if (user) {
      await supabase.from('document_processing_history').insert({
        user_id: user.id,
        document_type: dummy.document_type,
        status: dummy.status,
        extracted_fields: null, // not storing sensitive data
        file_name: '', // not storing file name
        non_sensitive_metadata: dummy.non_sensitive_metadata,
      });
    }

    toast({
      title: dummy.status === 'error' ? "Document processing failed" : "Document processed successfully",
      description: dummy.status === 'error' ? "There was an error processing your document." : "OCR extraction and field detection completed.",
    });
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('image/')) return FileImage;
    if (file.type.includes('pdf')) return FileText;
    return FileText;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'error': return AlertCircle;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Upload Insurance Documents</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files here, or click to select files
            </p>
            <p className="text-sm text-muted-foreground">
              Supports: Images (JPG, PNG, WEBP) and PDF files up to 10MB
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="premium" className="relative">
              <Upload className="w-4 h-4 mr-2" />
              Select Files
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Uploaded Documents</h4>
          <div className="space-y-3">
            {files.map((uploadFile) => {
              const FileIcon = getFileIcon(uploadFile.file);
              const StatusIcon = getStatusIcon(uploadFile.status);
              
              return (
                <Card key={uploadFile.id} className="shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium truncate">{uploadFile.file.name}</h5>
                          <div className="flex items-center gap-2">
                            {StatusIcon && (
                              <StatusIcon className={`w-4 h-4 ${
                                uploadFile.status === 'completed' ? 'text-green-500' : 'text-red-500'
                              }`} />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(uploadFile.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span className="capitalize">{uploadFile.status}</span>
                        </div>
                        
                        {uploadFile.status === 'processing' && (
                          <Progress value={uploadFile.progress} className="mt-2" />
                        )}
                        
                        {uploadFile.status === 'completed' && uploadFile.extractedData && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <h6 className="font-medium mb-2">Processing Result:</h6>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <span className="ml-2 font-medium">{uploadFile.extractedData.document_type}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <span className="ml-2 font-medium">{uploadFile.extractedData.status}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Validation:</span>
                                <span className="ml-2 font-medium">{uploadFile.extractedData.non_sensitive_metadata.validation_status}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Anomaly:</span>
                                <span className="ml-2 font-medium">{uploadFile.extractedData.non_sensitive_metadata.anomaly ? 'Yes' : 'No'}</span>
                              </div>
                              {uploadFile.extractedData.non_sensitive_metadata.anomaly_reason && (
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Reason:</span>
                                  <span className="ml-2 font-medium">{uploadFile.extractedData.non_sensitive_metadata.anomaly_reason}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};