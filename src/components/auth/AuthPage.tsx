import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./AuthContext";
import { Shield, FileText, Brain, Users } from "lucide-react";

export const AuthPage = () => {
  const { signInWithGoogle, loading } = useAuth();

  const features = [
    {
      icon: FileText,
      title: "Smart OCR",
      description: "Extract text from handwritten prescriptions and medical documents"
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Intelligent field extraction and document classification"
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Bank-grade security for your sensitive insurance documents"
    },
    {
      icon: Users,
      title: "Team Ready",
      description: "Collaborate with claims processors and insurance agents"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary flex flex-col lg:flex-row">
      {/* Mobile-first layout: stack vertically, then side-by-side on lg+ */}
      <div className="w-full flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center lg:justify-center lg:px-8 lg:py-12">
        {/* Left side - Branding and features */}
        <div className="space-y-6 lg:space-y-8 text-center lg:text-left p-6 lg:p-8">
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DocuProcess
              </h1>
            </div>
            <p className="text-lg lg:text-xl text-muted-foreground">
              AI-powered insurance document processing for the digital age
            </p>
            <p className="text-sm lg:text-base text-muted-foreground max-w-md mx-auto lg:mx-0">
              Transform your insurance workflow with intelligent OCR, document classification, 
              and automated field extraction for Indian insurance documents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2 lg:gap-3 p-3 lg:p-4 rounded-lg bg-background/50 shadow-soft">
                <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-xs lg:text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Auth card */}
        <div className="flex justify-center p-6 lg:p-8">
          <Card className="w-full max-w-md shadow-medium border-0">
            <CardHeader className="text-center space-y-2 pb-4">
              <CardTitle className="text-xl lg:text-2xl">Welcome to DocuProcess</CardTitle>
              <CardDescription className="text-sm">
                Sign in with Google to access your secure document processing dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button
                  variant="google"
                  size="lg"
                  className="w-full h-11 lg:h-12"
                  onClick={signInWithGoogle}
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                  Your documents are processed securely and never stored permanently.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};