# Documentation

This folder contains comprehensive documentation for the Clean Architecture Next.js Template.

## Structure

```
docs/
├── README.md                    # This file
├── architecture.md              # Clean Architecture overview
├── domain-models.md             # Domain entities and relationships
└── features/                    # Feature-specific documentation
    └── authentication/
        ├── developer.md         # Technical implementation details
        └── user.md              # User-facing documentation
```

## Quick Links

### Architecture
- [Architecture Overview](./architecture.md) - Clean Architecture layers and flow

### Core Concepts
- [Domain Models](./domain-models.md) - Core business entities

### Features
- [Authentication](./features/authentication/) - Login & Registration

### Layer Documentation
Each architectural layer has its own README:
- `src/domain/README.md` - Domain layer (entities, interfaces)
- `src/application/README.md` - Application layer (DTOs, use cases)
- `src/infrastructure/README.md` - Infrastructure layer (repositories, API client)
- `src/presentation/README.md` - Presentation layer (components, hooks)
- `src/app/README.md` - App layer (pages, API routes)

## Documentation Guidelines

### Feature Documentation
Each feature should have:
1. **developer.md** - Technical details, API contracts, implementation notes
2. **user.md** - User flows, UI behavior, error handling from user perspective

### Layer Documentation
Each layer README should explain:
1. **Purpose** - Why this layer exists
2. **Structure** - Folder organization
3. **Files** - What each file does
4. **Flow** - How data moves through
5. **Connections** - Dependencies to/from other layers
6. **When to modify** - Guidance for changes
