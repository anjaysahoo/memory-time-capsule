import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const { session, isAuthenticated } = useAuthStore();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-purple-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎁</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Time Capsule
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors hidden md:block"
                >
                  Dashboard
                </Link>
                <Button
                  asChild
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  <Link to="/create">
                    <span className="mr-1">✨</span> Create
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar className="ring-2 ring-purple-200 hover:ring-purple-400 transition-all">
                    <AvatarImage
                      src={session?.githubAvatar}
                      alt={session?.githubName || 'User'}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                      {session?.githubName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
              >
                <Link to="/auth">
                  <span className="mr-1">✨</span> Get Started
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

