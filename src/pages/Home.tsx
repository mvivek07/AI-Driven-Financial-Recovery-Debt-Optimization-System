import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Brain, LineChart, Shield, Zap } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Financial Model Forecasting",
      description: "Advanced predictive analytics to forecast your business financial performance with accuracy and confidence.",
    },
    {
      icon: Brain,
      title: "Virtual CFO AI",
      description: "AI-powered financial advisory providing strategic insights and recommendations for your business decisions.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Data Insights",
      description: "Live dashboard with instant updates on transactions, invoices, and loans for complete financial visibility.",
    },
    {
      icon: LineChart,
      title: "Advanced Analytics",
      description: "Deep dive into your financial data with comprehensive charts, trends, and performance metrics.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security ensuring your financial data is protected with industry-standard encryption.",
    },
    {
      icon: Zap,
      title: "Automated Processing",
      description: "Streamline your financial workflows with automated data processing and intelligent categorization.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          RelentlessAI
        </h1>
        <p className="text-2xl text-muted-foreground mb-4">
          Your Intelligent Financial Management Platform
        </p>
        <p className="text-lg text-muted-foreground">
          Empowering SMEs with AI-driven financial insights, real-time analytics, and predictive forecasting 
          to make informed business decisions with confidence.
        </p>
      </div>

      {/* Main Goal Section */}
      <Card className="mb-12 border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              RelentlessAI transforms complex financial data into actionable insights. We combine advanced 
              machine learning with intuitive design to provide SMEs with enterprise-level financial intelligence, 
              helping businesses optimize operations, predict trends, and achieve sustainable growth.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features & Functionality</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:border-primary/50">
              <CardHeader>
                <feature.icon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What We Do Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-blue-600/5">
        <CardContent className="pt-8 pb-8">
          <h2 className="text-3xl font-bold text-center mb-6">What RelentlessAI Does</h2>
          <div className="max-w-4xl mx-auto space-y-4 text-lg">
            <div className="flex gap-4 items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Financial Forecasting:</span> Leverage machine learning models 
                to predict revenue, expenses, and cash flow with high accuracy.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Comprehensive Analysis:</span> Upload CSV data and instantly 
                generate detailed financial reports with visual analytics.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Real-time Monitoring:</span> Track transactions, invoices, 
                and loans with live updates and instant notifications.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Virtual CFO Assistance:</span> Get AI-powered financial advice 
                tailored to your business needs and industry trends.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
