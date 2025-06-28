# Receipt Generator - Full-Stack Application

## Overview

Receipt Generator is a full-stack web application that allows users to create, manage, and generate professional receipts for banking transactions and shopping orders. The application features a modern React frontend with Firebase authentication and a Node.js/Express backend with PostgreSQL database support.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, Vite for bundling
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage for file uploads
- **Styling**: Tailwind CSS with shadcn/ui components

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui for consistent UI components
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **API Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type checking
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations

### Database Schema
The application defines two main entities:
- **Users**: Authentication and user management
- **Receipts**: Storage for both banking and shopping receipt data with JSON fields for flexible data structures

### Authentication Flow
- Firebase Authentication handles user registration and login
- JWT tokens manage session state
- Protected routes ensure authenticated access to features

## Data Flow

1. **User Authentication**: Firebase handles login/signup with email/password
2. **Receipt Creation**: Users create receipts through form interfaces with real-time preview
3. **Data Persistence**: Receipt data is stored in PostgreSQL with optional file uploads to Firebase Storage
4. **PDF Generation**: Client-side PDF generation using html2pdf.js
5. **Receipt Management**: CRUD operations for managing saved receipts

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript
- **Component Library**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: html2pdf.js for client-side PDF creation
- **File Handling**: Firebase Storage for logo uploads

### Backend Dependencies
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod for schema validation
- **Session Management**: PostgreSQL session store
- **Development**: tsx for TypeScript execution

### Database Configuration
- **ORM**: Drizzle with PostgreSQL dialect
- **Migrations**: Managed through drizzle-kit
- **Connection**: Environment-based DATABASE_URL configuration

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Local PostgreSQL or cloud-hosted instance
- **Environment**: Development-specific configuration

### Production Build
- **Frontend**: Vite production build with optimization
- **Backend**: esbuild bundle for Node.js deployment
- **Assets**: Static file serving for production
- **Database**: Production PostgreSQL instance

### Build Process
1. Frontend compilation via Vite
2. Backend bundling with esbuild
3. Static asset optimization
4. Environment-specific configuration

The application supports both development and production deployments with appropriate tooling for each environment.

## Changelog
```
Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Complete receipt generator app built
  * Firebase Authentication with email/password
  * Banking receipt template (Kuda-style)
  * Shopping receipt template (Fresh Cart-style)
  * Real-time preview with logo upload
  * PDF generation using html2pdf.js
  * Firestore database for receipt storage
  * Netlify deployment configuration added
  * Fixed Firestore error handling and Dialog warnings
```

## Deployment Status
- ✅ Production-ready for Netlify deployment
- ✅ Environment variables configured for Firebase
- ✅ Build configuration optimized
- ✅ Client-side routing setup
- ✅ Error handling implemented

## User Preferences
```
Preferred communication style: Simple, everyday language.
```