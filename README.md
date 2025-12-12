# InFiNet Code - Next.js AI Workshop Template

> *Crafting the future*

Hey there! Welcome to this Next.js AI Workshop Template, a gift from the team at **InFiNet Code**. This template gives you everything you need to create a modern web app with AI features, authentication, and real Swedish public APIs.

**No prior experience required** - just follow along and you'll have a working app in no time!

---

## What's Inside This Template?

Think of this template as a **starter kit** with batteries included:

| Feature | What It Does |
|---------|--------------|
| **User Login/Register** | Users can create accounts and log in securely |
| **AI Chat** | Chat with Claude, GPT-4, Gemini, or Mistral |
| **Image Generation** | Create images with DALL-E 3 or Imagen |
| **Text-to-Speech** | Convert text to natural-sounding audio |
| **Swedish APIs** | Weather, jobs, police events, traffic, and more |
| **Dark/Light Mode** | Looks great on any device |
| **Clean Code Structure** | Organized in a way that scales |

---

## Quick Start (5 minutes)

### Step 1: Install What You Need

Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher).

### Step 2: Set Up The Project

Open your terminal and run:

```bash
# Go to the project folder
cd NemoSensei-NextjsAI-Template

# Install all the packages
npm install

# Create your environment file
cp .env.example .env.local
```

### Step 3: Add Your API Keys

Open `.env.local` and add at least one AI provider key:

```env
# Pick at least one AI provider
ANTHROPIC_API_KEY=your-key-here     # For Claude
OPENAI_API_KEY=your-key-here        # For GPT-4, DALL-E, TTS
GEMINI_API_KEY=your-key-here        # For Gemini, Imagen
MISTRAL_API_KEY=your-key-here       # For Mistral
```

**Where to get API keys:**
- [Anthropic (Claude)](https://console.anthropic.com/) - Great for chat
- [OpenAI](https://platform.openai.com/) - Chat, images, and voice
- [Google AI Studio (Gemini)](https://aistudio.google.com/) - Free tier available
- [Mistral](https://console.mistral.ai/) - European AI provider

### Step 4: Start The App!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're ready to go!

### Test Account

Already set up for you:
- **Email:** `test@example.com`
- **Password:** `Password123`

---

## What Can You Build With This?

This template is designed to be extended. Here are some ideas:

| Idea | What Features To Use |
|------|---------------------|
| **AI Writing Assistant** | AI Chat + Database |
| **Image Generator for Marketing** | Image Generation + Storage |
| **Podcast Creator** | Text-to-Speech + AI Chat |
| **Swedish Job Board** | JobTech API + Database |
| **Weather Dashboard** | SMHI API + Charts |
| **Customer Support Bot** | AI Chat + Your Data |

See the `/tutorials` page in the app for step-by-step guides!

---

## Project Structure (Where Things Are)

```
src/
├── app/                    # Pages and API routes
│   ├── (auth)/            # Login, Register pages
│   ├── (dashboard)/       # Main app pages
│   └── api/               # Backend endpoints
│
├── presentation/          # UI components and hooks
│   ├── components/        # Reusable UI pieces
│   ├── hooks/             # Custom React hooks
│   └── providers/         # Context providers
│
├── infrastructure/        # External services
│   ├── services/          # AI providers, APIs
│   └── repositories/      # Data access
│
├── domain/                # Core business logic
│   ├── models/            # Data types
│   └── interfaces/        # Contracts
│
└── components/ui/         # shadcn/ui components
```

**Simple rule:** UI goes in `presentation`, external stuff goes in `infrastructure`, core logic goes in `domain`.

---

## Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/dashboard` | Your main hub |
| AI Chat | `/chat` | Chat with AI models |
| Image Gen | `/image-gen` | Generate images |
| Text-to-Speech | `/text-to-speech` | Convert text to audio |
| API Explorer | `/api-explorer` | Test Swedish APIs |
| How It Works | `/how-it-works` | Learn the architecture |
| Tutorials | `/tutorials` | Step-by-step guides |
| Settings | `/settings` | Account preferences |

---

## Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check for code issues

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run browser tests
```

---

## Environment Variables Reference

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# AI Providers (add at least one)
ANTHROPIC_API_KEY=         # Claude
OPENAI_API_KEY=            # GPT-4, DALL-E 3, TTS
GEMINI_API_KEY=            # Gemini, Imagen 3
MISTRAL_API_KEY=           # Mistral

# Text-to-Speech (optional)
ELEVENLABS_API_KEY=        # ElevenLabs voices

# Swedish APIs (optional - some are free)
TRAFIKVERKET_API_KEY=      # Traffic data (free at api.trafikinfo.trafikverket.se)
GOTEBORG_API_KEY=          # Gothenburg city data (free at data.goteborg.se)
```

---

## Learn More

### In The App
- **How It Works** (`/how-it-works`) - Visual explanations of how everything connects
- **Tutorials** (`/tutorials`) - Step-by-step guides to add databases, payments, email, and more

### Documentation
- [`docs/`](./docs/) - Detailed technical documentation
- [`docs/features/`](./docs/features/) - Feature-specific guides
- [`CLAUDE.md`](./CLAUDE.md) - Full development guide and conventions

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)

---

## Common Questions

### "I get an error about missing API keys"
Make sure you've:
1. Created `.env.local` from `.env.example`
2. Added at least one AI provider key
3. Restarted the dev server after adding keys

### "The AI features don't work"
Check that:
1. Your API key is valid and has credits
2. The key is in `.env.local` (not `.env`)
3. You restarted `npm run dev`

### "How do I add a new page?"
1. Create a file at `src/app/(dashboard)/your-page/page.tsx`
2. Add it to the sidebar in `src/presentation/components/layout/AppSidebar.tsx`

### "How do I connect a real database?"
See the Database tutorial at `/tutorials` - it walks you through Prisma setup step by step.

---

## Security Built-In

This template includes security features out of the box:
- **Rate Limiting** - Prevents abuse (30 requests/minute for AI features)
- **Secure Cookies** - Refresh tokens stored safely
- **Input Validation** - All inputs validated with Zod
- **Error Sanitization** - No sensitive info in error messages
- **Prompt Protection** - Guards against AI prompt injection

---

## Need Help?

1. **Check the tutorials** at `/tutorials` in the app
2. **Read the docs** in the `docs/` folder
3. **Look at existing code** - it's well-commented
4. **Ask in the workshop** - that's what we're here for!

---

## Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TanStack Query](https://tanstack.com/query/) - Data fetching
- Swedish Public APIs - SMHI, Polisen, SCB, Trafikverket, JobTech, Goteborg Stad

---

## About InFiNet Code

This template is brought to you by **InFiNet Code** - *Crafting the future*.

We build tools and templates to help developers create amazing products faster.

---

**Happy coding!** Now go build something amazing.
