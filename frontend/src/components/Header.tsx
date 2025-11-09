import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
                <Button asChild>
                  <Link to="/create">Create Capsule</Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={session?.githubAvatar}
                      alt={session?.githubName || 'User'}
                    />
                    <AvatarFallback>
                      {session?.githubName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

