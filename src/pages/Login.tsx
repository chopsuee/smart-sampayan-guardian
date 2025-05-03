
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-sampayan flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">S</span>
        </div>
        <h1 className="text-3xl font-bold text-sampayan-dark">Smart Sampayan</h1>
        <p className="text-muted-foreground mt-2">Your Intelligent Clothes Protector</p>
      </div>
      <LoginForm />
    </div>
  );
}
