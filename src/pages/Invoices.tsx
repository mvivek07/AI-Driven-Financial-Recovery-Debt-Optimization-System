import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  date: string;
  due_date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [formData, setFormData] = useState({
    invoice_number: '',
    client_name: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    amount: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue'
  });

  useEffect(() => {
    if (user) {
      fetchInvoices();
      
      const channel = supabase
        .channel('invoices-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user.id}` },
          () => fetchInvoices()
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchInvoices = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch invoices');
    } else {
      setInvoices((data as Invoice[]) || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase.from('invoices').insert({
      user_id: user.id,
      invoice_number: formData.invoice_number,
      client_name: formData.client_name,
      date: formData.date,
      due_date: formData.due_date,
      amount: parseFloat(formData.amount),
      status: formData.status
    }).select('*').single();

    if (error) {
      toast.error('Failed to add invoice');
    } else {
      toast.success('Invoice added successfully');
      if (data) {
        setInvoices((prev) => [{
          id: data.id,
          invoice_number: data.invoice_number,
          client_name: data.client_name,
          date: data.date,
          due_date: data.due_date,
          amount: data.amount,
          status: data.status,
        }, ...prev]);
      }
      setFormData({
        invoice_number: '',
        client_name: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        amount: '',
        status: 'pending'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete invoice');
    } else {
      toast.success('Invoice deleted');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      paid: "default",
      overdue: "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Add Invoice</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{invoice.invoice_number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.client_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold">${invoice.amount.toFixed(2)}</p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No invoices yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invoices;
