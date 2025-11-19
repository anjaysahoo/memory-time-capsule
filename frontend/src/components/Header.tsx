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
import { SpinningText } from '@/components/ui/spinning-text';

export default function Header() {
  const { session, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="bg-transparent fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-32 h-32 relative flex items-center justify-center">
              <SpinningText 
                className="text-white text-sm font-bold"
                duration={10}
                radius={3.5}
              >
                Memory Time Capsule
              </SpinningText>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="text-white/70 hover:text-white">
                  Dashboard
                </Link>
                <Button asChild variant="outline" className="bg-black text-white border-white/20 hover:bg-white/10">
                  <Link to="/create">Create Capsule</Link>
                </Button>

                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                      <Avatar>
                        <AvatarImage
                          src={session?.githubAvatar}
                          alt={session?.githubName || session?.githubLogin || 'User'}
                        />
                        <AvatarFallback className="bg-white text-black">
                          {session?.githubName?.charAt(0).toUpperCase() ||
                           session?.githubLogin?.charAt(0).toUpperCase() ||
                           'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 bg-black border-white/20">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {session?.githubName || session?.githubLogin}
                        </p>
                        <p className="text-xs leading-none text-white/60">
                          {session?.gmailEmail || session?.githubEmail || 'No email'}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem disabled className="cursor-default text-white/60">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs">GitHub</span>
                        <span>{session?.githubConnected ? '✅' : '❌'}</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled className="cursor-default text-white/60">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs">Gmail</span>
                        <span>{session?.gmailConnected ? '✅' : '❌'}</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}

