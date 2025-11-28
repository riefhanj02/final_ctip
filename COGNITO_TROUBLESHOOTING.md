# Cognito Login Troubleshooting

## Current Issue
Login is failing with "An unknown error has occurred" - the error is coming from Amplify's signIn deserializer, which suggests a Cognito configuration issue.

## Required App Client Settings

Your Cognito App Client needs to have the correct authentication flows enabled:

### 1. Check App Client Authentication Flows

Go to AWS Console > Cognito > User Pools > Your Pool > App integration > App clients

**Required Settings:**
- ✅ **ALLOW_USER_PASSWORD_AUTH** - Must be enabled for username/password login
- ✅ **ALLOW_REFRESH_TOKEN_AUTH** - Should be enabled
- ❌ **ALLOW_USER_SRP_AUTH** - Can be disabled if you're only using password auth

### 2. Verify App Client Configuration

1. Go to your User Pool in AWS Console
2. Click on "App integration" tab
3. Click on your App Client (ID: `55f996relcqhob768bpvv7f6dn`)
4. Check "Authentication flows configuration"
5. Make sure **USER_PASSWORD_AUTH** is enabled

### 3. Check User Status

After registration, the user must verify their email:
1. Go to Cognito > User Pools > Your Pool > Users
2. Find your user by email
3. Check the "Status" column - it should be "CONFIRMED"
4. If it's "UNCONFIRMED", the user needs to verify their email

### 4. Test with AWS CLI

Test if authentication works at the Cognito level:

```bash
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id 55f996relcqhob768bpvv7f6dn \
  --auth-parameters USERNAME=your-email@example.com,PASSWORD=your-password \
  --region us-east-1
```

If this works, the issue is in the app. If it fails, the issue is in Cognito configuration.

## Common Issues

### Issue 1: USER_PASSWORD_AUTH not enabled
**Symptom:** "An unknown error has occurred" or validation errors
**Solution:** Enable USER_PASSWORD_AUTH in App Client settings

### Issue 2: User not confirmed
**Symptom:** "UserNotConfirmedException" or "User is not confirmed"
**Solution:** User must verify email after registration

### Issue 3: Wrong password
**Symptom:** "NotAuthorizedException" or "Incorrect username or password"
**Solution:** Check password is correct

### Issue 4: User doesn't exist
**Symptom:** "UserNotFoundException"
**Solution:** User needs to register first

## Next Steps

1. **Check App Client Auth Flows** - Make sure USER_PASSWORD_AUTH is enabled
2. **Verify User Status** - Make sure user is CONFIRMED
3. **Check Console Logs** - Look for detailed error messages
4. **Test with AWS CLI** - Verify Cognito works independently

