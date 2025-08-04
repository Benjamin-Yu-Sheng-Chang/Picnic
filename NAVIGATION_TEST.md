# 🧭 Navigation Testing Guide

## Test the Routing System

### 1. **Authentication Flow**

- [ ] Visit `http://localhost:5173/` → Should redirect to `/login`
- [ ] Create a new account → Should redirect to `/calendar`
- [ ] Sign out → Should redirect to `/login`
- [ ] Sign in with existing account → Should redirect to `/calendar`

### 2. **Protected Routes**

- [ ] Try accessing `/calendar` while logged out → Should redirect to `/login`
- [ ] Try accessing `/settings` while logged out → Should redirect to `/login`
- [ ] Login then access `/calendar` → Should work
- [ ] Login then access `/settings` → Should work

### 3. **Navigation Between Pages**

- [ ] From `/calendar` click "Settings" → Should go to `/settings`
- [ ] From `/settings` click "Calendar" → Should go to `/calendar`
- [ ] Use browser back button → Should work properly
- [ ] Use browser forward button → Should work properly

### 4. **URL Behavior**

- [ ] Bookmark `/calendar` while logged in → Should work when revisited
- [ ] Refresh page on `/calendar` → Should stay on calendar
- [ ] Refresh page on `/settings` → Should stay on settings
- [ ] Direct URL to `/login` while logged in → Should redirect to `/calendar`

### 5. **Error Cases**

- [ ] Visit non-existent route like `/nonexistent` → Should redirect appropriately
- [ ] Invalid URLs → Should handle gracefully

## 🎯 Expected Behavior

| Route          | Not Authenticated | Authenticated |
| -------------- | ----------------- | ------------- |
| `/`            | → `/login`        | → `/calendar` |
| `/login`       | Show login form   | → `/calendar` |
| `/calendar`    | → `/login`        | Show calendar |
| `/settings`    | → `/login`        | Show settings |
| `/*` (invalid) | → `/login`        | → `/calendar` |

## 🔧 Debug Tips

- Open browser DevTools Console to see debug logs
- Look for `🔐 Auth State:` messages
- Check `🔄 Redirecting to...` messages
- Verify authentication status in header
