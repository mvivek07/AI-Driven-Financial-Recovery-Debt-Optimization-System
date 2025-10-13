import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart3, FileText, TrendingUp, Briefcase, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <BarChart3 className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">RelentlessAI</h1>
              <p className="text-xs text-muted-foreground">SME Financial Platform</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Financial Management Made Simple
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Manage your SME finances with real-time dashboards, AI insights, and Excel-like data management. 
          Everything you need in one powerful platform.
        </p>
        <Button size="lg" onClick={() => navigate('/signup')}>
          Start Free Trial
        </Button>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground">
            Everything your business needs to manage finances effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Dashboard</h3>
              <p className="text-muted-foreground">
                Monitor your business metrics with live KPIs, charts, and financial insights in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Invoice Management</h3>
              <p className="text-muted-foreground">
                Track, manage, and organize all your invoices with payment status and due date tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transaction Tracking</h3>
              <p className="text-muted-foreground">
                Excel-like interface for managing all financial transactions with instant updates.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">VCFO AI Assistant</h3>
              <p className="text-muted-foreground">
                AI-powered financial insights and recommendations tailored to your business needs.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Data Storage</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with PostgreSQL backend ensuring your data is always protected.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Sync</h3>
              <p className="text-muted-foreground">
                All changes sync instantly across devices and dashboards for seamless collaboration.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Financial Management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of SMEs using RelentlessAI to streamline their finances
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 RelentlessAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
