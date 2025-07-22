# Twitter App - Project Memory

## Project Overview
A React-based Twitter clone featuring user authentication, post creation, feeds, and profile management. Built with Vite, React 19, and modern CSS.

## Development Commands
- **Dev server**: `npm run dev` (usually runs on localhost:5173 or 5174)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Preview**: `npm run preview`

## Code Style & Conventions
- Use 2-space indentation (from user's global preferences)
- Prefer const/let over var
- Always use semicolons
- Use template literals for string interpolation
- Prefer arrow functions for short functions
- JSX components use PascalCase
- CSS classes use kebab-case

## Project Structure
```
src/
├── components/
│   ├── Auth/ (LoginForm, SignupForm)
│   ├── Post/ (CreatePost, PostCard, Feed)
│   └── Profile/ (ProfileHeader, EditProfileModal)
├── contexts/ (AuthContext, PostContext)
├── pages/ (AuthPage, HomePage)
├── styles/ (globals.css)
└── utils/ (helpers.js, storage.js)
```

## Architecture Patterns
- **Context API**: Used for global state management (auth, posts)
- **Component composition**: Reusable UI components
- **CSS Grid Layout**: 3-column Twitter-like layout (sidebar-left, main-content, sidebar-right)
- **Responsive design**: Mobile-first with breakpoints at 640px and 768px

## UI/UX Guidelines
- Follow Twitter-like design patterns
- Use CSS custom properties for theming (--primary-color, --text-primary, etc.)
- Sticky positioning for headers and sidebars
- Card-based layout for posts and components
- Responsive grid that collapses to single column on mobile
- Twitter should use a modern blue theme and clean typography

## Key Dependencies
- **React 19**: Latest React with modern features
- **Lucide React**: Icon library for consistent iconography
- **Date-fns**: Date formatting and manipulation
- **Vite**: Fast build tool and dev server

## Testing & Quality
- ESLint configured with React-specific rules
- Focus on testing core functionality first
- Test on latest Chrome version
- Validate responsive behavior across breakpoints

## Common Issues & Solutions
- **Port conflicts**: Dev server will auto-increment port (5173 → 5174)
- **Layout issues**: Use browser dev tools to debug CSS Grid
- **Context updates**: Ensure components are wrapped in proper providers

## Recent Updates
- Implemented full-width Twitter-like layout with proper sidebar structure
- Added sticky headers and responsive design
- Updated global CSS variables for consistent theming

## Development Notes
- Use context7 mcp server for any libraries that will be using before generating any code