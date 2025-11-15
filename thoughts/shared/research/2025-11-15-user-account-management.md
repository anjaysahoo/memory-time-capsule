---
date: 2025-11-15T00:00:00Z
researcher: Claude
git_commit: edeef0eb56ddc6b2b655aa9f3d596633fe9d6946
branch: feat_logout-missing
repository: memory-time-capsule
topic: "User Account Management - Logout, User Info Display, and Account Section"
tags: [research, codebase, authentication, user-management, ui, mvp]
status: complete
last_updated: 2025-11-15
last_updated_by: Claude
---

# Research: User Account Management - Logout, User Info Display, and Account Section

**Date**: 2025-11-15
**Researcher**: Claude
**Git Commit**: edeef0eb56ddc6b2b655aa9f3d596633fe9d6946
**Branch**: feat_logout-missing
**Repository**: memory-time-capsule

## Research Question

Current state analysis for implementing user account management features:
1. How to display logged-in user information (username, email, connected accounts)
2. Where and how to implement logout functionality
3. What user data is currently available in the application
4. MVP implementation: Logout button + username in popup on user icon click
5. Future dedicated account section scope

## Summary

The application currently has **no logout functionality** and **no user account menu**. The Header component displays a static user avatar with no interactive elements. All necessary user data is available through the `authStore` and includes:
- GitHub username (`githubLogin`)
- GitHub name (`githubName`)
- GitHub email (`githubEmail`)
- GitHub avatar (`githubAvatar`)
- Gmail connection status (`gmailConnected`)
- Gmail email (stored in backend session)

For the MVP, we can add a dropdown/popover menu on the user avatar (top right) displaying username and a logout button. The logout functionality needs to be implemented both in frontend (clear local state) and backend (optional session invalidation).

## Detailed Findings

### Current Authentication State

**Frontend Session Store** (`frontend/src/store/authStore.ts:6-31`)

The Zustand store persists user session to localStorage as `auth-storage`:

```typescript
interface AuthState {
  userId: string | null;
  session: UserSession | null;
  setUserId: (userId: string) => void;
  setSession: (session: UserSession) => void;
  clearAuth: () => void;  // ← Already has clearAuth method!
  isAuthenticated: () => boolean;
}
```

**Important**: The `clearAuth()` method already exists and resets `userId` and `session` to `null`. This will automatically clear localStorage via Zustand's persist middleware.

### User Data Available

**Frontend UserSession Structure** (`frontend/src/api/types.ts:24-37`)

```typescript
export interface UserSession {
  userId: string;
  githubLogin: string;        // ← Username to display
  githubName: string | null;  // ← Full name to display
  githubEmail: string | null; // ← Email address
  githubAvatar: string;       // ← Already shown in Header
  repoName: string;
  repoFullName: string;
  repoUrl: string;
  githubConnected: boolean;   // ← Account connection status
  gmailConnected: boolean;    // ← Account connection status
  createdAt: string;
}
```

**Access in Components** (`frontend/src/components/Header.tsx:7`)

```typescript
const { session, isAuthenticated } = useAuthStore();
```

All user data is immediately available via `session` object.

### Current UI Implementation

**Header Component** (`frontend/src/components/Header.tsx:27-35`)

```tsx
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
```

**Current State**: Static avatar display with no click handler or menu.

**Available UI Components**: No dropdown/popover components currently exist in `/components/ui/` directory.

### Backend Session Management

**Session Storage** (`cloudflare-worker/src/utils/kv.ts:8`)

Sessions stored in Cloudflare KV at key: `user_session:{userId}`

**Backend UserSession** (`cloudflare-worker/src/routes/auth.ts:18-38`)

Contains additional data not in frontend:
```typescript
export interface UserSession {
  userId: string;
  githubUser: { id, login, name, email, avatar_url };
  repository: { name, full_name, private, html_url, clone_url };
  githubConnected: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;  // ← Gmail address (not in frontend session)
  createdAt: string;
}
```

**Gmail Email**: Currently only stored in backend session, not sent to frontend.

### Existing Patterns for Implementation

**Pattern: Click Handlers** (`frontend/src/pages/Create.tsx:187-193`)

```tsx
<Button
  onClick={() => {
    navigator.clipboard.writeText(success.magicLink);
    alert("Link copied!");
  }}
>
  Copy
</Button>
```

**Pattern: Navigation After Action** (`frontend/src/pages/Auth.tsx:29-41`)

