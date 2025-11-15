# User Account Management Implementation Plan

## Overview

Implement comprehensive user account management features including logout functionality, user information display, and account settings. This plan is split into MVP (quick user menu with logout) and Post-MVP (full account management page) phases.

## Current State Analysis

**Missing Features:**
- No logout functionality anywhere in the app
- Static avatar in header with no interactivity
- No way to see connected account details
- No UI components for dropdowns/popovers
- Gmail email stored in backend but not passed to frontend
- No handling for expired/disconnected OAuth tokens
- No account deletion capability

**Available Infrastructure:**
- `authStore.clearAuth()` method exists (`frontend/src/store/authStore.ts:6-31`)
- User session data available via Zustand store
- Backend stores all necessary user info in KV
- Gmail auto-refresh for access tokens already implemented (`cloudflare-worker/src/lib/gmail.ts:204-220`)
- GitHub OAuth tokens are long-lived (no expiration)

## Desired End State

**MVP (User Menu):**
- Clickable avatar in header opens dropdown menu
- Menu shows: username, email, connection status, logout button
- Logout clears frontend state and redirects to home
- Gmail email visible in session/menu

**Post-MVP (Account Management):**
- Dedicated `/account` page with full profile
- Reconnect GitHub/Gmail buttons
- View repository details
- Token expiration detection and reconnection flow
- Delete account with confirmation

### Key Discoveries:
- `authStore.clearAuth()` already exists - just needs UI trigger (`frontend/src/store/authStore.ts:57`)
- shadcn/ui pattern uses Radix UI + forwardRef + CVA for components
- Backend uses Hono router with routes in separate files
- KV helper functions already support deletion (`cloudflare-worker/src/utils/kv.ts:71-76`)
- Gmail email is in backend session but not sent to frontend (`cloudflare-worker/src/routes/auth.ts:130`)

## What We're NOT Doing

**Out of Scope (MVP):**
- Backend session deletion endpoint (frontend-only logout)
- Account settings page
- OAuth token refresh UI
- Account deletion
- Email preference changes
- Multi-device session management

**Out of Scope (Post-MVP):**
- Session expiration/TTL
- Multi-device logout
- Password/2FA features (OAuth only)
- Audit logs
- Data export

## Implementation Approach

**MVP Strategy:**
- Add shadcn/ui DropdownMenu component
- Update session types to include Gmail email
- Modify Header component with interactive menu
- Simple logout (clear localStorage only)

**Post-MVP Strategy:**
- Create dedicated account page with React Router
- Add backend endpoints for disconnect/delete
- Implement error detection for expired tokens
- Build reconnection flows using existing OAuth endpoints

---

# MVP IMPLEMENTATION

## MVP Phase 1: Add DropdownMenu UI Component

### Overview
Install and configure shadcn/ui DropdownMenu component following existing patterns (Avatar, Button, Card).

### Changes Required:

#### 1. Add DropdownMenu Component
**File**: `frontend/src/components/ui/dropdown-menu.tsx` (new file)
**Changes**: Create shadcn/ui DropdownMenu component

