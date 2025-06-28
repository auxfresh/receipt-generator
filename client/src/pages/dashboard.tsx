import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ReceiptCard } from '@/components/dashboard/receipt-card';
import { Receipt } from '@/types/receipt';
import { getUserReceipts } from '@/lib/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadReceipts = async () => {
    if (!user) return;
    
    try {
      const userReceipts = await getUserReceipts(user.uid);
      setReceipts(userReceipts);
    } catch (error) {
      console.error('Failed to load receipts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load receipts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, [user]);

  const bankingReceipts = receipts.filter(r => r.type === 'banking').length;
  const shoppingReceipts = receipts.filter(r => r.type === 'shopping').length;

  const handleReceiptDelete = () => {
    loadReceipts(); // Reload receipts after deletion
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StatsCards
        totalReceipts={receipts.length}
        bankingReceipts={bankingReceipts}
        shoppingReceipts={shoppingReceipts}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No receipts found</p>
              <p className="text-sm text-gray-400">Create your first receipt to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receipts.map((receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onDelete={handleReceiptDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
