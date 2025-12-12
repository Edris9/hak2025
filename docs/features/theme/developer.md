# Theme - Developer Documentation

## Overview

The application supports light, dark, and system themes using `next-themes` library with Tailwind CSS.

## Architecture

### Files

```
presentation/providers/
└── ThemeProvider.tsx     # next-themes wrapper

app/
└── layout.tsx            # ThemeProvider integration

app/(dashboard)/settings/
└── page.tsx              # Theme selection UI
```

## Implementation

### ThemeProvider

Wraps the app with `next-themes` provider:

```typescript
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

### Using Theme in Components

```typescript
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme('dark')}>
      Dark Mode
    </button>
  );
}
```

## Root Layout Setup

Important: Add `suppressHydrationWarning` to `<html>` tag:

```typescript
<html lang="en" suppressHydrationWarning>
```

## Theme Values

| Value | Description |
|-------|-------------|
| `light` | Light theme |
| `dark` | Dark theme |
| `system` | Follows OS preference |

## Tailwind CSS Classes

Use Tailwind's dark mode classes:

```html
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">
    Content
  </p>
</div>
```

## Theme Toggle Locations

1. **User Menu** (UserNav.tsx) - Dropdown submenu
2. **Settings Page** - Button group selection

## Storage

Theme preference is stored in `localStorage` as `theme` key.

## Avoiding Flash

The `disableTransitionOnChange` option prevents flash of wrong theme during hydration.
