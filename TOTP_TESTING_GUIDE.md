# TOTP Verification Troubleshooting & Testing Guide

## What Was Fixed

### 1. **TOTP Code Verification Logic** 
- **Issue**: `speakeasy.totp.verify()` returns a number (window index) on success, not boolean `true`
- **Original Check**: `verified === true` ❌ (always failed)
- **Fixed Check**: `typeof verified === "number"` ✅ (correctly identifies valid codes)
- **Window Size**: Increased from 2 to 4 (±2 minutes tolerance for clock skew)

### 2. **Code Trimming & Validation**
- Added `.trim()` to remove any accidental whitespace
- String conversion to ensure consistent type handling
- Enhanced error logging for debugging

### 3. **Setup Modal Improvements**
- Better error messages explaining code expiration
- Added troubleshooting tips for users
- Detailed logging to browser console for debugging

### 4. **Firebase Path Errors**
- Fixed `.well-known` path errors causing 404s
- Created proper API route handler
- Prevents Firebase from validating invalid paths

## How to Test TOTP Setup (Step by Step)

### Prerequisites
1. Have an authenticator app installed:
   - **Google Authenticator** (free, recommended)
   - **Microsoft Authenticator** (free)
   - **Authy** (free)
   - Any other TOTP-compatible app

2. Make sure your device time is synchronized (usually automatic)

### Test Steps

#### Step 1: Enable TOTP
1. Go to **http://localhost:3000** (or 3001 if port 3000 is busy)
2. Navigate to **Admin Dashboard** → **Settings**
3. Scroll to "Two-Factor Authentication" section
4. Click the toggle to **Enable**
5. A modal should pop up with a QR code

#### Step 2: Set Up Authenticator App
1. Open your authenticator app
2. Tap **"Add Account"** or **"+"** button
3. Choose **"Scan QR Code"**
4. Scan the QR code shown in the modal
5. The app should now show a 6-digit code that changes every 30 seconds

**Alternative (if QR scan doesn't work):**
1. In the modal, click the eye icon to reveal the secret key
2. Click the copy button to copy it
3. In your authenticator app, choose "Enter Setup Key" or "Manual Entry"
4. Paste the secret key
5. For "Time-based (TOTP)" - make sure this is selected
6. Wait for the code to be generated

#### Step 3: Verify the Code
1. **Important**: Copy the 6-digit code from your authenticator app **immediately**
2. Paste it into the modal's "Authentication Code" field
3. Click "Verify & Enable"
4. Should show: ✅ "Two-factor authentication enabled"

**If it shows "Invalid code":**
- The code may have expired (30-second limit)
- Try again with a fresh code
- Make sure your device time is correct

#### Step 4: Test Login with TOTP
1. Click **Log Out** (top right of dashboard)
2. Go back to login page: **http://localhost:3000/admin/login**
3. Enter your email and password
4. You should see a new screen asking for the authenticator code
5. Get a fresh 6-digit code from your authenticator app
6. Enter it and click "Verify Code"
7. Should redirect to dashboard ✅

#### Step 5: Disable TOTP (Optional)
1. Go to **Settings** again
2. Toggle "Two-Factor Authentication" to **Disable**
3. Next login should only require email/password

## Debugging with Browser Console

If you're still getting "Invalid code" errors:

1. Open **Browser DevTools** (F12)
2. Go to **Console** tab
3. During setup, you'll see logs like:
   ```
   Verifying TOTP code: {
     secretLength: 32,
     codeLength: 6,
     code: "123456"
   }
   ```

4. Check:
   - ✅ `secretLength: 32` (should be 32)
   - ✅ `codeLength: 6` (should be 6)
   - ✅ `code: "XXXXXX"` (should be digits only, no spaces)

5. During login, similar logs appear with the message:
   ```
   Login TOTP verification: {
     emailLength: XX,
     codeLength: 6,
     secretLength: 32
   }
   ```

## Common Issues & Solutions

### Issue: "Invalid code. The code may have expired..."
**Solution**: 
- TOTP codes change every 30 seconds
- Copy the code immediately when you see it in your app
- Don't wait - paste right away
- Try a fresh code

### Issue: "TOTP not configured"
**Solution**:
- Make sure you completed the setup process
- Check that the confirmation message appeared
- Refresh the page and try again
- Check browser console for errors

### Issue: "TOTP secret not found"
**Solution**:
- The secret wasn't saved properly
- Try enabling TOTP again from Settings
- Make sure Firebase is connected properly

### Issue: Authenticator app shows no code
**Solution**:
- Make sure the account was added correctly
- Check that it shows the correct name: "Verlux Admin (youremail@example.com)"
- The issuer should be "Verlux Admin"
- Try re-scanning the QR code
- Check your device time/date settings

### Issue: Firebase source map warnings (safe to ignore)
**Solution**:
- These are just warnings, not errors
- They don't affect functionality
- The `.well-known` path fix resolves the 404s
- Can be ignored during development

## Testing Checklist

- [ ] TOTP can be enabled from Settings
- [ ] QR code displays correctly
- [ ] Code verification works on first try
- [ ] Login requires TOTP when enabled
- [ ] TOTP can be disabled from Settings
- [ ] Login works without TOTP when disabled
- [ ] No console errors during setup
- [ ] No console errors during login

## If Issues Persist

1. **Check the terminal logs** where you ran `npm run dev`
   - Look for any error messages
   - Check for authentication errors

2. **Verify Firebase Connection**:
   - Make sure `admin_settings/totp` data exists in Firebase
   - Check the `enabled` and `secret` fields

3. **Test Time Sync**:
   - Go to **Settings** → **Time & Language** on your computer
   - Ensure "Set time automatically" is enabled
   - Try to sync time with server

4. **Clear Browser Cache**:
   - Press `Ctrl + Shift + Delete`
   - Clear "All time"
   - Reload the page

5. **Check Console Logs**:
   - All verification logs should appear in browser console
   - Report any error messages

## Quick Debug Script

You can paste this in your browser console to test TOTP verification manually:

```javascript
// Test if verification logic works
const secret = "YOUR_SECRET_KEY_HERE"; // Get from Firebase admin_settings/totp
const code = "123456"; // Get from authenticator app

console.log("Testing TOTP verification...");
console.log("Secret:", secret);
console.log("Code:", code);
```

---

**Need Help?** Check the browser console (F12) and terminal logs for detailed error information.
