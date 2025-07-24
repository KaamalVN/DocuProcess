import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, User, Building } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

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
    validation_status?: string;
    anomaly?: boolean;
    anomaly_reason?: string;
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
      documentId: 'APL-2024-001',
      validation_status: 'Valid',
      anomaly: false,
      anomaly_reason: null
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
      documentId: 'RX-001923',
      validation_status: 'Valid',
      anomaly: false,
      anomaly_reason: null
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
      documentId: 'FOR-DS-2024-089',
      validation_status: 'Valid',
      anomaly: false,
      anomaly_reason: null
    }
  }
];

export const ProcessingHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("document_processing_history")
        .select("id, file_name, document_type, status, extracted_fields, processed_at")
        .eq("user_id", user.id)
        .order("processed_at", { ascending: false });
      if (!error && data) setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-12 text-muted-foreground">Sign in to view your processing history.</div>;
  }

  if (!history.length) {
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
        <Badge variant="secondary">{history.length} documents processed</Badge>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <Card key={record.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">{record.file_name}</h4>
                    <p className="text-sm text-muted-foreground">{record.document_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(record.status)} variant="secondary">
                    {record.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(record.processed_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium text-sm">Processing Result:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Validation:</span>
                    <span className="text-sm font-medium">{record.extracted_fields?.validation_status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Anomaly:</span>
                    <span className="text-sm font-medium">{record.extracted_fields?.anomaly ? "Yes" : "No"}</span>
                  </div>
                  {record.extracted_fields?.anomaly_reason && (
                    <div className="flex items-center gap-2 col-span-2">
                      <span className="text-xs text-muted-foreground">Reason:</span>
                      <span className="text-sm font-medium">{record.extracted_fields.anomaly_reason}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};