# Proper Admin System

Replace the hardcoded `jakir03` code with a real authentication + role-based admin system, plus a dedicated `/admin` dashboard.

## Auth

- Enable Lovable Cloud auth: email + password AND Google sign-in.
- Signup remains open (needed so `vpn99vip99@gmail.com` can create the account), but only users granted the `admin` role can access anything admin.
- Public site remains fully anonymous — no login required for students.

## Roles (secure pattern)

New `app_role` enum (`admin`) and `user_roles` table (separate from profiles — never store roles on a user/profile table). Access is checked via a `SECURITY DEFINER` function `has_role(uuid, app_role)` used by RLS and edge functions.

Seed the first admin: after `vpn99vip99@gmail.com` signs up once, a trigger auto-grants `admin` to that verified email. Any additional admins are added from the dashboard.

## Routes

```text
/admin/login    email+password + "Continue with Google"
/admin          dashboard (protected — requires admin role)
```

Dashboard tabs:
1. **Notes** — upload / edit / delete notes (replaces current `NoteUploadDialog` code flow).
2. **Comments** — list latest comments across all notes, delete inappropriate ones.
3. **Notifications** — send push + view history + trigger "check new notices" (folds in the current floating gear panel).
4. **Admins** — list admin users, add new admin by email, remove admin (can't remove yourself).

Old floating `AdminNotificationTest` gear and the "Admin upload" button on `/notes` are removed. `/notes` becomes purely public.

## Backend

Migration:
- `create type app_role as enum ('admin')`
- `user_roles(id, user_id → auth.users, role, created_at)` with GRANTs, RLS, `has_role()` function
- Trigger on `auth.users` insert/update: if `email = 'vpn99vip99@gmail.com'` and `email_confirmed_at is not null`, insert admin role
- Update `notes` and `note_comments` policies: admin-role users can INSERT/UPDATE/DELETE directly (no more service-role-only)

Edge function changes:
- `admin-notes` becomes `verify_jwt = true`, drops the `jakir03` check, and instead calls `has_role(auth.uid(), 'admin')`. Kept for signed upload URLs (still needs service role for storage) and admin-only operations that require elevated privileges.
- New `admin-users` function: list admins, grant admin by email (looks up user in `auth.users`), revoke admin. JWT-verified + role-checked.

Storage `note-files` bucket policy: admin role can insert/delete objects; public read stays.

## Frontend

- `src/lib/auth.ts` — thin wrapper: `useAuth()` hook (session + isAdmin), `signInWithPassword`, `signInWithGoogle`, `signUp`, `signOut`.
- `src/pages/AdminLogin.tsx` — email/password form + Google button, redirects to `/admin` on success.
- `src/pages/Admin.tsx` — protected shell with tabs; redirects to `/admin/login` if not signed in or not admin.
- `src/components/admin/NotesManager.tsx`, `CommentsManager.tsx`, `NotificationsManager.tsx`, `AdminsManager.tsx`.
- `src/lib/api/notes.ts` — drop `adminCode` argument; admin calls use the authenticated session.
- Remove: `NoteUploadDialog` admin-code UI, `AdminNotificationTest` floating gear, `AdminSubscriptionsPanel`/`AdminNotificationHistory` moved under the new dashboard.

## Out of scope

- Multiple role tiers (moderator, editor) — just `admin` for now.
- Password reset page (can add later if you want).
- 2FA.

## Files

```text
NEW  src/pages/AdminLogin.tsx
NEW  src/pages/Admin.tsx
NEW  src/lib/auth.ts
NEW  src/components/admin/NotesManager.tsx
NEW  src/components/admin/CommentsManager.tsx
NEW  src/components/admin/NotificationsManager.tsx
NEW  src/components/admin/AdminsManager.tsx
NEW  supabase/functions/admin-users/index.ts
NEW  migration: app_role, user_roles, has_role, seed trigger, updated notes/comments policies
EDIT src/App.tsx  (add /admin routes, drop floating admin panel)
EDIT src/pages/Notes.tsx  (remove admin upload button)
EDIT src/pages/NoteDetail.tsx  (comment delete only visible to admins)
EDIT src/lib/api/notes.ts  (drop admin code)
EDIT supabase/functions/admin-notes/index.ts  (JWT + role check instead of code)
EDIT supabase/config.toml  (add admin-users function, flip admin-notes verify_jwt)
DEL  src/components/AdminNotificationTest.tsx (folded into dashboard)
```

After you approve, the first-run flow is: sign up once with `vpn99vip99@gmail.com` → confirm email → you land on `/admin` as admin automatically.
