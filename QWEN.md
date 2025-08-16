# Twitter App - Project Context

## Project Overview
This is a React-based Twitter clone application built with Vite. The app features a modern UI with glassmorphism effects, dark/light mode support, and core Twitter functionality including posting, liking, retweeting, and quoting tweets. The application uses local storage for data persistence and implements a sophisticated theming system with CSS variables.

## Key Technologies
- **React 19** - Core UI library
- **Vite 7** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Component library built on Tailwind
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Local Storage** - Data persistence

## Project Structure
```
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── Auth/         # Authentication components
│   ├── Post/         # Post-related components
│   ├── Profile/      # Profile components
│   ├── UI/           # Generic UI components
│   └── ...           # Other component categories
├── contexts/         # React context providers
│   ├── AuthContext.jsx
│   └── PostContext.jsx
├── lib/              # Utility libraries
├── pages/            # Page components
│   ├── AuthPage.jsx
│   └── HomePage.jsx
├── styles/           # CSS files
├── utils/            # Helper functions
└── ...               # Main entry points (App.jsx, main.jsx)
```

## Core Features
1. **Authentication System** - Login/signup with local storage persistence
2. **Post Creation** - Create text posts with image attachments (280 char limit)
3. **Feed Display** - Timeline of posts with animations
4. **Social Interactions** - Like, retweet, and quote tweet functionality
5. **Mention System** - @username mentions with suggestions
6. **Theming** - Dark/light mode with glassmorphism effects
7. **Responsive Design** - Mobile-friendly layout

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Styling System
The application uses a sophisticated CSS variable-based theming system with:
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations and transitions
- Responsive design
- Dark/light mode support

## Data Management
- **Local Storage** - All data (users, posts) is persisted in browser local storage
- **React Context** - State management for authentication and posts
- **Reducers** - Complex state updates for auth and posts

## Component Architecture
- **Context Providers** - AuthProvider, PostProvider for global state
- **Page Components** - AuthPage, HomePage as top-level views
- **Feature Components** - CreatePost, Feed, PostCard for specific functionality
- **UI Components** - Reusable elements like buttons, inputs, cards

## Backlog Features
1. Add dark mode toggle to header
2. Implement @username mentions in tweets using ShadCN
3. Add trending hashtags sidebar with live counts