# Sidebar - Developer Documentation

## Overview

The sidebar provides navigation and user controls for authenticated users. It uses shadcn/ui's sidebar component with a collapsible design.

## Architecture

### Layers Involved

```
presentation/components/layout/
├── AppSidebar.tsx    # Main sidebar component
├── UserNav.tsx       # User dropdown with settings
└── index.ts          # Exports

app/(dashboard)/
├── layout.tsx        # Dashboard layout with SidebarProvider
├── dashboard/page.tsx
└── settings/page.tsx
```

## Files

### AppSidebar.tsx

Main sidebar component containing:
- Header with app name
- Menu items (Dashboard, Documents, Team, Settings)
- Footer with UserNav component

```typescript
const menuItems = [
  { title: 'Dashboard', icon: Home, href: '/dashboard' },
  { title: 'Documents', icon: FileText, href: '/documents' },
  { title: 'Team', icon: Users, href: '/team' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];
```

### UserNav.tsx

User profile dropdown containing:
- User avatar with initials
- User name and email
- Profile link
- Settings link
- Theme submenu (Light/Dark/System)
- Logout button

### Dashboard Layout

Wraps pages with `SidebarProvider` and includes:
- `AppSidebar` component
- `SidebarInset` for main content
- Header with `SidebarTrigger`

## Component Structure

```
SidebarProvider
├── AppSidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   └── SidebarMenu (menu items)
│   └── SidebarFooter
│       └── UserNav (dropdown)
└── SidebarInset
    ├── Header (with SidebarTrigger)
    └── Main Content
```

## Adding Menu Items

To add a new menu item:

```typescript
// In AppSidebar.tsx
const menuItems = [
  // ... existing items
  { title: 'New Page', icon: SomeIcon, href: '/new-page' },
];
```

## Styling

The sidebar uses shadcn/ui's built-in styles with:
- Collapsible on mobile
- Persistent on desktop
- Active state highlighting via `isActive` prop

## Dependencies

- `@/components/ui/sidebar` - shadcn sidebar components
- `@/components/ui/dropdown-menu` - User dropdown
- `@/components/ui/avatar` - User avatar
- `lucide-react` - Icons
