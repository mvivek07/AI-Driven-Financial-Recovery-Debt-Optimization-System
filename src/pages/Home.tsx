import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Brain, LineChart, Shield, Zap, Mail } from "lucide-react";
import { motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

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
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/10 via-transparent to-primary/5" />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
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
          <a href="#contact" className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-md bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow hover:opacity-90 transition">
            <Mail className="h-5 w-5 mr-2" /> Contact Us
          </a>
        </motion.div>

        {/* Main Goal Section */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
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
        </motion.div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features & Functionality</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <Card className="hover:shadow-lg transition-all hover:border-primary/50">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 mb-4 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
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

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: "Datasets analyzed", value: "25k+" },
            { label: "Avg. ROI uplift", value: "18%" },
            { label: "Decision time cut", value: "-42%" },
            { label: "Dashboards shipped", value: "1.2k+" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border bg-card p-6 text-center"
            >
              <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* How it Works */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Upload your CSV",
                desc: "Bring sales, marketing, or P&L data. We validate columns and profile quality.",
              },
              {
                title: "Explore & analyze",
                desc: "Interactive dashboards and AI chat extract insights with full transparency.",
              },
              {
                title: "Decide & act",
                desc: "Get forecasts, what‑if scenarios, and export reports for your team.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="h-full border-2 border-primary/10 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Loved by Finance Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "We cut our reporting time from days to hours and finally agree on the numbers.",
                name: "Ops Lead, Retail",
              },
              {
                quote:
                  "The AI chat cites the exact columns used. Trust skyrocketed across teams.",
                name: "Head of Analytics, D2C",
              },
              {
                quote:
                  "Forecasts + what‑ifs helped us plan budgets confidently for the next two quarters.",
                name: "CFO, SaaS",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <p className="italic">“{t.quote}”</p>
                    <p className="mt-4 text-sm text-muted-foreground">{t.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        

        {/* Final CTA */}
        <div className="mt-16">
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardContent className="relative p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-600/10 to-primary/10 pointer-events-none" />
              <div className="relative text-center">
                <h3 className="text-2xl font-bold mb-2">Start transforming your finances today</h3>
                <p className="text-muted-foreground mb-4">Upload a CSV and get insights in minutes—no setup required.</p>
                <a href="/upload" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow hover:opacity-90 transition">
                  Get Started
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <section id="contact" className="mt-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
              <p className="text-muted-foreground">Fill in the details below and we will reach out.</p>
            </div>
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-blue-600/5">
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
