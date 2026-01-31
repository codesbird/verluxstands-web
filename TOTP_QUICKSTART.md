# TOTP Implementation - Quick Start Guide

## For Admins: How to Use

### Enable TOTP
1. Go to **Admin Dashboard** → **Settings** (last item in sidebar)
2. Scroll to "Two-Factor Authentication" section
3. Toggle the switch to **Enable**
4. A modal will appear with a QR code
5. Open your authenticator app (Google Authenticator, Microsoft Authenticator, or Authy)
6. Scan the QR code OR manually enter the secret key
7. Enter the 6-digit code shown in your authenticator app
8. Click "Verify & Enable"
9. Done! TOTP is now enabled

### Disable TOTP
1. Go to **Admin Dashboard** → **Settings**
2. Find "Two-Factor Authentication" section
3. Toggle the switch to **Disable**
4. Confirm the action
5. Done! TOTP is now disabled

### Login with TOTP
1. Enter email and password as usual
2. If TOTP is enabled, you'll see a new verification step
3. Open your authenticator app and find the 6-digit code
4. Enter the code and click "Verify Code"
5. You're logged in!

### Regenerate Secret Key
1. Go to **Admin Dashboard** → **Settings**
2. If TOTP is enabled, click "Regenerate Secret Key"
3. Follow the same setup process as first-time setup
4. Your old secret key will be replaced

## Recommended Authenticator Apps
- **Google Authenticator** (Free, available on iOS and Android)
- **Microsoft Authenticator** (Free, available on iOS and Android)
- **Authy** (Free, desktop and mobile versions)
- **1Password** (Paid, but offers TOTP support)

## Important Notes
- ⚠️ Save your secret key in a safe place if TOTP setup fails
- ⚠️ If you lose access to your authenticator app, you'll need to disable TOTP from someone with access
- The 6-digit code changes every 30 seconds
- The system allows ±2 time windows for clock skew tolerance
- TOTP can be enabled/disabled anytime from Settings

## Technical Details

### Files Modified
- `lib/auth-context.tsx` - Added TOTP state management
- `app/admin/login/page.tsx` - Added TOTP verification form
- `lib/totp.ts` - New TOTP utilities

### Files Created
- `components/admin/totp-setup-modal.tsx` - Setup and verification modal
- `app/admin/dashboard/settings/page.tsx` - Settings page with TOTP controls

### Firebase Structure
```
Database: admin_settings/totp/
  - enabled: boolean (true/false)
  - secret: string (base32 encoded, only when enabled)
```

### NPM Packages Added
- `speakeasy` - TOTP generation and verification
- `qrcode` - QR code generation
- `@types/speakeasy` - TypeScript types
- `@types/qrcode` - TypeScript types
