import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { session, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            🎁 Time Capsule
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Button asChild>
                  <Link to="/create">Create Capsule</Link>
                </Button>

                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage
                          src={session?.githubAvatar}
                          alt={session?.githubName || session?.githubLogin || 'User'}
                        />
                        <AvatarFallback>
                          {session?.githubName?.charAt(0).toUpperCase() ||
                           session?.githubLogin?.charAt(0).toUpperCase() ||
                           'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session?.githubName || session?.githubLogin}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.gmailEmail || session?.githubEmail || 'No email'}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem disabled className="cursor-default">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs">GitHub</span>
                        <span>{session?.githubConnected ? '✅' : '❌'}</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled className="cursor-default">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs">Gmail</span>
                        <span>{session?.gmailConnected ? '✅' : '❌'}</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

