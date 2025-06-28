import { Card, CardContent } from '@/components/ui/card';
import { Receipt, University, ShoppingCart } from 'lucide-react';

interface StatsCardsProps {
  totalReceipts: number;
  bankingReceipts: number;
  shoppingReceipts: number;
}

export function StatsCards({ totalReceipts, bankingReceipts, shoppingReceipts }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{totalReceipts}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Receipt className="text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Banking Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{bankingReceipts}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <University className="text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shopping Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{shoppingReceipts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
