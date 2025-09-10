import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-primary font-bold text-xl"
            >
              <Activity className="h-6 w-6" />
              <span>Disease Surveillance</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/malaria" 
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/malaria') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Malaria
                  </Link>
                  <Link 
                    to="/leptospirosis" 
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/leptospirosis') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Leptospirosis
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden sm:inline text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Malaria & Leptospirosis Surveillance System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};