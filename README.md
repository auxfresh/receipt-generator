# Receipt Generator

A modern React web application for creating professional banking and shopping receipts with Firebase authentication and storage.

## Features

- **Firebase Authentication** - Secure email/password login and registration
- **Receipt Creation** - Generate banking transaction and shopping purchase receipts
- **Real-time Preview** - See your receipt as you fill out the form
- **Logo Upload** - Add custom business logos via Firebase Storage
- **PDF Export** - Download receipts as PDF files using html2pdf.js
- **Receipt Management** - Save, view, edit, and delete receipts in Firestore
- **Responsive Design** - Modern, colorful UI that works on all devices

## Templates

The app creates receipts based on authentic templates:
- **Banking Receipts** - Similar to Kuda bank transaction receipts
- **Shopping Receipts** - Similar to Fresh Cart order receipts

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: html2pdf.js
- **Routing**: wouter (lightweight React router)

## Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set the build command: `npx vite build`
3. Set the publish directory: `dist`
4. Add environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_PROJECT_ID`

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Enable Storage for file uploads
5. Add your domain to authorized domains in Authentication settings

## Environment Variables

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## Local Development

```bash
npm install
npm run dev
```

The app will be available at http://localhost:5000

## File Structure

```
├── client/src/
│   ├── components/     # UI components
│   ├── pages/          # Route components
│   ├── lib/            # Firebase and utility functions
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── netlify.toml        # Netlify deployment config
└── _redirects         # Client-side routing support
```

## License

MIT License