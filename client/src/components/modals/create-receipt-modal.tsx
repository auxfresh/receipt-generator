import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { University, ShoppingCart } from 'lucide-react';
import { useLocation } from 'wouter';

interface CreateReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateReceiptModal({ open, onOpenChange }: CreateReceiptModalProps) {
  const [, setLocation] = useLocation();

  const handleCreateBanking = () => {
    onOpenChange(false);
    setLocation('/banking-receipt');
  };

  const handleCreateShopping = () => {
    onOpenChange(false);
    setLocation('/shopping-receipt');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Receipt</DialogTitle>
          <DialogDescription>
            Choose the type of receipt you want to create
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full p-4 h-auto border-2 hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            onClick={handleCreateBanking}
          >
            <div className="flex items-center w-full">
              <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center">
                <University className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-semibold text-gray-900">Banking Transaction</h3>
                <p className="text-sm text-gray-600">Create a bank transfer receipt</p>
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full p-4 h-auto border-2 hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            onClick={handleCreateShopping}
          >
            <div className="flex items-center w-full">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center">
                <ShoppingCart className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-semibold text-gray-900">Shopping Purchase</h3>
                <p className="text-sm text-gray-600">Create an online shopping receipt</p>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
