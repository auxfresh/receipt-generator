import { ShoppingReceiptData } from '@/types/receipt';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface ShoppingReceiptPreviewProps {
  data: ShoppingReceiptData;
  logoUrl?: string;
}

export function ShoppingReceiptPreview({ data, logoUrl }: ShoppingReceiptPreviewProps) {
  const subtotal = data.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const total = subtotal + (data.shippingCost || 0);

  return (
    <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto" id="shopping-receipt-preview">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover mr-2" />
            ) : (
              <ShoppingCart className="text-2xl mr-2" />
            )}
            <span className="text-2xl font-bold">{data.storeName || 'Fresh Cart'}</span>
          </div>
          <p className="text-lg font-medium">Order Receipt</p>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-600">Order No:</p>
              <p className="font-semibold">{data.orderNumber || '#FC123456'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {data.orderDate ? new Date(data.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'June 28, 2025'}
              </p>
            </div>
          </div>

          {/* Items Header */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Items Purchased</span>
              <span className="font-semibold text-gray-900">Items</span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3 mb-6">
            {data.items && data.items.length > 0 ? (
              data.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{item.quantity}</p>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity, data.currency || 'USD')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">No items added</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">0</p>
                  <p className="font-medium">{formatCurrency(0, data.currency || 'USD')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Summary</span>
              <span className="font-semibold text-gray-900">Total</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal, data.currency || 'USD')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{formatCurrency(data.shippingCost || 0, data.currency || 'USD')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total, data.currency || 'USD')}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment</span>
              <span className="font-medium">{data.paymentMethod || 'Mastercard (**** 142) 1423'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-green-600">{data.status || 'Paid'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>Need help? Contact {data.supportEmail || 'support@freshcart.com'}</p>
            <p className="mt-2">Thank you for shopping with {data.storeName || 'Fresh Cart'}!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