```tsx
const handleGitHubAuth = async () => {
  try {
    setError(null);
    setLoading("github");
    const authUrl = await authService.getGitHubAuthUrl();
    window.location.href = authUrl;
  } catch (error) {
    console.error("GitHub auth error:", error);
    setError("Failed to start GitHub authentication");
    setLoading(null);
  }
};
```

**Pattern: Conditional Card Overlay** (`frontend/src/pages/Create.tsx:158-217`)

Could be adapted for dropdown menu/popover (though full Card pattern may be too heavy for user menu).

## Code References

- `frontend/src/store/authStore.ts:6-31` - Auth state with `clearAuth()` method
- `frontend/src/components/Header.tsx:27-35` - Current avatar display
- `frontend/src/api/types.ts:24-37` - Frontend session structure
- `cloudflare-worker/src/routes/auth.ts:18-38` - Backend session structure
- `cloudflare-worker/src/utils/kv.ts:8` - Session storage key pattern

## Architecture Documentation

### Current Authentication Flow

1. **Login**: GitHub OAuth → Gmail OAuth → Session created in KV → Frontend stores in localStorage
2. **Session Persistence**: Zustand persist middleware keeps session across page refreshes
3. **Authentication Check**: `isAuthenticated()` returns `githubConnected && gmailConnected`

### Missing Components

1. **Logout Endpoint**: No backend API endpoint for session deletion (optional for MVP)
2. **Logout UI**: No logout button or menu in frontend
3. **Dropdown/Popover Component**: No UI primitive for user menu (would need to add from shadcn/ui)

## MVP Implementation Recommendations

Based on existing patterns and available data, here's what can be implemented immediately:

### 1. Add Dropdown/Popover Component

The codebase uses shadcn/ui components. Add the **DropdownMenu** component from shadcn/ui:
- `frontend/src/components/ui/dropdown-menu.tsx` (needs to be added)

### 2. Update Header Component

Wrap the Avatar in a DropdownMenu:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar>
        <AvatarImage src={session?.githubAvatar} />
        <AvatarFallback>{session?.githubName?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    {/* User info section */}
    <DropdownMenuLabel>
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium">{session?.githubName || session?.githubLogin}</p>
        <p className="text-xs text-muted-foreground">{session?.githubEmail}</p>
      </div>
    </DropdownMenuLabel>

    <DropdownMenuSeparator />

    {/* Connection status */}
    <DropdownMenuItem disabled>
      GitHub: {session?.githubConnected ? '✅' : '❌'}
    </DropdownMenuItem>
    <DropdownMenuItem disabled>
      Gmail: {session?.gmailConnected ? '✅' : '❌'}
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    {/* Logout button */}
    <DropdownMenuItem onClick={handleLogout}>
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 3. Implement Logout Handler

```tsx
const handleLogout = () => {
  clearAuth();  // Clears userId and session from authStore + localStorage
  navigate('/');  // Redirect to landing page
};
```

### 4. Optional: Backend Logout Endpoint

For proper cleanup, add a backend endpoint:
- `DELETE /api/auth/session/:userId`
- Deletes KV entries: `user_session:{userId}`, `github_token:{userId}`, `gmail_token:{userId}`

## Future Dedicated Account Section

The following features would go in a dedicated `/account` or `/settings` page:

### Account Information
- Full user profile display
- Account creation date
- Repository details (name, URL)

### Connected Accounts Management
- Reconnect GitHub button (if disconnected)
- Reconnect Gmail button (if disconnected)
- Disconnect accounts (with warnings)

### Repository Information
- Repository name
- GitHub repository URL
- Storage usage details (already in Dashboard, could be duplicated here)

### Security & Privacy
- Change email preferences
- Download user data
- Delete account

### Settings
- Email notification preferences
- Time zone settings
- Language preferences

## Open Questions

1. **Session Expiration**: Should sessions expire after a certain time? Currently no TTL on KV entries.
2. **Multi-device Support**: Should logging out on one device invalidate sessions on all devices?
3. **Gmail Email Display**: Should we pass `gmailEmail` to frontend session for display in account menu?
4. **Reconnection Flow**: What happens if OAuth tokens expire? Need refresh flow?
5. **Account Deletion**: Should users be able to delete their account and all capsules?

## Related Research

- `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md` - Original implementation plan
- `thoughts/research/architecture.md` - System architecture (if exists)
