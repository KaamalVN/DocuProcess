import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, User, Building } from "lucide-react";

interface ProcessingRecord {
  id: string;
  fileName: string;
  documentType: string;
  processedAt: string;
  status: 'completed' | 'pending' | 'error';
  extractedFields: {
    patientName?: string;
    claimAmount?: string;
    dateOfService?: string;
    providerName?: string;
    documentId?: string;
  };
}

// Mock data for demonstration
const mockHistory: ProcessingRecord[] = [
  {
    id: '1',
    fileName: 'medical_bill_jan_2024.pdf',
    documentType: 'Medical Bill',
    processedAt: '2024-01-20T10:30:00Z',
    status: 'completed',
    extractedFields: {
      patientName: 'Rajesh Kumar',
      claimAmount: '₹25,000',
      dateOfService: '2024-01-15',
      providerName: 'Apollo Hospital',
      documentId: 'APL-2024-001'
    }
  },
  {
    id: '2',
    fileName: 'prescription_dr_sharma.jpg',
    documentType: 'Prescription',
    processedAt: '2024-01-19T14:45:00Z',
    status: 'completed',
    extractedFields: {
      patientName: 'Priya Patel',
      dateOfService: '2024-01-19',
      providerName: 'Dr. Amit Sharma',
      documentId: 'RX-001923'
    }
  },
  {
    id: '3',
    fileName: 'hospital_discharge_summary.pdf',
    documentType: 'Discharge Summary',
    processedAt: '2024-01-18T09:15:00Z',
    status: 'completed',
    extractedFields: {
      patientName: 'Vikram Singh',
      claimAmount: '₹45,000',
      dateOfService: '2024-01-10',
      providerName: 'Fortis Hospital',
      documentId: 'FOR-DS-2024-089'
    }
  }
];

export const ProcessingHistory = () => {
  const getStatusColor = (status: ProcessingRecord['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (mockHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No processing history yet</h3>
        <p className="text-muted-foreground">
          Upload some documents to see your processing history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Processing Activity</h3>
        <Badge variant="secondary">{mockHistory.length} documents processed</Badge>
      </div>

      <div className="space-y-4">
        {mockHistory.map((record) => (
          <Card key={record.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">{record.fileName}</h4>
                    <p className="text-sm text-muted-foreground">{record.documentType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(record.status)} variant="secondary">
                    {record.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(record.processedAt)}
                  </p>
                </div>
              </div>

              {record.status === 'completed' && record.extractedFields && (
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Extracted Information:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {record.extractedFields.patientName && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Patient</p>
                          <p className="text-sm font-medium">{record.extractedFields.patientName}</p>
                        </div>
                      </div>
                    )}
                    
                    {record.extractedFields.claimAmount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-sm font-medium">{record.extractedFields.claimAmount}</p>
                        </div>
                      </div>
                    )}
                    
                    {record.extractedFields.dateOfService && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Service Date</p>
                          <p className="text-sm font-medium">{record.extractedFields.dateOfService}</p>
                        </div>
                      </div>
                    )}
                    
                    {record.extractedFields.providerName && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Provider</p>
                          <p className="text-sm font-medium">{record.extractedFields.providerName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {record.extractedFields.documentId && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Document ID: <span className="font-mono">{record.extractedFields.documentId}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};