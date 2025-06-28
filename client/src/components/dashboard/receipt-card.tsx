import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { University, ShoppingCart, Download, Trash2 } from 'lucide-react';
import { Receipt } from '@/types/receipt';
import { generatePDF } from '@/lib/pdf-generator';
import { deleteReceipt } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

interface ReceiptCardProps {
  receipt: Receipt;
  onDelete: () => void;
}

export function ReceiptCard({ receipt, onDelete }: ReceiptCardProps) {
  const { toast } = useToast();

  const formatAmount = (data: any) => {
    if (receipt.type === 'banking') {
      return `₦${data.transactionAmount?.toLocaleString() || 0}`;
    } else {
      const subtotal = data.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
      const total = subtotal + (data.shippingCost || 0);
      return `₦${total.toLocaleString()}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReference = (data: any) => {
    if (receipt.type === 'banking') {
      return `Ref: ${data.transactionRef || 'N/A'}`;
    } else {
      return `Order: ${data.orderNumber || 'N/A'}`;
    }
  };

  const handleDownload = async () => {
    try {
      // Create a temporary preview element for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.id = 'temp-receipt-preview';
      
      // Add receipt content based on type
      if (receipt.type === 'banking') {
        tempDiv.innerHTML = `
          <div style="background: white; padding: 24px; max-width: 400px; font-family: Arial, sans-serif;">
            <div style="display: flex; align-items: center; margin-bottom: 24px;">
              ${receipt.logoUrl ? `<img src="${receipt.logoUrl}" style="width: 48px; height: 48px; border-radius: 8px;" />` : '<div style="width: 48px; height: 48px; background: #7c3aed; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">K</div>'}
              <span style="margin-left: 12px; font-size: 20px; font-weight: bold; color: #7c3aed;">kuda.</span>
            </div>
            <div style="text-align: right; margin-bottom: 32px;">
              <h1 style="font-size: 18px; font-weight: 600; margin: 0;">Transaction Details</h1>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Transaction Amount</p>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">${formatAmount(receipt.data)}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Beneficiary Details</p>
              <p style="margin: 0;">${(receipt.data as any).beneficiaryName || '-'}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Sender Details</p>
              <p style="margin: 0;">${(receipt.data as any).senderName || '-'}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Paid On</p>
              <p style="margin: 0;">${(receipt.data as any).paidOn ? new Date((receipt.data as any).paidOn).toLocaleString() : '-'}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Fees</p>
              <p style="margin: 0;">₦${(receipt.data as any).fees?.toLocaleString() || '0'}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Description</p>
              <p style="margin: 0;">${(receipt.data as any).description || '-'}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Transaction Reference</p>
              <p style="margin: 0;">${(receipt.data as any).transactionRef || '-'}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Payment Type</p>
              <p style="margin: 0;">${(receipt.data as any).paymentType || '-'}</p>
            </div>
            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin-top: 32px;">
              <div style="width: 48px; height: 48px; background: #7c3aed; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: white; font-weight: bold; font-size: 18px;">K</span>
              </div>
            </div>
          </div>
        `;
      } else {
        const data = receipt.data as any;
        const items = data.items || [];
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const total = subtotal + (data.shippingCost || 0);
        
        tempDiv.innerHTML = `
          <div style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; max-width: 400px; font-family: Arial, sans-serif;">
            <div style="background: #7c3aed; color: white; padding: 24px; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <span style="font-size: 24px; margin-right: 8px;">🛒</span>
                <span style="font-size: 24px; font-weight: bold;">${data.storeName || 'Fresh Cart'}</span>
              </div>
              <p style="font-size: 18px; font-weight: 500; margin: 0;">Order Receipt</p>
            </div>
            <div style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                  <p style="font-size: 14px; color: #6b7280; margin: 0;">Order No:</p>
                  <p style="font-weight: 600; margin: 4px 0 0 0;">${data.orderNumber || '#FC123456'}</p>
                </div>
                <div style="text-align: right;">
                  <p style="font-size: 14px; color: #6b7280; margin: 0;">${data.orderDate ? new Date(data.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'June 28, 2025'}</p>
                </div>
              </div>
              <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: #111827;">Items Purchased</span>
                  <span style="font-weight: 600; color: #111827;">Items</span>
                </div>
              </div>
              <div style="margin-bottom: 24px;">
                ${items.map((item: any) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div>
                      <p style="font-weight: 500; color: #111827; margin: 0;">${item.name}</p>
                    </div>
                    <div style="text-align: right;">
                      <p style="color: #6b7280; margin: 0; font-size: 14px;">${item.quantity}</p>
                      <p style="font-weight: 500; margin: 4px 0 0 0;">₦${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div style="background: #fef2f2; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: #111827;">Summary</span>
                  <span style="font-weight: 600; color: #111827;">Total</span>
                </div>
              </div>
              <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280;">Subtotal</span>
                  <span style="font-weight: 500;">₦${subtotal.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280;">Shipping</span>
                  <span style="font-weight: 500;">₦${(data.shippingCost || 0).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                  <span>Total</span>
                  <span>₦${total.toLocaleString()}</span>
                </div>
              </div>
              <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280;">Payment</span>
                  <span style="font-weight: 500;">${data.paymentMethod || 'Mastercard (**** 142) 1423'}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280;">Status</span>
                  <span style="font-weight: 500; color: #059669;">${data.status || 'Paid'}</span>
                </div>
              </div>
              <div style="text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                <p style="margin: 0;">Need help? Contact ${data.supportEmail || 'support@freshcart.com'}</p>
                <p style="margin: 8px 0 0 0;">Thank you for shopping with ${data.storeName || 'Fresh Cart'}!</p>
              </div>
            </div>
          </div>
        `;
      }
      
      document.body.appendChild(tempDiv);
      
      await generatePDF('temp-receipt-preview', `${receipt.title}-receipt.pdf`);
      
      document.body.removeChild(tempDiv);
      
      toast({
        title: 'Success',
        description: 'Receipt downloaded successfully!',
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to download receipt. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      try {
        await deleteReceipt(receipt.id);
        onDelete();
        toast({
          title: 'Success',
          description: 'Receipt deleted successfully!',
        });
      } catch (error) {
        console.error('Delete failed:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete receipt. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              receipt.type === 'banking' ? 'bg-purple-600' : 'bg-blue-600'
            }`}>
              {receipt.type === 'banking' ? (
                <University className="text-white text-sm" />
              ) : (
                <ShoppingCart className="text-white text-sm" />
              )}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
              {receipt.type}
            </span>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-gray-400 hover:text-purple-600"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{receipt.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {formatAmount(receipt.data)} • {formatDate(receipt.createdAt)}
        </p>
        <p className="text-xs text-gray-500">{getReference(receipt.data)}</p>
      </CardContent>
    </Card>
  );
}
