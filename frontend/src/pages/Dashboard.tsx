import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { capsuleService } from "@/api/services";
import type { DashboardData } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StorageMeter from "@/components/StorageMeter";
import CapsuleCard from "@/components/CapsuleCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userId, session, isAuthenticated } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }

    const fetchDashboard = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await capsuleService.getDashboard(userId);
        setDashboard(data);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center pt-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">
              Failed to Load Dashboard
            </h2>
            <Alert variant="destructive" className="my-4">
              <AlertDescription>{error || "Unknown error"}</AlertDescription>
            </Alert>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 slide-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Time Capsules
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {dashboard.capsules.total} capsule
              {dashboard.capsules.total !== 1 ? "s" : ""} total
            </p>
          </div>
          <Button
            onClick={() => navigate("/create")}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-lg px-8"
          >
            <span className="mr-2">✨</span> Create Capsule
          </Button>
        </div>

      {/* Storage Meter */}
      <StorageMeter
        used={dashboard.storage.used}
        limit={dashboard.storage.limit}
        percentage={dashboard.storage.percentage}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-lift border-2 border-transparent hover:border-indigo-200 transition-all shadow-lg slide-up bg-gradient-to-br from-white to-indigo-50" style={{animationDelay: '0.1s'}}>
          <CardContent className="text-center pt-8 pb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">⏳</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {dashboard.capsules.pending}
            </div>
            <div className="text-base font-medium text-muted-foreground">Pending</div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-2 border-transparent hover:border-green-200 transition-all shadow-lg slide-up bg-gradient-to-br from-white to-green-50" style={{animationDelay: '0.2s'}}>
          <CardContent className="text-center pt-8 pb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🎉</span>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {dashboard.capsules.unlocked}
            </div>
            <div className="text-base font-medium text-muted-foreground">Unlocked</div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-2 border-transparent hover:border-red-200 transition-all shadow-lg slide-up bg-gradient-to-br from-white to-red-50" style={{animationDelay: '0.3s'}}>
          <CardContent className="text-center pt-8 pb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">
              {dashboard.capsules.failed}
            </div>
            <div className="text-base font-medium text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Capsules List */}
      {dashboard.capsuleList.length === 0 ? (
        <Card className="border-2 border-dashed border-purple-300 shadow-lg hover-lift slide-up" style={{animationDelay: '0.4s'}}>
          <CardContent className="text-center py-16">
            <div className="mb-6 float">
              <span className="text-7xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              No capsules yet
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first time capsule to get started on your journey!
            </p>
            <Button
              onClick={() => navigate("/create")}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-lg px-8"
            >
              <span className="mr-2">✨</span> Create Your First Capsule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 slide-up" style={{animationDelay: '0.4s'}}>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Capsules
          </h2>
          {dashboard.capsuleList.map((capsule, index) => (
            <div key={capsule.id} className="slide-up" style={{animationDelay: `${0.1 * index}s`}}>
              <CapsuleCard capsule={capsule} />
            </div>
          ))}
        </div>
      )}

      {/* Repository Link */}
      <div className="mt-12 text-center slide-up" style={{animationDelay: '0.5s'}}>
        <Card className="max-w-md mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              Your capsules are stored in{" "}
              <a
                href={dashboard.repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 hover:text-indigo-700 underline"
              >
                {dashboard.repository.name}
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
