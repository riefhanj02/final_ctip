# 🔧 Complete API Gateway Setup Guide for Heatmap

## Current Issue

**Error:** `Endpoint not found` for `/plants/heatmap?admin=1`

**Your Setup:** Using `/{proxy+}` resource that routes to `plants.js` Lambda

---

## ✅ Solution: Fix `/{proxy+}` Configuration

### Step 1: Check API Gateway Configuration

1. **Go to API Gateway Console**
   - https://console.aws.amazon.com/apigateway/
   - Find API: `sj2osq50u1.execute-api.us-east-1.amazonaws.com`

2. **Check `/{proxy+}` Resource**
   - Click **Resources** → Find `/{proxy+}` resource
   - Click on it

3. **Check Method (ANY or GET)**
   - You should see a method like **ANY** or **GET**
   - Click on the method

4. **Verify Integration Settings**
   - **Integration type:** Lambda Function ✅
   - **Lambda Function:** Your `plants.js` function name ✅
   - **Use Lambda Proxy integration:** ✅ **MUST BE CHECKED** ⚠️
   - **Path override:** (should be empty or `{proxy}`)

5. **If "Use Lambda Proxy integration" is NOT checked:**
   - ✅ Check the box
   - Click **Save**
   - Click **OK** when prompted about permissions

6. **Deploy API**
   - Click **Actions** → **Deploy API**
   - Select stage: `demo`
   - Click **Deploy**

---

## ✅ Alternative: Create Specific Route (If Proxy Doesn't Work)

If `/{proxy+}` still doesn't work, create a dedicated route:

### Step 1: Create `/plants` Resource

1. **Resources** → **Actions** → **Create Resource**
2. **Resource Path:** `plants`
3. ✅ Check **Configure as proxy resource** (optional)
4. Click **Create Resource**

### Step 2: Create `/heatmap` Resource

1. Click on `/plants` resource
2. **Actions** → **Create Resource**
3. **Resource Path:** `heatmap`
4. Click **Create Resource**

### Step 3: Create GET Method

1. Click on `/heatmap` resource
2. **Actions** → **Create Method** → Select **GET** → Click ✓
3. **Integration type:** Lambda Function
4. **Lambda Function:** Your `plants.js` function name
5. ✅ **Use Lambda Proxy integration** (MUST CHECK)
6. Click **Save** → **OK**

### Step 4: Enable CORS

1. Click on **GET** method
2. **Actions** → **Enable CORS**
3. Click **Enable CORS and replace existing CORS headers**

### Step 5: Deploy

1. **Actions** → **Deploy API**
2. Select stage: `demo`
3. Click **Deploy**

---

## 🧪 Testing

### Test 1: Check Lambda Logs

1. **Lambda Console** → Your `plants.js` function
2. **Monitor** → **CloudWatch Logs**
3. Click **"Show Heatmap"** in your app
4. **Check latest log entry** - Look for:
   ```
   [plants.js] Method: GET, Path: /plants/heatmap
   ```

**Expected Path Formats:**
- `/plants/heatmap` ✅
- `/heatmap` ✅
- `plants/heatmap` ✅ (from proxy)

**If path is wrong:** API Gateway isn't passing it correctly

---

### Test 2: Test API Gateway Directly

**In browser console:**

```javascript
fetch('https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo/plants/heatmap?admin=1')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Success:', data);
    console.log('Sightings count:', data.sightings?.length || 0);
  })
  .catch(err => console.error('❌ Error:', err));
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "body": "{\"sightings\":[...]}"
}
```

**If 404:** Route doesn't exist → Create route (see Alternative above)

**If 500:** Lambda error → Check Lambda logs

---

### Test 3: Test Lambda Directly

1. **Lambda Console** → Your `plants.js` function
2. **Test** tab
3. **Create test event:**

```json
{
  "httpMethod": "GET",
  "path": "/plants/heatmap",
  "rawPath": "/plants/heatmap",
  "queryStringParameters": {
    "admin": "1"
  },
  "pathParameters": {
    "proxy": "plants/heatmap"
  }
}
```

4. **Run test**

**Expected:** Should return `{ sightings: [...] }`

**If this works:** API Gateway routing issue → Fix API Gateway

**If this fails:** Lambda code issue → Check Lambda logs

---

## 🔍 Debugging Checklist

- [ ] `/{proxy+}` has **Lambda Proxy integration** enabled ✅
- [ ] Lambda function name is correct
- [ ] API Gateway is deployed to `demo` stage
- [ ] Lambda has correct environment variables (`PLANTS_TABLE = PlantRecords`)
- [ ] Lambda has DynamoDB permissions
- [ ] Test Lambda directly (should work)
- [ ] Test API Gateway endpoint (should work)
- [ ] Check CloudWatch logs for path received

---

## 📝 Lambda Code Updates (Already Applied)

I've updated `lambda/plants.js` to handle multiple path formats:

```javascript
// Now handles:
// - /plants/heatmap
// - /heatmap
// - plants/heatmap (from proxy)
// - event.rawPath
// - event.resource
// - pathParameters.proxy
```

**You need to:**
1. **Redeploy Lambda** with updated code
2. **Fix API Gateway** configuration (see above)
3. **Deploy API Gateway** changes

---

## 🚀 Quick Fix Steps

1. ✅ **Update Lambda** - Code already updated, just redeploy
2. ✅ **Check API Gateway** - Ensure "Lambda Proxy integration" is enabled
3. ✅ **Deploy API Gateway** - Deploy to `demo` stage
4. ✅ **Test** - Use browser console test (see Test 2)
5. ✅ **Wait 1-2 minutes** - API Gateway changes take time
6. ✅ **Clear browser cache** - Hard refresh (Ctrl+Shift+R)

---

## Most Common Issue

**Problem:** `/{proxy+}` doesn't have **"Use Lambda Proxy integration"** checked

**Fix:**
1. API Gateway → Resources → `/{proxy+}` → Method
2. ✅ Check **"Use Lambda Proxy integration"**
3. Save → Deploy API

**This is the #1 cause of 404 errors with proxy resources!**

