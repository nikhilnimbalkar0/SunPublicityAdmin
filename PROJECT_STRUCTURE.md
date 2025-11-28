# Project Structure

```
hoarding-management-dashboard/
│
├── public/                          # Public assets
│   └── vite.svg                     # Vite logo
│
├── src/                             # Source code
│   ├── components/                  # Reusable components
│   │   ├── Card.jsx                # Card wrapper component
│   │   ├── Layout.jsx              # Main layout wrapper
│   │   ├── LoadingSpinner.jsx      # Loading spinner component
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── ProtectedRoute.jsx      # Route protection HOC
│   │   ├── Sidebar.jsx             # Side navigation menu
│   │   └── StatCard.jsx            # Statistics card component
│   │
│   ├── config/                      # Configuration files
│   │   └── firebase.js             # Firebase configuration
│   │
│   ├── contexts/                    # React Context providers
│   │   ├── AuthContext.jsx         # Authentication context
│   │   └── ThemeContext.jsx        # Theme (dark/light) context
│   │
│   ├── pages/                       # Page components
│   │   ├── Dashboard.jsx           # Dashboard overview page
│   │   ├── Login.jsx               # Login page
│   │   ├── ManageBookings.jsx      # Bookings management page
│   │   ├── ManageHoardings.jsx     # Hoardings management page
│   │   ├── ManageUsers.jsx         # Users management page
│   │   ├── Reports.jsx             # Reports and analytics page
│   │   └── Settings.jsx            # Settings page
│   │
│   ├── App.jsx                      # Main app component with routing
│   ├── index.css                    # Global styles with Tailwind
│   └── main.jsx                     # Application entry point
│
├── .env.example                     # Environment variables template
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore                       # Git ignore rules
├── FEATURES.md                      # Feature documentation
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── PROJECT_STRUCTURE.md             # This file
├── README.md                        # Project overview
├── SETUP_GUIDE.md                   # Setup instructions
├── tailwind.config.js               # Tailwind CSS configuration
└── vite.config.js                   # Vite configuration
```

## Directory Descriptions

### `/src/components`
Contains all reusable UI components that are used across multiple pages.

- **Card.jsx**: Generic card container with consistent styling
- **Layout.jsx**: Main layout structure with sidebar and navbar
- **LoadingSpinner.jsx**: Animated loading indicator
- **Navbar.jsx**: Top navigation bar with user menu and theme toggle
- **ProtectedRoute.jsx**: Higher-order component for route protection
- **Sidebar.jsx**: Side navigation menu with responsive behavior
- **StatCard.jsx**: Dashboard statistics card with icon and trend

### `/src/config`
Configuration files for external services.

- **firebase.js**: Firebase initialization and service exports

### `/src/contexts`
React Context providers for global state management.

- **AuthContext.jsx**: Manages authentication state and user session
- **ThemeContext.jsx**: Manages dark/light theme preference

### `/src/pages`
Main page components corresponding to different routes.

- **Dashboard.jsx**: Overview page with statistics and charts
- **Login.jsx**: Authentication page
- **ManageBookings.jsx**: Booking management with CRUD operations
- **ManageHoardings.jsx**: Hoarding inventory management with image upload
- **ManageUsers.jsx**: User management with role assignment
- **Reports.jsx**: Analytics and reporting with data export
- **Settings.jsx**: User profile and application settings

## Key Files

### Configuration Files

- **package.json**: Project dependencies and npm scripts
- **vite.config.js**: Vite build tool configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins configuration
- **.eslintrc.cjs**: Code linting rules
- **.env.example**: Template for environment variables

### Documentation Files

- **README.md**: Project overview and quick start
- **SETUP_GUIDE.md**: Detailed setup instructions
- **FEATURES.md**: Complete feature list
- **PROJECT_STRUCTURE.md**: This file

## Component Hierarchy

```
App
├── ThemeProvider
│   └── AuthProvider
│       └── Router
│           ├── Login (public)
│           └── ProtectedRoute
│               └── Layout
│                   ├── Sidebar
│                   ├── Navbar
│                   └── Outlet
│                       ├── Dashboard
│                       ├── ManageUsers
│                       ├── ManageHoardings
│                       ├── ManageBookings
│                       ├── Reports
│                       └── Settings
```

## Data Flow

```
Firebase (Backend)
    ↓
Config (firebase.js)
    ↓
Contexts (AuthContext, ThemeContext)
    ↓
Pages (Dashboard, ManageUsers, etc.)
    ↓
Components (Card, StatCard, etc.)
```

## Routing Structure

```
/                           → Redirect to /admin/dashboard
/login                      → Login page (public)
/admin                      → Redirect to /admin/dashboard
/admin/dashboard            → Dashboard (protected)
/admin/users                → Manage Users (protected)
/admin/hoardings            → Manage Hoardings (protected)
/admin/bookings             → Manage Bookings (protected)
/admin/reports              → Reports (protected)
/admin/settings             → Settings (protected)
*                           → Redirect to /admin/dashboard
```

## State Management

### Global State (Context API)
- **AuthContext**: User authentication, login/logout, user profile
- **ThemeContext**: Dark/light mode preference

### Local State (useState)
- Component-specific data
- Form inputs
- UI state (modals, dropdowns)

### Server State (Firebase)
- Users collection
- Hoardings collection
- Bookings collection
- Real-time synchronization

## Styling Architecture

### Tailwind CSS Utility Classes
- Responsive design with breakpoints
- Dark mode support with `dark:` prefix
- Custom color palette in tailwind.config.js
- Component-specific styles in JSX

### CSS Files
- **index.css**: Global styles, Tailwind directives, custom scrollbar

## Build Process

```
Source Files (src/)
    ↓
Vite (bundler)
    ↓
PostCSS (processes Tailwind)
    ↓
ESLint (linting)
    ↓
Build Output (dist/)
```

## Development Workflow

1. **Start Development Server**: `npm run dev`
2. **Make Changes**: Edit files in `/src`
3. **Hot Reload**: Changes reflect immediately
4. **Build**: `npm run build`
5. **Preview**: `npm run preview`
6. **Deploy**: Upload `dist/` folder

## Best Practices Followed

- ✅ Component-based architecture
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Context for global state
- ✅ Protected routes
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Error handling
- ✅ Loading states
- ✅ Clean code structure
- ✅ Consistent naming conventions
- ✅ Comprehensive documentation

---
**Version:** 1.0  
**Last Updated:** November 2025
