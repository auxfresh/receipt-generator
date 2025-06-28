import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, Save, Upload, Plus, Trash2 } from 'lucide-react';
import { ShoppingReceiptPreview } from './shopping-receipt-preview';
import { ShoppingReceiptData } from '@/types/receipt';
import { saveReceipt } from '@/lib/firestore';
import { generatePDF } from '@/lib/pdf-generator';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const shoppingSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  currency: z.string().min(1, 'Currency is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
  orderDate: z.string().min(1, 'Order date is required'),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
  })).min(1, 'At least one item is required'),
  shippingCost: z.number().min(0, 'Shipping cost must be positive'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  status: z.string().min(1, 'Status is required'),
  supportEmail: z.string().email('Valid email is required'),
});

interface ShoppingReceiptFormProps {
  onBack: () => void;
}

export function ShoppingReceiptForm({ onBack }: ShoppingReceiptFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [loading, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<ShoppingReceiptData>({
    resolver: zodResolver(shoppingSchema),
    defaultValues: {
      storeName: '',
      currency: 'USD',
      orderNumber: '',
      orderDate: '',
      items: [{ name: '', quantity: 1, price: 0 }],
      shippingCost: 0,
      paymentMethod: '',
      status: 'paid',
      supportEmail: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
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
      await generatePDF('shopping-receipt-preview', 'shopping-receipt-preview.pdf');
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

  const onSubmit = async (data: ShoppingReceiptData) => {
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
      const title = `${data.storeName} Order`;
      await saveReceipt(user.uid, 'shopping', title, data, logoFile || undefined);
      
      toast({
        title: 'Success',
        description: 'Shopping receipt saved successfully!',
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
              <h1 className="text-xl font-bold text-gray-900">Shopping Receipt</h1>
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
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Logo
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

                  {/* Store Name */}
                  <FormField
                    control={form.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Fresh Cart" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Currency */}
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                            <SelectItem value="NGN">₦ Nigerian Naira (NGN)</SelectItem>
                            <SelectItem value="JPY">¥ Japanese Yen (JPY)</SelectItem>
                            <SelectItem value="CAD">$ Canadian Dollar (CAD)</SelectItem>
                            <SelectItem value="AUD">$ Australian Dollar (AUD)</SelectItem>
                            <SelectItem value="CHF">CHF Swiss Franc (CHF)</SelectItem>
                            <SelectItem value="CNY">¥ Chinese Yuan (CNY)</SelectItem>
                            <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Order Number */}
                  <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Number</FormLabel>
                        <FormControl>
                          <Input placeholder="#FC123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Order Date */}
                  <FormField
                    control={form.control}
                    name="orderDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Items */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">Items Purchased</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: '', quantity: 1, price: 0 })}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Item Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Wireless Headphones" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Quantity</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="1"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`items.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Price</FormLabel>
                                  <FormControl>
                                    <div className="flex">
                                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                                        ₦
                                      </span>
                                      <Input
                                        type="number"
                                        placeholder="12500"
                                        className="rounded-l-none"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="mt-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Remove
                            </Button>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Cost */}
                  <FormField
                    control={form.control}
                    name="shippingCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Cost</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">₦</span>
                            <Input
                              type="number"
                              placeholder="1500"
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

                  {/* Payment Method */}
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Input placeholder="Mastercard (**** 142) 1423" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Support Email */}
                  <FormField
                    control={form.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input placeholder="support@freshcart.com" {...field} />
                        </FormControl>
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
              <ShoppingReceiptPreview data={watchedData} logoUrl={logoUrl} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
