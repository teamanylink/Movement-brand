import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProjectDashboard from "./pages/ProjectDashboard";
import Auth from "./components/Auth";
import { AuthenticatedLayout } from "./components/layouts/AuthenticatedLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Session exists" : "No session");
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session ? "Session exists" : "No session");
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Index />} 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/project" 
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout>
                    <ProjectDashboard />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/project/:projectId" 
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout>
                    <ProjectDashboard />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;