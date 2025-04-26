# CEMA Health Information System - Frontend
## Developed by Omar Juma
Next.js-based frontend for the CEMA Health Information System, built with TypeScript and TailwindCSS.

## Quick Start

1. Install dependencies:
```bash
npm install
```

NEXT_PUBLIC_BACKEND_URI=http://127.0.0.1:5000/api/v1

npm run dev

frontend_cema_health_info_sys/
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── clients/        # Client management pages
│   │   ├── programs/       # Program management pages
│   │   └── layout.tsx      # Root layout component
│   └── styles/            # Global styles
└── public/               # Static assets

## Features

### Authentication
- Login/Signup system
- Protected routes
- JWT-based authentication
- User context management

### Program Management
- View all health programs
- Create new programs
- Enroll clients in programs
- Program statistics

### Client Management
- Register new clients
- Search clients
- View client profiles
- Track program enrollments

## Available Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Dashboard | Authenticated |
| `/login` | Login page | Public |
| `/signup` | Admin registration | Public |
| `/clients` | Client list | Authenticated |
| `/clients/register` | New client registration | Authenticated |
| `/clients/profile/[id]` | Client profile view | Authenticated |
| `/programs` | Program list | Authenticated |
| `/programs/create` | Create new program | Authenticated |
| `/programs/[id]` | Program enrollment | Authenticated |

## Components

### NavBar
- Main navigation component
- User menu
- Dynamic navigation links

### Forms
- Login form
- Registration form
- Program creation form
- Client enrollment form

### Custom Hooks
- `useAuthCheck`: Authentication state management
- `useGetClients`: Client data fetching
- `useUserContext`: User context management

## Styling

The project uses:
- TailwindCSS for utility-first styling
- Material-UI components for complex UI elements
- Custom color schemes for program cards
- Responsive design patterns

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_BACKEND_URI`: Backend API endpoint

## Dependencies

Key dependencies:
- Next.js 15.3.1
- React 19.0.0
- Material-UI
- TailwindCSS
- React-Toastify
- JS-Cookie