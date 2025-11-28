# 🔧 Fix API Gateway for Heatmap Endpoint

## Problem

**Error:** `Endpoint not found` for `/plants/heatmap?admin=1`

**Root Cause:** API Gateway `/{proxy+}` resource might not be configured correctly to pass the full path to Lambda, OR the Lambda path matching logic needs adjustment.

---

## Solution Options

### Option 1: Fix API Gateway `/{proxy+}` Configuration (Recommended)

If you're using `/{proxy+}` resource, ensure it passes the full path correctly:

1. **Go to API Gateway Console**
   - URL: https://console.aws.amazon.com/apigateway/
   - Find your API: `sj2osq50u1.execute-api.us-east-1.amazonaws.com`

2. **Check `/{proxy+}` Resource**
   - Click on **Resources** → **{proxy+}**
   - Verify **ANY** method exists (or create it if missing)
   - Click on the method (e.g., **ANY**)

3. **Check Integration Settings**
   - **Integration type:** Lambda Function
   - **Lambda Function:** Your `plants.js` function name
   - **Use Lambda Proxy integration:** ✅ **MUST BE CHECKED**
   - This ensures the full path is passed to Lambda

4. **Check Path Mapping (if not using proxy)**
   - If you see **Path override** or **Mapping template**, remove it
   - Lambda should receive the full path in `event.path`

5. **Deploy API**
   - Click **Actions** → **Deploy API**
   - Select your stage (e.g., `demo`)
   - Click **Deploy**

---

### Option 2: Create Dedicated `/plants/heatmap` Route

If `/{proxy+}` isn't working, create a specific route:

1. **Create `/plants` Resource** (if doesn't exist)
   - Resources → **Actions** → **Create Resource**
   - Resource Path: `plants`
   - Click **Create Resource**

2. **Create `/heatmap` Resource**
   - Click on `/plants` resource
   - **Actions** → **Create Resource**
   - Resource Path: `heatmap`
   - Click **Create Resource**

3. **Create GET Method**
   - Click on `/heatmap` resource
   - **Actions** → **Create Method** → Select **GET** → Click checkmark
   - **Integration type:** Lambda Function
   - **Lambda Function:** Your `plants.js` function name
   - **Use Lambda Proxy integration:** ✅ Check this
   - Click **Save** → **OK** (if prompted about permissions)

4. **Enable CORS** (if needed)
   - Click on **GET** method
   - **Actions** → **Enable CORS**
   - Click **Enable CORS and replace existing CORS headers**

5. **Deploy API**
   - **Actions** → **Deploy API**
   - Select stage: `demo`
   - Click **Deploy**

---

### Option 3: Fix Lambda Path Matching

If API Gateway is passing the path correctly but Lambda isn't matching, update the Lambda:

**Current code in `plants.js`:**
```javascript
if (method === "GET" && path.includes("/heatmap")) {
  return await getHeatmapData(queryStringParameters, isAdmin);
}
```

**This should work**, but let's make it more robust:

```javascript
// Handle heatmap - check multiple path formats
const isHeatmapPath = path.includes("/heatmap") || 
                      path.endsWith("/heatmap") ||
                      event.rawPath?.includes("/heatmap") ||
                      event.resource?.includes("/heatmap");

if (method === "GET" && isHeatmapPath) {
  return await getHeatmapData(queryStringParameters, isAdmin);
}
```

---

## Testing

### Test 1: Check What Lambda Receives

1. **Lambda Console** → Your `plants.js` function
2. **Monitor** → **CloudWatch Logs**
3. **Click "Show Heatmap"** in your app
4. **Check logs** - Look for:
   ```
   Plants Lambda Event: {
     "path": "/plants/heatmap",
     "httpMethod": "GET",
     ...
   }
   ```

**Expected:** `path` should be `/plants/heatmap` or `/heatmap`

**If path is wrong:** API Gateway isn't passing it correctly → Fix Option 1 or 2

**If path is correct but still 404:** Lambda path matching issue → Fix Option 3

---

### Test 2: Test Lambda Directly

1. **Lambda Console** → Test tab
2. **Create test event:**
   ```json
   {
     "httpMethod": "GET",
     "path": "/plants/heatmap",
     "queryStringParameters": {
       "admin": "1"
     },
     "pathParameters": {
       "proxy": "plants/heatmap"
     }
   }
   ```
3. **Run test**
4. **Expected:** Should return `{ sightings: [...] }`

**If this works:** API Gateway routing issue → Fix Option 1 or 2

**If this fails:** Lambda code issue → Fix Option 3

---

### Test 3: Test API Gateway Endpoint

**In browser console or Postman:**

```javascript
fetch('https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo/plants/heatmap?admin=1')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Expected:** Should return JSON with `sightings` array

**If 404:** Route doesn't exist → Create route (Option 2)

**If 500:** Lambda error → Check Lambda logs

**If CORS error:** Enable CORS on the route

---

## Quick Fix Checklist

- [ ] Check `/{proxy+}` has **Lambda Proxy integration** enabled
- [ ] Verify Lambda function name is correct
- [ ] Deploy API Gateway changes
- [ ] Test Lambda directly (should work)
- [ ] Test API Gateway endpoint (should work)
- [ ] Check CloudWatch logs for path received
- [ ] Update Lambda path matching if needed (Option 3)

---

## Most Common Issue

**Problem:** `/{proxy+}` resource doesn't have **"Use Lambda Proxy integration"** checked

**Fix:**
1. API Gateway → Resources → `/{proxy+}` → Method (ANY/GET)
2. Check **"Use Lambda Proxy integration"** ✅
3. Save → Deploy API

---

## After Fixing

1. **Wait 1-2 minutes** for API Gateway to update
2. **Clear browser cache**
3. **Test heatmap button** - should work now!

