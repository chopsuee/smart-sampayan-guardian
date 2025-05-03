
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-sampayan flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{user?.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-xl font-medium">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground italic mt-4">
              This is a placeholder for the profile settings page. In a full application, you would be able to edit your profile, change password, and manage notification preferences here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
