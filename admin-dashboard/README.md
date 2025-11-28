# Admin Dashboard

Web-based admin dashboard for the Plant Management System. This dashboard provides admin-only access to manage plant sightings, view statistics, and manage users.

## Features

- 🔐 Admin authentication using AWS Cognito
- 🗺️ Interactive map view with all plant sightings
- 📊 Statistics dashboard (coming soon)
- 👥 User management (coming soon)
- ⚙️ System settings (coming soon)

## Setup

1. Install dependencies:
```bash
cd admin-dashboard
npm install
```

2. Configure your API endpoint (optional):
Create a `.env` file in the `admin-dashboard` directory:
```
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/stage
```

3. Start the development server:
```bash
npm start
```

The dashboard will open at `http://localhost:3000`

## Admin Access

To access the admin dashboard:

1. You need a user account in AWS Cognito
2. The user must be in the `admin` group (or have `custom:isAdmin` attribute set to `true`)
3. Login with your admin credentials

### Setting up Admin User in Cognito

1. Go to AWS Console > Cognito > User Pools
2. Select your User Pool
3. Go to "Users" tab
4. Find or create your admin user
5. Add the user to the `admin` group:
   - Go to "Groups" tab
   - Create a group named `admin` (if it doesn't exist)
   - Add your user to this group

Alternatively, you can set a custom attribute:
- Go to User Attributes
- Add `custom:isAdmin` attribute with value `true`

## Deployment

### Option 1: AWS Amplify (Recommended)

1. Install AWS Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Initialize Amplify:
```bash
amplify init
```

3. Add hosting:
```bash
amplify add hosting
```

4. Deploy:
```bash
amplify publish
```

### Option 2: AWS S3 + CloudFront

1. Build the app:
```bash
npm run build
```

2. Upload the `build` folder to an S3 bucket
3. Configure CloudFront to serve from S3
4. Set up proper CORS and security headers

### Option 3: Vercel/Netlify

1. Build the app:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Netlify/Vercel for automatic deployments.

## Project Structure

```
admin-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminMap.js       # Main admin map view
│   │   ├── Dashboard.js      # Dashboard layout
│   │   └── Login.js          # Login page
│   ├── services/
│   │   ├── authService.js    # Cognito authentication
│   │   └── apiService.js     # API calls
│   ├── config/
│   │   └── config.js         # Configuration
│   ├── App.js               # Main app component
│   └── index.js             # Entry point
├── package.json
└── README.md
```

## Notes

- The admin dashboard uses the same Cognito User Pool as your mobile app
- Only users with admin privileges can access the dashboard
- The map view shows all plant sightings with filtering options
- API endpoints should be configured in `src/config/config.js`

