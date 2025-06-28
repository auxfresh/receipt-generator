import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Receipt, Plus, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { CreateReceiptModal } from '../modals/create-receipt-modal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <Receipt className="text-white text-lg" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">Receipt Generator</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Receipt
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="relative">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="text-purple-600 h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>

      <CreateReceiptModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
}
