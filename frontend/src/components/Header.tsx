import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { session, isAuthenticated } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🎁 Time Capsule
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link to="/create" className="btn btn-primary">
                  Create Capsule
                </Link>
                <div className="flex items-center gap-2">
                  <img
                    src={session?.githubAvatar}
                    alt={session?.githubName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              </>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

