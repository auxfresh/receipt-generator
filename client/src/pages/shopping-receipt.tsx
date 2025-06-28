import { ShoppingReceiptForm } from '@/components/receipts/shopping-receipt-form';
import { useLocation } from 'wouter';

export default function ShoppingReceipt() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation('/dashboard');
  };

  return <ShoppingReceiptForm onBack={handleBack} />;
}
