# Project: Clean Architecture Next.js Template

## Overview
A Clean Architecture Next.js application with TypeScript, featuring authentication (register/login) with refresh token management stored in HTTP-only cookies.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: shadcn/ui
- **Icons**: lucide-react
- **HTTP Client**: Axios
- **Server State**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Theme**: next-themes (light/dark/system)
- **Unit Testing**: Vitest + Testing Library
- **E2E Testing**: Playwright
- **AI SDK**: @google/generative-ai (for Gemini)

## Architecture

### Clean Architecture Layers
```
src/
├── domain/           # Enterprise Business Rules
│   ├── models/       # Domain entities and types
│   └── interfaces/   # Repository interfaces (contracts)
│
├── application/      # Application Business Rules
│   ├── use-cases/    # Application-specific business rules
│   └── dto/          # Data Transfer Objects
│
├── infrastructure/   # Frameworks & Drivers
│   ├── api/          # API client configurations
│   ├── repositories/ # Repository implementations
│   └── services/     # External services
│
├── presentation/     # Interface Adapters
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── providers/    # Context providers
│   └── utils/        # UI utilities
│
└── app/              # Next.js App Router pages
    ├── (auth)/       # Auth route group (login, register)
    ├── (dashboard)/  # Dashboard route group (with sidebar)
    ├── api/          # API routes (mock endpoints)
    └── layout.tsx    # Root layout
```

