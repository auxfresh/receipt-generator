import { BankingReceiptForm } from '@/components/receipts/banking-receipt-form';
import { useLocation } from 'wouter';

export default function BankingReceipt() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation('/dashboard');
  };

  return <BankingReceiptForm onBack={handleBack} />;
}
