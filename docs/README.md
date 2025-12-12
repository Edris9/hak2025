# Documentation

Welcome to the technical documentation for the Clean Architecture Next.js AI Template!

## Quick Navigation

### Getting Started
- **[Main README](../README.md)** - Quick start guide for workshop attendees
- **[CLAUDE.md](../CLAUDE.md)** - Full development guide and coding conventions

### Architecture
- **[Architecture Overview](./architecture.md)** - How the Clean Architecture layers work together
- **[Domain Models](./domain-models.md)** - Core business entities and their relationships

### Feature Documentation

Each feature has two docs: **developer.md** (technical) and **user.md** (user-facing).

| Feature | Developer Guide | User Guide |
|---------|----------------|------------|
| Authentication | [developer.md](./features/authentication/developer.md) | [user.md](./features/authentication/user.md) |
| AI Chat | [developer.md](./features/ai-chat/developer.md) | [user.md](./features/ai-chat/user.md) |
| Image Generation | [developer.md](./features/image-generation/developer.md) | [user.md](./features/image-generation/user.md) |
| Text-to-Speech | [developer.md](./features/text-to-speech/developer.md) | [user.md](./features/text-to-speech/user.md) |
| API Explorer | [developer.md](./features/api-explorer/developer.md) | [user.md](./features/api-explorer/user.md) |
| Settings | [developer.md](./features/settings/developer.md) | [user.md](./features/settings/user.md) |
| Sidebar | [developer.md](./features/sidebar/developer.md) | [user.md](./features/sidebar/user.md) |
| Theme | [developer.md](./features/theme/developer.md) | [user.md](./features/theme/user.md) |
| Testing | [developer.md](./features/testing/developer.md) | [user.md](./features/testing/user.md) |

### Layer Documentation

Each layer in the `src/` folder has its own README explaining its purpose:

| Layer | Location | Purpose |
|-------|----------|---------|
| Domain | `src/domain/README.md` | Core business entities and interfaces |
| Application | `src/application/README.md` | DTOs and use cases |
| Infrastructure | `src/infrastructure/README.md` | External services, repositories, API client |
| Presentation | `src/presentation/README.md` | React components, hooks, providers |
| App | `src/app/README.md` | Next.js pages and API routes |

---

## How Documentation Is Organized

```
docs/
├── README.md              # This file - navigation hub
├── architecture.md        # Clean Architecture explanation
├── domain-models.md       # Entity relationships
└── features/              # Feature-specific docs
    ├── authentication/
    │   ├── developer.md   # How auth is implemented
    │   └── user.md        # How users experience auth
    ├── ai-chat/
    │   ├── developer.md   # AI provider integration
    │   └── user.md        # How to use AI Chat
    └── ...
```

---

## For Workshop Participants

If you're attending a workshop, start here:

1. **[Main README](../README.md)** - Get the app running
2. **[/how-it-works](http://localhost:3000/how-it-works)** - Visual architecture guide (in-app)
3. **[/tutorials](http://localhost:3000/tutorials)** - Step-by-step guides to extend the template (in-app)

---

## For Developers

If you're diving into the code:

1. **[CLAUDE.md](../CLAUDE.md)** - Coding conventions and patterns
2. **[Architecture](./architecture.md)** - Understand the layer structure
3. **Feature docs** - See how specific features are implemented

---

## Adding New Documentation

When you add a new feature, create documentation:

### 1. Feature Docs

Create `docs/features/{feature-name}/`:
- `developer.md` - Technical implementation details
- `user.md` - User-facing behavior and UI

### 2. Update This File

Add your feature to the Feature Documentation table above.

### 3. Template for developer.md

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

### 4. Template for user.md

```markdown
# {Feature Name} - User Documentation

## Overview
What this feature allows users to do.

## How to Use
Step-by-step instructions.

## UI Description
What the user sees.

## Error Handling
Common errors and solutions.
```

---

## External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Prisma Documentation](https://www.prisma.io/docs)