### Dependency Rule
Dependencies point inward: `app → presentation → application → domain`
Inner layers know nothing about outer layers.

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Types/Models**: PascalCase (e.g., `User.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **API Routes**: kebab-case in folders

### Code
- **Interfaces**: Prefix with `I` (e.g., `IAuthRepository`)
- **Types**: PascalCase (e.g., `LoginCredentials`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Functions**: camelCase, verb-first (e.g., `getUserById`)

## Code Quality Rules

### Component Guidelines
- Max 150 lines per component file
- Extract logic into custom hooks
- Use composition over inheritance
- Props interfaces defined above component

### File Organization
- One component per file
- Co-locate related files (component + hook + types)
- Index files for clean exports

### Testing
- Unit tests for domain logic
- Integration tests for API routes
- Component tests for UI

## Authentication Flow

### Tokens
- **Access Token**: Short-lived, stored in memory
- **Refresh Token**: Long-lived, stored in HTTP-only cookie

### Flow
1. User logs in with credentials
2. Server returns access + refresh tokens
3. Access token stored in memory (React state/context)
4. Refresh token set as HTTP-only cookie
5. On 401, automatically refresh using cookie
6. On refresh failure, redirect to login

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User
- `PUT /api/user/profile` - Update profile (firstName, lastName, email)
- `PUT /api/user/password` - Change password
- `PUT /api/user/preferences` - Update preferences (language, dateFormat, timeFormat, theme)
- `PUT /api/user/notifications` - Update notification settings

### AI Chat
- `POST /api/chat` - Send message with streaming response (SSE)
- `GET /api/chat/providers` - Get available AI providers and configuration status

### Image Generation
- `POST /api/image` - Generate image from prompt (JSON response)
- `GET /api/image/providers` - Get available image providers and configuration status

### Text-to-Speech
- `POST /api/tts` - Generate speech from text (returns audio base64)
- `GET /api/tts/providers` - Get available TTS providers and configuration status

### Swedish APIs Explorer
- `GET /api/swedish-apis` - Get available Swedish APIs and endpoints
- `POST /api/swedish-apis/execute` - Execute request through server proxy

## Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# AI Provider API Keys (configure at least one for AI Chat)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
MISTRAL_API_KEY=
AI_PROVIDER=        # Optional: force specific provider

# TTS (Text-to-Speech)
ELEVENLABS_API_KEY=

# Swedish APIs
TRAFIKVERKET_API_KEY=  # Optional: for Trafikverket traffic data
GOTEBORG_API_KEY=      # Optional: for Göteborg Stad city data
```

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Unit tests (watch mode)
npm run test:run     # Unit tests (single run)
npm run test:e2e     # E2E tests (headless)
npm run test:e2e:ui  # E2E tests (interactive)
```

### Git Workflow
Use `/project:github-push` slash command for committing and pushing changes.

---

## Development Workflow (IMPORTANT)

### Feature Implementation Checklist

When implementing a new feature, follow this order:

#### 1. Domain Layer
- [ ] Add entities to `src/domain/models/`
- [ ] Add repository interfaces to `src/domain/interfaces/`
- [ ] Update `src/domain/README.md` if new patterns introduced

#### 2. Application Layer
- [ ] Add DTOs to `src/application/dto/`
- [ ] Add use cases to `src/application/use-cases/` (if needed)
- [ ] Update `src/application/README.md` if new patterns introduced

#### 3. Infrastructure Layer
- [ ] Implement repositories in `src/infrastructure/repositories/`
- [ ] Add API client methods if needed
- [ ] Update `src/infrastructure/README.md` if new patterns introduced

#### 4. Presentation Layer
- [ ] Create hooks in `src/presentation/hooks/`
- [ ] Create components in `src/presentation/components/`
- [ ] Add validation schemas to `src/presentation/utils/`
- [ ] Update `src/presentation/README.md` if new patterns introduced

#### 5. App Layer
- [ ] Add pages to `src/app/`
- [ ] Add API routes to `src/app/api/`
- [ ] Update `src/app/README.md` if new patterns introduced

#### 6. Documentation (MANDATORY)
After completing a feature, ALWAYS update:
- [ ] `docs/features/{feature-name}/developer.md` - Technical implementation
- [ ] `docs/features/{feature-name}/user.md` - User perspective
- [ ] `docs/domain-models.md` - If new entities added
- [ ] `docs/architecture.md` - If new flows added
- [ ] Layer README files - If patterns changed
- [ ] This file's "Current Features" section

#### 7. Quality Assurance
- [ ] Run `npm run lint` - Fix any issues
- [ ] Run `npm run build` - Ensure build passes
- [ ] Test the feature manually
- [ ] Run `npm run test` - If tests exist

### Post-Feature Documentation Template

For each new feature, create `docs/features/{feature-name}/`:

```markdown
# {Feature Name} - Developer Documentation

## Overview
Brief description of what this feature does.

## Architecture
Which layers are involved and how they connect.

## Files Created/Modified
List of all files with brief descriptions.

## API Endpoints (if applicable)
Request/response formats.

## Flow Diagram
ASCII diagram showing the data flow.

## Testing
How to test this feature.
```

```markdown
# {Feature Name} - User Documentation

## Overview
What this feature allows users to do.

## How to Use
Step-by-step instructions.

## UI Screenshots/Descriptions
What the user sees.

## Error Handling
Common errors and solutions.
```

---

## Current Features
- [x] Project setup
- [x] Clean Architecture structure
- [x] Authentication (Register/Login)
- [x] Refresh token in cookies
- [x] Comprehensive documentation
- [x] Sidebar navigation
- [x] Theme switching (light/dark/system)
- [x] Settings with sidebar navigation
  - [x] Account settings (edit profile)
  - [x] Notification preferences
  - [x] Appearance (theme, language, date/time format)
  - [x] Security (change password)
- [x] Unit tests (Vitest)
- [x] E2E tests (Playwright)
- [x] AI Chat with multiple providers
  - [x] Anthropic Claude support
  - [x] OpenAI ChatGPT support
  - [x] Google Gemini support
  - [x] Mistral AI support
  - [x] Streaming responses (SSE)
  - [x] Provider switching
  - [x] Setup instructions when no provider configured
  - [x] Security hardening
    - [x] Rate limiting (30 req/min per IP)
    - [x] Prompt injection protection
    - [x] Output filtering (sensitive data redaction)
    - [x] System prompt protection
    - [x] Error sanitization (no internal details exposed)
    - [x] Request validation (size limits, schema validation)
  - [x] Generic modality architecture (ready for image gen, TTS)
- [x] Image Generation with multiple providers
  - [x] OpenAI DALL-E 3 support
  - [x] Google Imagen 3 support
  - [x] Provider switching
  - [x] Setup instructions when no provider configured
  - [x] Security hardening (rate limiting 10 req/min, prompt validation)
  - [x] Download generated images
- [x] Text-to-Speech with multiple providers
  - [x] OpenAI TTS support (tts-1 model, 6 voices)
  - [x] ElevenLabs support (eleven_multilingual_v2, 12 voices)
  - [x] Provider and voice switching
  - [x] Setup instructions when no provider configured
  - [x] Security hardening (rate limiting 20 req/min, input validation)
  - [x] Audio playback controls
  - [x] Download generated audio
- [x] Swedish Public APIs Explorer
  - [x] SMHI Weather API (5 endpoints, no auth)
  - [x] Polisen Police Events API (5 endpoints, no auth)
  - [x] JobTech Job Search API (5 endpoints, no auth)
  - [x] SCB Statistics API (5 endpoints, no auth)
  - [x] Trafikverket Traffic API (7 endpoints, requires free API key)
  - [x] Göteborg Stad City API (5 endpoints, requires free API key)
  - [x] Server-side proxy for CORS handling
  - [x] Dynamic parameter configuration
  - [x] Response viewer with JSON highlighting
  - [x] Dashboard-style UI with hover effects

## Mock Data

### Test User (pre-seeded)
- **Email**: `test@example.com`
- **Password**: `Password123`

Note: Mock data resets on server restart.

## Session Notes
_This section is updated each session with relevant context._

### Session 1 (2024-12-12)
- Initial project setup with Clean Architecture
- Authentication system (login/register) with mock API
- Refresh token management with HTTP-only cookies

### Session 2 (2024-12-12)
- Added sidebar navigation with shadcn/ui
- Implemented theme switching (light/dark/system)
- Created initial settings page with preferences
- Added unit tests (Vitest) for validation schemas
- Added E2E tests (Playwright) for auth flows

### Session 3 (2024-12-12)
- Expanded User model with UserPreferences and NotificationSettings
- Added settings sidebar navigation with sub-pages
- Created Account settings (edit profile with persistence)
- Created Notifications settings (toggle preferences)
- Created Appearance settings (theme, language, date/time format)
- Created Security settings (change password)
- Added 4 new API endpoints for user operations
- Added useUpdateProfile, useChangePassword, useUpdatePreferences, useUpdateNotifications hooks
- Updated UserNav with proper navigation links

### Session 4 (2024-12-12)
- Implemented AI Chat feature with Clean Architecture
- Added support for 4 AI providers: Anthropic, OpenAI, Gemini, Mistral
- Created streaming responses with Server-Sent Events (SSE)
- Added AIProviderFactory with plug-and-play provider architecture
- Created ChatProvider context for session-based message storage
- Added ProviderSetup component with detailed API key instructions
- Added provider selector for switching between configured providers
- Updated sidebar navigation with AI Chat link
- Installed @google/generative-ai SDK
- Created comprehensive documentation in docs/features/ai-chat/

### Session 5 (2024-12-12)
- Fixed Gemini 404 error by updating from retired 1.5 models to 2.0
- Updated all AI provider models to latest versions
- Added comprehensive security hardening for AI Chat:
  - Created security module (`src/infrastructure/security/`)
  - Implemented rate limiting (in-memory, 30 req/min per IP)
  - Added Edge middleware for first-line defense
  - Created prompt injection protection with pattern detection
  - Added output filtering to redact sensitive data (API keys, file paths)
  - Implemented system prompt protection wrapper
  - Created sanitized error responses (never expose internals)
  - Added request validation with Zod schemas
  - Created `withSecurity` HOF for route handlers
- Created generic AI modality architecture for future image gen and TTS
- Updated documentation with security section

### Session 6 (2025-12-12)
- Implemented Image Generation feature with Clean Architecture
- Added support for 2 providers: OpenAI DALL-E 3, Google Imagen 3
- Created ImageProviderFactory with plug-and-play provider architecture
- Created ImageGenProvider context for UI state management
- Added useGenerateImage, useImageProviders hooks
- Created image-gen UI components (ImageGenInput, ImageDisplay, ImageProviderSelector, ImageProviderSetup)
- Added /api/image POST endpoint with security (rate limiting 10/min, prompt validation)
- Added /api/image/providers GET endpoint
- Created /image-gen page with dedicated UI
- Updated sidebar navigation with Image Gen link
- Extended withSecurity middleware to support image-generation modality
- Reused existing API keys (OPENAI_API_KEY, GEMINI_API_KEY)

### Session 7 (2025-12-12)
- Implemented Text-to-Speech feature with Clean Architecture
- Added support for 2 providers: OpenAI TTS, ElevenLabs
- Created TTSProviderFactory with plug-and-play provider architecture
- Created TTSProvider context for UI state management
- Added useGenerateSpeech, useTTSProviders hooks
- Created TTS UI components (TTSInput, AudioPlayer, TTSProviderSelector, TTSProviderSetup)
- Added /api/tts POST endpoint with security (rate limiting 20/min, input validation)
- Added /api/tts/providers GET endpoint
- Created /text-to-speech page with dedicated UI
- Updated sidebar navigation with Text to Speech link
- Extended withSecurity middleware to support text-to-speech modality
- Uses OPENAI_API_KEY (shared) and ELEVENLABS_API_KEY (new)
- Audio returned as base64 data URLs for browser playback
- Voice selection per provider

### Session 8 (2025-12-12)
- Implemented Swedish Public APIs Explorer feature
- Added support for 4 Swedish public APIs:
  - SMHI (weather data, 5 endpoints, no auth)
  - Polisen (police events, 5 endpoints, no auth)
  - SCB (statistics, 5 endpoints, no auth)
  - Trafikverket (traffic data, 7 endpoints, requires free API key)
- Created SwedishAPIFactory with plug-and-play service architecture
- Created APIExplorerProvider context for UI state management
- Added useSwedishAPIs, useExecuteAPI hooks
- Created API Explorer UI components (APISelector, EndpointList, RequestBuilder, ResponseViewer, APISetup)
- Added /api/swedish-apis GET endpoint (list available APIs)
- Added /api/swedish-apis/execute POST endpoint (proxy requests to avoid CORS)
- Created /api-explorer page with dashboard-style 3-column layout
- Updated sidebar navigation with API Explorer link
- Server-side proxy handles CORS and keeps API keys secure
- Dynamic parameter handling for different endpoint types
- Trafikverket uses XML query format with API key injection

Last updated: 2025-12-12
