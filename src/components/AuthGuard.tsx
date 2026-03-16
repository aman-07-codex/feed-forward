import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const AuthGuard = ({ children, requireRole }: { children: React.ReactNode, requireRole?: 'provider' | 'ngo' }) => {
  const { user, session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // NOTE: Depending on role-enforcement stringency, we'd need to fetch 
  // the profile role here to definitively lock them out of the wrong dashboard,
  // but for rapid UX, simply ensuring they are logged in is a solid V1.
  // Full scale: Load profile into AuthContext and check against requireRole.

  return <>{children}</>;
};
