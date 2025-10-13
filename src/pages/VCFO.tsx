import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Send, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const VCFO = () => {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FLASK_API_URL = "http://localhost:5000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(`${FLASK_API_URL}/`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        setUploadedFile(file.name);
        toast.success("File uploaded successfully!");
        setMessages(prev => [...prev, {
          role: "system",
          content: `📁 File "${file.name}" uploaded successfully. You can now ask questions about your data.`
        }]);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file. Make sure Flask server is running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${FLASK_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `❌ Error: ${data.error}` 
        }]);
      } else {
        // Remove HTML tags for display
        const cleanContent = data.response.replace(/<[^>]*>/g, '');
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: cleanContent 
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Error connecting to Flask server. Make sure it's running on port 5000");
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "❌ Connection error. Please ensure the Flask server is running." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">VCFO AI Assistant</h1>
        <p className="text-muted-foreground">AI-powered financial insights and recommendations</p>
      </div>

      {/* File Upload Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Financial Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button 
              onClick={handleFileUpload} 
              disabled={!file || loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          {uploadedFile && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Currently analyzing: {uploadedFile}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Chat with Virtual CFO
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p>Upload a CSV file and start asking questions about your financial data.</p>
                <p className="text-sm mt-2">Example: "What are my top performing products?"</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : msg.role === "system"
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your financial data..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VCFO;