```tsx
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

#### 2. Install Radix UI Dependency
**Command**: Install @radix-ui/react-dropdown-menu

```bash
npm install @radix-ui/react-dropdown-menu
```

### Success Criteria:

#### Automated Verification:
- [x] Dependency installed: `npm list @radix-ui/react-dropdown-menu`
- [x] File exists: `frontend/src/components/ui/dropdown-menu.tsx`
- [x] TypeScript compiles: `npm run typecheck` (from frontend directory)
- [x] Build succeeds: `npm run build` (from frontend directory)

#### Manual Verification:
- [ ] No compilation errors in VS Code
- [ ] Component exports are available for import

---

## MVP Phase 2: Update Session Types

### Overview
Add `gmailEmail` field to frontend session types and adapter to pass Gmail email from backend to frontend.

### Changes Required:

#### 1. Update Frontend UserSession Interface
**File**: `frontend/src/api/types.ts`
**Changes**: Add gmailEmail field

```typescript
export interface UserSession {
  userId: string;
  githubLogin: string;
  githubName: string | null;
  githubEmail: string | null;
  githubAvatar: string;
  repoName: string;
  repoFullName: string;
  repoUrl: string;
  githubConnected: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;  // ← ADD THIS LINE
  createdAt: string;
}
```

#### 2. Update Adapter Function
**File**: `frontend/src/api/types.ts`
**Changes**: Include gmailEmail in adapter

```typescript
export function adaptUserSession(backendSession: BackendUserSession): UserSession {
  return {
    userId: backendSession.userId,
    githubLogin: backendSession.githubUser.login,
    githubName: backendSession.githubUser.name,
    githubEmail: backendSession.githubUser.email,
    githubAvatar: backendSession.githubUser.avatar_url,
    repoName: backendSession.repository.name,
    repoFullName: backendSession.repository.full_name,
    repoUrl: backendSession.repository.html_url,
    githubConnected: backendSession.githubConnected,
    gmailConnected: backendSession.gmailConnected,
    gmailEmail: backendSession.gmailEmail,  // ← ADD THIS LINE
    createdAt: backendSession.createdAt,
  };
}
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npm run typecheck` (from frontend directory)
- [x] No type errors in files importing UserSession

#### Manual Verification:
- [ ] Session type shows gmailEmail in IDE autocomplete
- [ ] No breaking changes to existing code using UserSession

---

## MVP Phase 3: Update Backend Session Response

### Overview
Ensure backend session endpoint returns gmailEmail field (currently stored but might not be returned).

### Changes Required:

#### 1. Verify Session GET Endpoint Returns gmailEmail
**File**: `cloudflare-worker/src/routes/auth.ts`
**Changes**: Ensure session includes gmailEmail when retrieved

Check the session GET endpoint at line ~175-185:
```typescript
auth.get('/session/:userId', async (c) => {
  const userId = c.req.param('userId');

  const session = await getJson<UserSession>(c.env.KV, `user_session:${userId}`);

  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }

  // Session already includes gmailEmail - no changes needed
  return c.json(session);
});
```

**Note**: Backend UserSession interface already has `gmailEmail?: string` field (line 130), and it's stored during Gmail OAuth callback (line 303). This phase is verification only.

### Success Criteria:

#### Automated Verification:
- [x] Worker builds successfully: `npm run build` (from cloudflare-worker directory)
- [x] TypeScript compiles: `npx tsc --noEmit` (from cloudflare-worker directory)

#### Manual Verification:
- [ ] GET /api/auth/session/:userId returns gmailEmail in response
- [ ] gmailEmail is populated when user has connected Gmail

---

## MVP Phase 4: Implement User Menu in Header

### Overview
Replace static avatar with interactive dropdown menu showing user info and logout button.

### Changes Required:

#### 1. Update Header Component
**File**: `frontend/src/components/Header.tsx`
**Changes**: Add dropdown menu with user info and logout

```tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { session, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Memory Time Capsule
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
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npm run typecheck` (from frontend directory)
- [x] Build succeeds: `npm run build` (from frontend directory)
- [ ] No console errors when running dev server: `npm run dev`

#### Manual Verification:
- [ ] Avatar is clickable and opens dropdown menu
- [ ] Menu displays correct username (GitHub name or login)
- [ ] Menu displays email (Gmail email preferred, falls back to GitHub email)
- [ ] Connection status shows ✅ for connected accounts
- [ ] Clicking "Log out" clears session and redirects to home page
- [ ] After logout, user sees "Get Started" button instead of avatar
- [ ] Menu closes when clicking outside
- [ ] Menu aligns properly to the right of avatar

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to next implementation.

---

# POST-MVP IMPLEMENTATION

## Post-MVP Phase 1: Create Account Settings Page

### Overview
Build dedicated `/account` page showing full user profile, connected accounts, repository info, and account management options.

### Changes Required:

#### 1. Create Account Page Component
**File**: `frontend/src/pages/Account.tsx` (new file)
**Changes**: Create account settings page

```tsx
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Account() {
  const { session, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated() || !session) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account and connected services</p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.githubAvatar} />
                <AvatarFallback>{session.githubName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{session.githubName || session.githubLogin}</p>
                <p className="text-sm text-muted-foreground">Member since {new Date(session.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Manage your connected services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* GitHub */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔗</div>
                <div>
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-muted-foreground">
                    {session.githubConnected ? session.githubLogin : 'Not connected'}
                  </p>
                </div>
              </div>
              <Badge variant={session.githubConnected ? "success" : "outline"}>
                {session.githubConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            {/* Gmail */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📧</div>
                <div>
                  <p className="font-medium">Gmail</p>
                  <p className="text-sm text-muted-foreground">
                    {session.gmailConnected ? session.gmailEmail || 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Badge variant={session.gmailConnected ? "success" : "outline"}>
                {session.gmailConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Repository Info */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Repository</CardTitle>
            <CardDescription>Your private GitHub repository for capsule storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Repository Name</p>
              <p className="text-sm text-muted-foreground">{session.repoFullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Repository URL</p>
              <a
                href={session.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {session.repoUrl}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone - Placeholder for future */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Account deletion will be available in a future update.
            </p>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### 2. Add Route to App Router
**File**: `frontend/src/App.tsx`
**Changes**: Add /account route

```tsx
import Account from "./pages/Account";

// Add route in the Routes section:
<Route path="/account" element={<Account />} />
```

#### 3. Add "Account Settings" Link to User Menu
**File**: `frontend/src/components/Header.tsx`
**Changes**: Add menu item linking to account page

```tsx
// Add before the logout separator:
<DropdownMenuItem asChild>
  <Link to="/account" className="cursor-pointer">
    Account Settings
  </Link>
</DropdownMenuItem>

<DropdownMenuSeparator />
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `npm run typecheck` (from frontend directory)
- [ ] Build succeeds: `npm run build` (from frontend directory)
- [ ] No console errors: `npm run dev`

#### Manual Verification:
- [ ] /account route loads successfully
- [ ] Page shows user profile with avatar and name
- [ ] Connected accounts section shows GitHub and Gmail status
- [ ] Repository information displays correctly
- [ ] "Account Settings" link appears in user menu dropdown
- [ ] Clicking link navigates to /account page
- [ ] Unauthenticated users are redirected to /auth

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to next phase.

---

## Post-MVP Phase 2: Add Account Management Endpoints

### Overview
Add backend API endpoints for disconnecting accounts and deleting user account.

### Changes Required:

#### 1. Add Gmail Disconnect Endpoint
**File**: `cloudflare-worker/src/routes/auth.ts`
**Changes**: Add DELETE endpoint for Gmail disconnection

```typescript
/**
 * Disconnect Gmail account
 * DELETE /api/auth/gmail/:userId
 */
auth.delete('/gmail/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Get user session
    const session = await getJson<UserSession>(c.env.KV, KV_KEYS.userSession(userId));

    if (!session) {
      return c.json({ error: 'User session not found' }, 404);
    }

    // Delete Gmail token from KV
    await deleteToken(c.env.KV, KV_KEYS.gmailToken(userId));

    // Update session
    session.gmailConnected = false;
    session.gmailEmail = undefined;
    await storeJson(c.env.KV, KV_KEYS.userSession(userId), session);

    return c.json({
      success: true,
      message: 'Gmail disconnected successfully',
      session,
    });

  } catch (error: any) {
    console.error('Gmail disconnect error:', error);
    return c.json({
      error: 'Failed to disconnect Gmail',
      message: error.message,
    }, 500);
  }
});
```

#### 2. Add Account Deletion Endpoint
**File**: `cloudflare-worker/src/routes/auth.ts`
**Changes**: Add DELETE endpoint for full account deletion

```typescript
/**
 * Delete user account
 * DELETE /api/auth/account/:userId
 */
auth.delete('/account/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Get session to verify user exists
    const session = await getJson<UserSession>(c.env.KV, KV_KEYS.userSession(userId));

    if (!session) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Delete all user data from KV
    await Promise.all([
      deleteToken(c.env.KV, KV_KEYS.githubToken(userId)),
      deleteToken(c.env.KV, KV_KEYS.gmailToken(userId)),
      c.env.KV.delete(KV_KEYS.userSession(userId)),
    ]);

    // Note: GitHub repository and capsules remain
    // User can manually delete repository if desired

    return c.json({
      success: true,
      message: 'Account deleted successfully',
    });

  } catch (error: any) {
    console.error('Account deletion error:', error);
    return c.json({
      error: 'Failed to delete account',
      message: error.message,
    }, 500);
  }
});
```

#### 3. Add Frontend API Service Methods
**File**: `frontend/src/api/services.ts`
**Changes**: Add service methods for disconnect and delete

```typescript
export const authService = {
  // ... existing methods ...

  disconnectGmail: async (userId: string): Promise<UserSession> => {
    const { data } = await apiClient.delete(`/api/auth/gmail/${userId}`);
    return adapt(data.session as BackendUserSession);
  },

  deleteAccount: async (userId: string) => {
    const { data } = await apiClient.delete(`/api/auth/account/${userId}`);
    return data;
  },
};
```

### Success Criteria:

#### Automated Verification:
- [ ] Worker builds: `npm run build` (from cloudflare-worker directory)
- [ ] TypeScript compiles: `npx tsc --noEmit` (from cloudflare-worker directory)
- [ ] Frontend builds: `npm run build` (from frontend directory)

#### Manual Verification:
- [ ] DELETE /api/auth/gmail/:userId disconnects Gmail and updates session
- [ ] DELETE /api/auth/account/:userId deletes all user KV data
- [ ] API returns appropriate error codes for invalid requests
- [ ] Session updates are reflected in subsequent GET requests

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to next phase.

---

## Post-MVP Phase 3: Implement Token Refresh Detection

### Overview
Detect when OAuth tokens are expired/revoked and update UI to show disconnection status.

### Changes Required:

#### 1. Add Token Validation Helper
**File**: `cloudflare-worker/src/lib/gmail.ts`
**Changes**: Add function to check if token is valid

```typescript
/**
 * Check if Gmail tokens are valid
 */
export async function validateGmailToken(
  tokens: GmailTokens,
  clientId: string,
  clientSecret: string
): Promise<boolean> {
  try {
    // Try to refresh the token
    const refreshed = await refreshGmailToken(tokens, clientId, clientSecret);
    return refreshed !== null;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}
```

#### 2. Update Email Sending to Detect Invalid Tokens
**File**: `cloudflare-worker/src/lib/gmail.ts`
**Changes**: Update sendEmail to return token status

Modify `sendEmail` function to catch 401/403 errors:

```typescript
export async function sendEmail(/* ... params ... */) {
  try {
    // ... existing token refresh logic ...

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentTokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!response.ok) {
      // Check for auth errors
      if (response.status === 401 || response.status === 403) {
        throw new Error('GMAIL_TOKEN_INVALID');
      }

      const error = await response.json();
      throw new Error(`Gmail API error: ${JSON.stringify(error)}`);
    }

    // ... rest of function ...
  } catch (error: any) {
    // Re-throw with token invalid flag
    throw error;
  }
}
```

#### 3. Update Capsule Creation to Handle Token Errors
**File**: `cloudflare-worker/src/routes/capsule.ts`
**Changes**: Detect token errors and mark Gmail as disconnected

In capsule creation endpoint, catch token errors:

```typescript
try {
  // Send creation email
  await sendEmail(/* ... */);
  capsule.creationEmailSent = true;
} catch (error: any) {
  console.error('Failed to send creation email:', error);

  // Check if Gmail token is invalid
  if (error.message === 'GMAIL_TOKEN_INVALID') {
    // Mark Gmail as disconnected in session
    const session = await getJson<UserSession>(c.env.KV, KV_KEYS.userSession(userId));
    if (session) {
      session.gmailConnected = false;
      await storeJson(c.env.KV, KV_KEYS.userSession(userId), session);
    }
  }

  capsule.creationEmailSent = false;
}
```

#### 4. Add Session Check Endpoint
**File**: `cloudflare-worker/src/routes/auth.ts`
**Changes**: Add endpoint to validate tokens and update session

```typescript
/**
 * Validate user tokens and update session status
 * POST /api/auth/validate/:userId
 */
auth.post('/validate/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    const session = await getJson<UserSession>(c.env.KV, KV_KEYS.userSession(userId));
    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    let updated = false;

    // Validate Gmail token if connected
    if (session.gmailConnected) {
      const gmailTokens = await getEncryptedToken(
        c.env.KV,
        KV_KEYS.gmailToken(userId),
        c.env.ENCRYPTION_KEY
      );

      if (gmailTokens) {
        const tokens = JSON.parse(gmailTokens) as GmailTokens;
        const isValid = await validateGmailToken(
          tokens,
          c.env.GMAIL_CLIENT_ID,
          c.env.GMAIL_CLIENT_SECRET
        );

        if (!isValid) {
          session.gmailConnected = false;
          session.gmailEmail = undefined;
          updated = true;
        }
      }
    }

    // Save updated session
    if (updated) {
      await storeJson(c.env.KV, KV_KEYS.userSession(userId), session);
    }

    return c.json({
      session,
      updated,
    });

  } catch (error: any) {
    console.error('Token validation error:', error);
    return c.json({
      error: 'Validation failed',
      message: error.message,
    }, 500);
  }
});
```

#### 5. Add Frontend Token Validation Call
**File**: `frontend/src/api/services.ts`
**Changes**: Add method to validate tokens

```typescript
export const authService = {
  // ... existing methods ...

  validateTokens: async (userId: string): Promise<UserSession> => {
    const { data } = await apiClient.post(`/api/auth/validate/${userId}`);
    return adapt(data.session as BackendUserSession);
  },
};
```

### Success Criteria:

#### Automated Verification:
- [ ] Worker builds: `npm run build` (from cloudflare-worker directory)
- [ ] TypeScript compiles: `npx tsc --noEmit` (from cloudflare-worker directory)
- [ ] Frontend builds: `npm run build` (from frontend directory)

#### Manual Verification:
- [ ] Revoke Gmail access in Google settings
- [ ] Create capsule triggers token validation
- [ ] Session updated to show Gmail disconnected
- [ ] User menu shows Gmail with ❌ status
- [ ] POST /api/auth/validate/:userId correctly detects invalid tokens

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to next phase.

---

## Post-MVP Phase 4: Add Reconnection UI

### Overview
Add UI elements to allow users to reconnect expired/disconnected accounts.

### Changes Required:

#### 1. Update Account Page with Reconnect Buttons
**File**: `frontend/src/pages/Account.tsx`
**Changes**: Add reconnect buttons for disconnected accounts

```tsx
import { useState } from "react";
import { authService } from "@/api/services";

export default function Account() {
  const { session, isAuthenticated, setSession } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  // ... existing code ...

  const handleReconnectGmail = async () => {
    if (!session) return;

    try {
      setLoading('gmail');
      const authUrl = await authService.getGmailAuthUrl(session.userId);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to start Gmail reconnection:', error);
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* ... existing sections ... */}

      {/* Connected Accounts - Updated */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your connected services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GitHub */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔗</div>
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-muted-foreground">
                  {session.githubConnected ? session.githubLogin : 'Not connected'}
                </p>
              </div>
            </div>
            <Badge variant={session.githubConnected ? "success" : "outline"}>
              {session.githubConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {/* Gmail */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">📧</div>
              <div className="flex-1">
                <p className="font-medium">Gmail</p>
                <p className="text-sm text-muted-foreground">
                  {session.gmailConnected ? session.gmailEmail || 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={session.gmailConnected ? "success" : "outline"}>
                {session.gmailConnected ? "Connected" : "Disconnected"}
              </Badge>
              {!session.gmailConnected && (
                <Button
                  size="sm"
                  onClick={handleReconnectGmail}
                  disabled={loading === 'gmail'}
                >
                  {loading === 'gmail' ? 'Reconnecting...' : 'Reconnect'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ... rest of page ... */}
    </div>
  );
}
```

#### 2. Add Disconnection Alert to Dashboard
**File**: `frontend/src/pages/Dashboard.tsx`
**Changes**: Show alert when Gmail is disconnected

```tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { session } = useAuthStore();

  // ... existing code ...

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Disconnection Alert */}
        {session && !session.gmailConnected && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-700">
              ⚠️ Gmail disconnected. You won't be able to send emails for new capsules.{' '}
              <Link to="/account" className="underline font-medium">
                Reconnect in Account Settings
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* ... rest of dashboard ... */}
      </div>
    </div>
  );
}
```

#### 3. Update User Menu to Show Reconnect Option
**File**: `frontend/src/components/Header.tsx`
**Changes**: Make disconnected accounts clickable

```tsx
// In the dropdown menu, update Gmail item:
{!session.gmailConnected ? (
  <DropdownMenuItem asChild>
    <Link to="/account" className="cursor-pointer">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs">Gmail ❌</span>
        <span className="text-xs text-primary">Reconnect →</span>
      </div>
    </Link>
  </DropdownMenuItem>
) : (
  <DropdownMenuItem disabled className="cursor-default">
    <div className="flex items-center justify-between w-full">
      <span className="text-xs">Gmail</span>
      <span>✅</span>
    </div>
  </DropdownMenuItem>
)}
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `npm run typecheck` (from frontend directory)
- [ ] Build succeeds: `npm run build` (from frontend directory)

#### Manual Verification:
- [ ] Account page shows "Reconnect" button for disconnected Gmail
- [ ] Clicking reconnect starts OAuth flow
- [ ] After reconnection, status updates to ✅
- [ ] Dashboard shows alert when Gmail disconnected
- [ ] Alert link navigates to account page
- [ ] User menu shows reconnect option for disconnected Gmail

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to next phase.

---

## Post-MVP Phase 5: Implement Account Deletion

### Overview
Add full account deletion UI with confirmation dialog and cleanup.

### Changes Required:

#### 1. Add Confirmation Dialog Component
**File**: `frontend/src/components/ui/alert-dialog.tsx` (new file)
**Changes**: Add shadcn/ui AlertDialog component

```tsx
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

#### 2. Install Radix AlertDialog Dependency
**Command**: Install package

```bash
npm install @radix-ui/react-alert-dialog
```

#### 3. Update Account Page with Deletion Dialog
**File**: `frontend/src/pages/Account.tsx`
**Changes**: Enable account deletion with confirmation

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Account() {
  const { session, isAuthenticated, clearAuth, setSession } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ... existing handlers ...

  const handleDeleteAccount = async () => {
    if (!session) return;

    try {
      setLoading('delete');
      await authService.deleteAccount(session.userId);

      // Clear local auth state
      clearAuth();

      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
      setLoading(null);
    }
  };

  const handleDisconnectGmail = async () => {
    if (!session) return;

    try {
      setLoading('disconnect-gmail');
      const updatedSession = await authService.disconnectGmail(session.userId);
      setSession(updatedSession);
      setLoading(null);
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error);
      alert('Failed to disconnect Gmail. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* ... existing sections ... */}

      {/* Connected Accounts - Add disconnect button */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your connected services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gmail with disconnect option */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">📧</div>
              <div className="flex-1">
                <p className="font-medium">Gmail</p>
                <p className="text-sm text-muted-foreground">
                  {session.gmailConnected ? session.gmailEmail || 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={session.gmailConnected ? "success" : "outline"}>
                {session.gmailConnected ? "Connected" : "Disconnected"}
              </Badge>
              {session.gmailConnected ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDisconnectGmail}
                  disabled={loading === 'disconnect-gmail'}
                >
                  {loading === 'disconnect-gmail' ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleReconnectGmail}
                  disabled={loading === 'gmail'}
                >
                  {loading === 'gmail' ? 'Reconnecting...' : 'Reconnect'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Now functional */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Delete Account</p>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete your account session and tokens. Your GitHub repository
              and capsules will remain - you can manually delete the repository if needed.
            </p>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading === 'delete'}>
                  {loading === 'delete' ? 'Deleting...' : 'Delete Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    session and remove your data from our servers.
                    <br /><br />
                    <strong>Note:</strong> Your GitHub repository and capsules will remain.
                    You can manually delete the repository from GitHub if desired.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Success Criteria:

#### Automated Verification:
- [ ] Dependency installed: `npm list @radix-ui/react-alert-dialog`
- [ ] TypeScript compiles: `npm run typecheck` (from frontend directory)
- [ ] Build succeeds: `npm run build` (from frontend directory)

#### Manual Verification:
- [ ] "Delete Account" button opens confirmation dialog
- [ ] Dialog clearly explains what will be deleted
- [ ] "Cancel" button closes dialog without action
- [ ] "Delete Account" in dialog triggers deletion
- [ ] After deletion, user is logged out and redirected home
- [ ] Cannot log back in with deleted account
- [ ] "Disconnect" button for Gmail works correctly
- [ ] After disconnect, Gmail status shows ❌ and "Reconnect" button appears

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful.

---

## Testing Strategy

### Unit Tests:
- AuthStore clearAuth method clears state
- Session adapter correctly maps backend to frontend types
- KV helper functions (deleteToken, getJson) work correctly

### Integration Tests:
- Full logout flow (clear state → redirect → cannot access protected routes)
- Account deletion flow (delete endpoint → KV cleanup → logout)
- Token validation flow (expired token → session updated → UI reflects status)

### Manual Testing Steps:

**MVP:**
1. Log in with GitHub and Gmail
2. Click avatar in header → verify dropdown opens
3. Verify username and email display correctly
4. Verify connection status shows ✅ for both
5. Click "Log out" → verify redirect to home
6. Verify cannot access /dashboard after logout
7. Log back in → verify session restored

**Post-MVP:**
1. Navigate to /account page
2. Verify all profile information displays
3. Click "Reconnect" for Gmail (after manual disconnect)
4. Verify OAuth flow completes and status updates
5. Click "Disconnect" for Gmail
6. Verify status changes and alert appears on dashboard
7. Click "Delete Account" → verify confirmation dialog
8. Confirm deletion → verify logout and redirect
9. Verify cannot log back in

## Performance Considerations

- Logout is instant (localStorage clear only)
- Account deletion requires 3 KV deletes (< 100ms total)
- Token validation adds ~200ms per OAuth provider check
- Dropdown menu uses Radix Portal for performant rendering

## Migration Notes

**No Data Migration Required** - All changes are additive:
- Gmail email already stored in backend (just exposing to frontend)
- New endpoints are additions (no breaking changes)
- Session structure unchanged (gmailEmail was optional)

**Deployment Order:**
1. Deploy backend changes first (new endpoints)
2. Deploy frontend changes (UI updates)
3. No downtime required

## References

- Research document: `thoughts/shared/research/2025-11-15-user-account-management.md`
- Auth store: `frontend/src/store/authStore.ts:6-31`
- Backend session: `cloudflare-worker/src/routes/auth.ts:18-38`
- KV utilities: `cloudflare-worker/src/utils/kv.ts`
- shadcn/ui patterns: Existing components in `frontend/src/components/ui/`
