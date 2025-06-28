import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, Save, Upload } from 'lucide-react';
import { BankingReceiptPreview } from './banking-receipt-preview';
import { BankingReceiptData } from '@/types/receipt';
import { saveReceipt } from '@/lib/firestore';
import { generatePDF } from '@/lib/pdf-generator';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const bankingSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  transactionAmount: z.number().min(0, 'Amount must be positive'),
  beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
  senderName: z.string().min(1, 'Sender name is required'),
  paidOn: z.string().min(1, 'Payment date is required'),
  fees: z.number().min(0, 'Fees must be positive'),
  description: z.string().min(1, 'Description is required'),
  transactionRef: z.string().min(1, 'Transaction reference is required'),
  paymentType: z.string().min(1, 'Payment type is required'),
});

interface BankingReceiptFormProps {
  onBack: () => void;
}

export function BankingReceiptForm({ onBack }: BankingReceiptFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [loading, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<BankingReceiptData>({
    resolver: zodResolver(bankingSchema),
    defaultValues: {
      companyName: '',
      transactionAmount: 0,
      beneficiaryName: '',
      senderName: '',
      paidOn: '',
      fees: 0,
      description: '',
      transactionRef: '',
      paymentType: '',
    },
  });

  const watchedData = form.watch();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handlePreview = async () => {
    try {
      await generatePDF('banking-receipt-preview', 'banking-receipt-preview.pdf');
      toast({
        title: 'Success',
        description: 'Preview downloaded successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate preview. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: BankingReceiptData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save receipts.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const title = `Transaction to ${data.beneficiaryName}`;
      await saveReceipt(user.uid, 'banking', title, data, logoFile || undefined);
      
      toast({
        title: 'Success',
        description: 'Banking receipt saved successfully!',
      });
      
      setLocation('/dashboard');
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to save receipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Banking Transaction Receipt</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Receipt'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload logo</p>
                      </label>
                    </div>
                  </div>

                  {/* Company Name */}
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Transaction Amount */}
                  <FormField
                    control={form.control}
                    name="transactionAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">₦</span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Beneficiary Details */}
                  <FormField
                    control={form.control}
                    name="beneficiaryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Beneficiary name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sender Details */}
                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Sender name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="paidOn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paid On</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fees */}
                  <FormField
                    control={form.control}
                    name="fees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fees</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">₦</span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Transaction description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Transaction Reference */}
                  <FormField
                    control={form.control}
                    name="transactionRef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="TXN123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Type */}
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="transfer">Bank Transfer</SelectItem>
                            <SelectItem value="card">Card Payment</SelectItem>
                            <SelectItem value="wallet">Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <BankingReceiptPreview data={watchedData} logoUrl={logoUrl} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
