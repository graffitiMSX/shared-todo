# Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All tests passing (`npm run test:run`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] No console.log statements in production code
- [ ] Environment variables properly set

### Security
- [ ] RLS policies enabled on all Supabase tables
- [ ] No hardcoded secrets or API keys
- [ ] HTTPS enforced
- [ ] Auth tokens handled securely
- [ ] Input validation in place

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] No memory leaks
- [ ] Lazy loading implemented

---

## Web Deployment (Vercel)

### Prerequisites
- Vercel account connected to repository
- Supabase project configured

### Environment Variables
Set these in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Deployment Steps
1. Push to main branch
2. Vercel automatically deploys
3. Verify deployment at production URL
4. Test critical flows

### Post-Deployment
- [ ] Verify landing page loads
- [ ] Test login/register flow
- [ ] Create and complete a todo
- [ ] Test notifications
- [ ] Check mobile responsiveness

---

## iOS Deployment (App Store)

### Prerequisites
- Apple Developer Account ($99/year)
- Xcode 15+ installed
- Valid signing certificates
- App Store Connect access

### App Configuration
Edit `ios/App/App/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>Shared Todo</string>
<key>CFBundleIdentifier</key>
<string>com.sharedtodo.app</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
```

### Build Steps
```bash
# Build for mobile
npm run build:mobile

# Sync to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### In Xcode
1. Select team for signing
2. Set deployment target (iOS 14.0+)
3. Product → Archive
4. Distribute to App Store Connect

### App Store Connect
1. Create new app
2. Upload build from Xcode
3. Add app information:
   - Description
   - Screenshots (6.7", 5.5")
   - Keywords
   - Support URL
   - Privacy Policy URL
4. Submit for review

### App Store Requirements
- [ ] App icon (1024x1024)
- [ ] Screenshots (all device sizes)
- [ ] App description
- [ ] Privacy policy URL
- [ ] Age rating
- [ ] Contact information

---

## Android Deployment (Play Store)

### Prerequisites
- Google Play Developer Account ($25 one-time)
- Android Studio installed
- Signing keystore created

### Create Signing Keystore
```bash
keytool -genkey -v -keystore shared-todo.keystore \
  -alias shared-todo \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

### App Configuration
Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        applicationId "com.sharedtodo.app"
        versionCode 1
        versionName "1.0.0"
        minSdkVersion 24
        targetSdkVersion 34
    }
    signingConfigs {
        release {
            storeFile file('shared-todo.keystore')
            storePassword 'your-password'
            keyAlias 'shared-todo'
            keyPassword 'your-password'
        }
    }
}
```

### Build Steps
```bash
# Build for mobile
npm run build:mobile

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

### In Android Studio
1. Build → Generate Signed Bundle/APK
2. Select Android App Bundle
3. Use release keystore
4. Build release bundle

### Play Console
1. Create new app
2. Upload AAB file
3. Add app information:
   - Description
   - Screenshots
   - Feature graphic (1024x500)
   - Privacy policy URL
4. Submit for review

### Play Store Requirements
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone, tablet)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy policy URL
- [ ] Content rating

---

## Supabase Production Setup

### Database
- [ ] Run migrations on production
- [ ] Verify RLS policies
- [ ] Set up database backups
- [ ] Configure connection pooling (if needed)

### Authentication
- [ ] Configure allowed redirect URLs
- [ ] Set up email templates
- [ ] Configure rate limiting
- [ ] Enable CAPTCHA (optional)

### Edge Functions (if used)
- [ ] Deploy functions
- [ ] Set environment variables
- [ ] Test function endpoints

---

## Monitoring Setup

### Error Tracking
- [ ] Set up error reporting (Sentry, etc.)
- [ ] Configure alert thresholds

### Analytics
- [ ] Set up analytics (if required)
- [ ] Configure event tracking

### Performance
- [ ] Set up performance monitoring
- [ ] Configure slow query alerts (Supabase)

---

## Rollback Plan

### Web
1. Revert to previous deployment in Vercel
2. Or push revert commit to main

### Mobile
1. Submit updated build with fix
2. Use staged rollout in stores
3. Consider hotfix vs full update

### Database
1. Test migrations in staging first
2. Keep migration scripts reversible
3. Have backup before major migrations

---

## Post-Launch

### Week 1
- [ ] Monitor error rates
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately
- [ ] Check app store reviews

### Month 1
- [ ] Analyze usage patterns
- [ ] Identify performance bottlenecks
- [ ] Plan next feature iteration
- [ ] Update documentation

---

## Quick Commands

```bash
# Run all checks before deployment
npm run lint && npm run test:run && npm run build

# Build and sync mobile
npm run build:mobile && npx cap sync

# Open native IDEs
npx cap open ios
npx cap open android
```
