import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { DocumentUpload } from "./DocumentUpload";
import { ProcessingHistory } from "./ProcessingHistory";
import { FileText, Upload, History, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg lg:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DocuProcess
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Document Processing Hub</h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Upload and process your insurance documents with AI-powered OCR and field extraction
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 lg:mb-8">
          <Button
            variant={activeTab === 'upload' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2 justify-center sm:justify-start"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm lg:text-base">Upload Documents</span>
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-2 justify-center sm:justify-start"
          >
            <History className="w-4 h-4" />
            <span className="text-sm lg:text-base">Processing History</span>
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'upload' && (
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Insurance Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload />
              </CardContent>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Processing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProcessingHistory />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};