import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Menu, User, LogOut, FileText, Home } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export function HeaderNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await logout();
      setOpen(false);
      setLocation('/login');
      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const navigateTo = (path: string) => {
    setLocation(path);
    setOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.email || 'User';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigateTo('/dashboard')}
              className="text-xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Receipt Generator
            </button>
          </div>

          {/* User Profile & Menu */}
          <div className="flex items-center space-x-4">
            {/* User Avatar & Email Display */}
            <div className="hidden sm:flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-600 text-white text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {getUserDisplayName()}
              </span>
            </div>

            {/* Hamburger Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* User Profile Section */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigateTo('/dashboard')}
                    >
                      <Home className="mr-3 h-4 w-4" />
                      Dashboard
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigateTo('/profile')}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Button>
                  </div>

                  <Separator />

                  {/* Sign Out */}
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}