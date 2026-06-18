# Email Verification Status & Resend Action

Add visibility into whether a user's email is confirmed, plus a way to re-trigger the confirmation email, on the auth experience.

## What changes

### 1. Auth page (`src/routes/auth.tsx`)
- After a successful **signup**, instead of just toasting and switching to login mode, show an inline "Verify your email" state:
  - Message that a confirmation link was sent to the entered email.
  - A **Resend verification email** button that calls `supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: window.location.origin } })`.
  - A short cooldown (e.g. 30s) on the resend button to avoid spamming, with a countdown label.
  - A "Back to log in" link.
- On **login**, if Supabase returns the `Email not confirmed` error, surface a clear message and reveal the same Resend verification action for that email.

### 2. Verification status for signed-in users
- Expose `email_confirmed_at` from the current user via `useAuth` (already provides `user`; no change needed — `user.email_confirmed_at` is available on the Supabase `User`).
- On the auth page, if a user is already signed in but **unverified**, show a banner with verification status and the Resend action instead of immediately redirecting. (Currently it redirects to `/` whenever `user` exists — adjust to only redirect when the email is confirmed.)

## Status logic
- **Verified**: `user.email_confirmed_at` is set → show confirmed state / allow redirect.
- **Unverified**: `user` exists but `email_confirmed_at` is null → show "Email not verified" + Resend.

## Technical notes
- All changes are frontend-only in `src/routes/auth.tsx`; no DB/migration changes.
- Uses `supabase.auth.resend(...)` for re-sending; errors surfaced via existing `toast` (sonner).
- Cooldown handled with local `useState` + `setInterval`, cleared on unmount.
- Note: if email auto-confirm is enabled in auth settings, accounts are confirmed instantly and the unverified state won't appear — the resend flow is still safe (Supabase returns a no-op/handled error).

## Out of scope
- No changes to the signup/login backend, profiles table, or navigation.
