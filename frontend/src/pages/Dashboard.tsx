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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Time Capsules</h1>
          <p className="text-muted-foreground mt-1">
            {dashboard.capsules.total} capsule
            {dashboard.capsules.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button onClick={() => navigate("/create")}>+ Create Capsule</Button>
      </div>

      {/* Storage Meter */}
      <StorageMeter
        used={dashboard.storage.used}
        limit={dashboard.storage.limit}
        percentage={dashboard.storage.percentage}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="text-center pt-6">
            <div className="text-4xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-primary">
              {dashboard.capsules.pending}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-3xl font-bold text-green-600">
              {dashboard.capsules.unlocked}
            </div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center pt-6">
            <div className="text-4xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-red-600">
              {dashboard.capsules.failed}
            </div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Capsules List */}
      {dashboard.capsuleList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No capsules yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first time capsule to get started!
            </p>
            <Button onClick={() => navigate("/create")}>
              Create Your First Capsule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">All Capsules</h2>
          {dashboard.capsuleList.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} />
          ))}
        </div>
      )}

      {/* Repository Link */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Your capsules are stored in{" "}
          <a
            href={dashboard.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            {dashboard.repository.name}
          </a>
        </p>
      </div>
    </div>
  );
}
