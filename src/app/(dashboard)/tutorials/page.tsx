'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Rocket,
  Database,
  CreditCard,
  Bell,
  Mail,
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Code,
  FileCode,
  Lightbulb,
  AlertCircle,
  ExternalLink,
  Copy,
  Terminal,
  FolderTree,
  Zap,
} from 'lucide-react';

const tutorials = [
  {
    id: 'database',
    title: 'Add a Real Database',
    description: 'Replace mock data with PostgreSQL using Prisma',
    icon: Database,
    difficulty: 'Beginner',
    color: 'blue',
  },
  {
    id: 'payments',
    title: 'Add Stripe Payments',
    description: 'Accept payments and subscriptions',
    icon: CreditCard,
    difficulty: 'Intermediate',
    color: 'purple',
  },
  {
    id: 'notifications',
    title: 'Push Notifications',
    description: 'Real-time alerts with web push',
    icon: Bell,
    difficulty: 'Intermediate',
    color: 'yellow',
  },
  {
    id: 'email',
    title: 'Email Integration',
    description: 'Send beautiful emails with Resend',
    icon: Mail,
    difficulty: 'Beginner',
    color: 'green',
  },
];

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState('database');

  const tabConfig = [
    { id: 'database', label: 'Database', icon: Database, color: 'blue' },
    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'purple' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'yellow' },
    { id: 'email', label: 'Email', icon: Mail, color: 'green' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tutorials</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Step-by-step guides to add powerful features to your app. No prior experience needed!
        </p>
      </div>

      {/* Business Ideas */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            What Can You Build With This Template?
          </CardTitle>
          <CardDescription className="text-base">
            This template gives you a head start. Here are some real business ideas you could build:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border-2 rounded-lg p-4 space-y-2 bg-background hover:border-primary/50 transition-colors">
              <h4 className="font-semibold text-lg">AI Writing Assistant</h4>
              <p className="text-sm text-muted-foreground">
                Help people write better emails, blog posts, or social media content using AI.
              </p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">Uses: AI Chat</Badge>
              </div>
            </div>
            <div className="border-2 rounded-lg p-4 space-y-2 bg-background hover:border-primary/50 transition-colors">
              <h4 className="font-semibold text-lg">Marketing Image Tool</h4>
              <p className="text-sm text-muted-foreground">
                Generate social media images, ads, and banners with AI.
              </p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">Uses: Image Gen</Badge>
              </div>
            </div>
            <div className="border-2 rounded-lg p-4 space-y-2 bg-background hover:border-primary/50 transition-colors">
              <h4 className="font-semibold text-lg">Podcast Creator</h4>
              <p className="text-sm text-muted-foreground">
                Turn blog posts into audio content or create podcast intros.
              </p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">Uses: Text-to-Speech</Badge>
              </div>
            </div>
            <div className="border-2 rounded-lg p-4 space-y-2 bg-background hover:border-primary/50 transition-colors">
              <h4 className="font-semibold text-lg">Swedish Job Board</h4>
              <p className="text-sm text-muted-foreground">
                Create a job search site using real Swedish job listings.
              </p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">Uses: JobTech API</Badge>
              </div>
            </div>
            <div className="border-2 rounded-lg p-4 space-y-2 bg-background hover:border-primary/50 transition-colors">
              <h4 className="font-semibold text-lg">Weather Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Build a beautiful weather app for Swedish cities.
              </p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">Uses: SMHI API</Badge>
              </div>
            </div>
            <div className="border-2 rounded-lg p-4 space-y-2 bg-background hover:border-primary/50 transition-colors">
              <h4 className="font-semibold text-lg">Customer Support Bot</h4>
              <p className="text-sm text-muted-foreground">
                Automate customer questions with an AI chatbot.
              </p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">Uses: AI Chat + Database</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Overview Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Tutorials</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                activeTab === tutorial.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setActiveTab(tutorial.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <tutorial.icon className={`h-10 w-10 text-${tutorial.color}-500`} />
                  <Badge variant="outline" className="text-sm">{tutorial.difficulty}</Badge>
                </div>
                <CardTitle className="mt-2 text-lg">{tutorial.title}</CardTitle>
                <CardDescription className="text-base">{tutorial.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Prominent Tabs */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Step-by-Step Instructions</h2>
        <p className="text-muted-foreground">Click a tab below to see the full tutorial:</p>

        <div className="flex flex-wrap gap-2">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? `border-${tab.color}-500 bg-${tab.color}-500/10 text-${tab.color}-600 dark:text-${tab.color}-400 shadow-md scale-105`
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Database Tutorial */}
        {activeTab === 'database' && (
          <Card className="border-2">
            <CardHeader className="bg-blue-500/10 border-b">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Database className="h-8 w-8 text-blue-500" />
                Add a Real Database with Prisma
              </CardTitle>
              <CardDescription className="text-base">
                Right now, your app uses fake data that disappears when you restart. Let&apos;s add a real database so data persists forever!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* What you'll learn */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  What You&apos;ll Learn
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to set up PostgreSQL database</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How Prisma makes database work easy</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to save and retrieve user data</li>
                </ul>
              </div>

              {/* What is Prisma? */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">What is Prisma?</h4>
                <p className="text-muted-foreground">
                  Think of <strong>Prisma</strong> as a translator between your code and your database. Instead of writing complex SQL commands, you write simple JavaScript/TypeScript code and Prisma handles the rest.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-mono">
                    <span className="text-muted-foreground">// Without Prisma (complex SQL):</span><br />
                    SELECT * FROM users WHERE email = &apos;test@example.com&apos;<br /><br />
                    <span className="text-muted-foreground">// With Prisma (simple JavaScript):</span><br />
                    prisma.user.findUnique({'{'} where: {'{'} email: &apos;test@example.com&apos; {'}'} {'}'})
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">1</div>
                  <h4 className="font-semibold text-xl">Install Prisma</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Open your terminal (the black window where you type commands) and run these two commands:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    <code>npm install prisma @prisma/client</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    <code>npx prisma init</code>
                  </div>
                </div>
                <div className="ml-13 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                  <p className="text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span><strong>What this does:</strong> The first command downloads Prisma. The second command creates a new folder called <code className="bg-muted px-1 rounded">prisma</code> with a file called <code className="bg-muted px-1 rounded">schema.prisma</code>.</span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">2</div>
                  <h4 className="font-semibold text-xl">Get a Free Database</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  You need a place to store your data. Here are free options (pick one):
                </p>
                <div className="ml-13 grid gap-3 md:grid-cols-3">
                  <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="border-2 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <h5 className="font-semibold flex items-center gap-2">Neon <ExternalLink className="h-3 w-3" /></h5>
                    <p className="text-xs text-muted-foreground">Best for beginners. Free forever plan.</p>
                  </a>
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="border-2 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <h5 className="font-semibold flex items-center gap-2">Supabase <ExternalLink className="h-3 w-3" /></h5>
                    <p className="text-xs text-muted-foreground">Has extra features. Free tier.</p>
                  </a>
                  <a href="https://railway.app" target="_blank" rel="noopener noreferrer" className="border-2 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <h5 className="font-semibold flex items-center gap-2">Railway <ExternalLink className="h-3 w-3" /></h5>
                    <p className="text-xs text-muted-foreground">$5 free credit to start.</p>
                  </a>
                </div>
                <div className="ml-13 space-y-2">
                  <p className="text-sm font-medium">After signing up, you&apos;ll get a connection string that looks like this:</p>
                  <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                    postgresql://username:password@host:5432/database_name
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">3</div>
                  <h4 className="font-semibold text-xl">Add Your Database URL</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Open the file called <code className="bg-muted px-1 rounded">.env.local</code> in your project and add this line:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                  <span className="text-zinc-400"># Add this line to .env.local</span><br />
                  DATABASE_URL=&quot;postgresql://your_username:your_password@your_host:5432/your_database&quot;
                </div>
                <div className="ml-13 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                  <p className="text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Important:</strong> Never share your DATABASE_URL! It contains your password. The .env.local file is already ignored by git so it won&apos;t be uploaded to GitHub.</span>
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">4</div>
                  <h4 className="font-semibold text-xl">Define Your Data Structure</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Open <code className="bg-muted px-1 rounded">prisma/schema.prisma</code> and replace everything with this:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// This tells Prisma how to connect to your database
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// This creates a "users" table in your database
model User {
  id        String   @id @default(cuid())  // Unique ID for each user
  email     String   @unique               // Email must be unique
  password  String                         // Hashed password
  firstName String
  lastName  String
  createdAt DateTime @default(now())       // When they signed up
  sessions  Session[]                      // Their login sessions
}

// This creates a "sessions" table for login tokens
model Session {
  id           String   @id @default(cuid())
  userId       String
  refreshToken String   @unique
  expiresAt    DateTime
  user         User     @relation(fields: [userId], references: [id])
}`}</pre>
                </div>
                <div className="ml-13 bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>In plain English:</strong> This tells the database &quot;I want to store users and their login sessions. Each user has an email, password, and name.&quot;
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">5</div>
                  <h4 className="font-semibold text-xl">Create the Database Tables</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Run these commands to create the actual tables in your database:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    <code>npx prisma migrate dev --name init</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    <code>npx prisma generate</code>
                  </div>
                </div>
                <div className="ml-13 bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                  <p className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Success!</strong> If you see &quot;Your database is now in sync&quot;, your tables are created!</span>
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">6</div>
                  <h4 className="font-semibold text-xl">Create a Prisma Helper File</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Create a new file at <code className="bg-muted px-1 rounded">src/lib/prisma.ts</code>:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// This prevents creating too many database connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}`}</pre>
                </div>
              </div>

              {/* Step 7 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">7</div>
                  <h4 className="font-semibold text-xl">Use It In Your Code!</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Now you can use the database in your API routes. Here&apos;s an example:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// Example: In src/app/api/auth/login/route.ts
import { prisma } from '@/lib/prisma';

// Find a user by email
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' }
});

// Create a new user
const newUser = await prisma.user.create({
  data: {
    email: 'new@example.com',
    password: 'hashedPassword123',
    firstName: 'John',
    lastName: 'Doe'
  }
});

// Get all users
const allUsers = await prisma.user.findMany();`}</pre>
                </div>
              </div>

              {/* Success */}
              <div className="bg-green-500/10 border-2 border-green-500/30 p-6 rounded-lg">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                  You Did It!
                </h4>
                <p className="mt-2">
                  Your app now has a real database! User registrations and data will persist even after you restart your server.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payments Tutorial */}
        {activeTab === 'payments' && (
          <Card className="border-2">
            <CardHeader className="bg-purple-500/10 border-b">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <CreditCard className="h-8 w-8 text-purple-500" />
                Add Stripe Payments
              </CardTitle>
              <CardDescription className="text-base">
                Let users pay for your product! Stripe handles all the complex payment stuff so you don&apos;t have to.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* What you'll learn */}
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  What You&apos;ll Learn
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to set up a Stripe account</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to create a checkout page</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to handle successful payments</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How subscriptions work</li>
                </ul>
              </div>

              {/* What is Stripe? */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">What is Stripe?</h4>
                <p className="text-muted-foreground">
                  <strong>Stripe</strong> is like a cashier for your website. When someone wants to buy something, Stripe handles their credit card, makes sure the payment goes through, and tells your app &quot;hey, this person paid!&quot; You never have to touch sensitive card details.
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">1</div>
                  <h4 className="font-semibold text-xl">Create a Stripe Account</h4>
                </div>
                <div className="ml-13 space-y-3">
                  <p className="text-muted-foreground">
                    Go to <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">stripe.com</a> and create a free account.
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                    <p className="text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Good news:</strong> Stripe has a &quot;test mode&quot; where you can pretend to accept payments without real money. Perfect for learning!</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">2</div>
                  <h4 className="font-semibold text-xl">Install Stripe</h4>
                </div>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    <code>npm install stripe @stripe/stripe-js</code>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">3</div>
                  <h4 className="font-semibold text-xl">Get Your API Keys</h4>
                </div>
                <div className="ml-13 space-y-3">
                  <p className="text-muted-foreground">
                    In your Stripe Dashboard, go to <strong>Developers → API Keys</strong>. You&apos;ll see two keys:
                  </p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li><strong>Publishable key</strong> (starts with pk_) - Safe to use in browser</li>
                    <li><strong>Secret key</strong> (starts with sk_) - Keep this secret! Server only.</li>
                  </ul>
                  <p className="text-muted-foreground">Add them to <code className="bg-muted px-1 rounded">.env.local</code>:</p>
                  <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                    <span className="text-zinc-400"># Stripe keys (use test keys while developing)</span><br />
                    STRIPE_SECRET_KEY=sk_test_...<br />
                    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">4</div>
                  <h4 className="font-semibold text-xl">Create a Product in Stripe</h4>
                </div>
                <div className="ml-13 space-y-3">
                  <p className="text-muted-foreground">
                    In Stripe Dashboard, go to <strong>Products → Add Product</strong>. Create your product (e.g., &quot;Pro Plan - $10/month&quot;). Copy the <strong>Price ID</strong> (starts with price_).
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">5</div>
                  <h4 className="font-semibold text-xl">Create Checkout API</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Create a new file at <code className="bg-muted px-1 rounded">src/app/api/checkout/route.ts</code>:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// src/app/api/checkout/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',  // or 'payment' for one-time
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,  // Your Price ID from Stripe
          quantity: 1,
        },
      ],
      success_url: \`\${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/success\`,
      cancel_url: \`\${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/pricing\`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}`}</pre>
                </div>
              </div>

              {/* Step 6 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">6</div>
                  <h4 className="font-semibold text-xl">Create a Buy Button</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Add this button anywhere you want users to buy:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// In any component
const handleCheckout = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId: 'price_YOUR_PRICE_ID' }),
  });

  const { url } = await response.json();
  window.location.href = url;  // Redirect to Stripe checkout
};

// In your JSX:
<button onClick={handleCheckout}>
  Subscribe - $10/month
</button>`}</pre>
                </div>
              </div>

              {/* Step 7 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold">7</div>
                  <h4 className="font-semibold text-xl">Handle Payment Success (Webhooks)</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  When someone pays, Stripe sends a message to your app. Create <code className="bg-muted px-1 rounded">src/app/api/webhooks/stripe/route.ts</code>:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// src/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // User paid! Grant them access here
      console.log('Payment successful!', session.customer_email);
      break;

    case 'customer.subscription.deleted':
      // Subscription cancelled, revoke access
      break;
  }

  return NextResponse.json({ received: true });
}`}</pre>
                </div>
                <div className="ml-13 bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>To test webhooks locally:</strong> Install Stripe CLI and run <code className="bg-muted px-1 rounded">stripe listen --forward-to localhost:3000/api/webhooks/stripe</code>
                  </p>
                </div>
              </div>

              {/* Test Cards */}
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Test Card Numbers</h4>
                <p className="text-sm text-muted-foreground mb-2">Use these fake cards while testing:</p>
                <ul className="text-sm space-y-1 font-mono">
                  <li>Success: <code className="bg-muted px-1 rounded">4242 4242 4242 4242</code></li>
                  <li>Decline: <code className="bg-muted px-1 rounded">4000 0000 0000 0002</code></li>
                </ul>
              </div>

              {/* Success */}
              <div className="bg-green-500/10 border-2 border-green-500/30 p-6 rounded-lg">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                  You Can Now Accept Payments!
                </h4>
                <p className="mt-2">
                  Users can subscribe to your product and you&apos;ll receive real money (once you switch from test to live mode).
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications Tutorial */}
        {activeTab === 'notifications' && (
          <Card className="border-2">
            <CardHeader className="bg-yellow-500/10 border-b">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Bell className="h-8 w-8 text-yellow-500" />
                Add Push Notifications
              </CardTitle>
              <CardDescription className="text-base">
                Send alerts to users even when they&apos;re not on your website! Great for reminders, updates, and engagement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* What you'll learn */}
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  What You&apos;ll Learn
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How web push notifications work</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to ask users for permission</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to send notifications from your server</li>
                </ul>
              </div>

              {/* How it works */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">How Push Notifications Work</h4>
                <p className="text-muted-foreground">
                  Think of it like a postal service for your app:
                </p>
                <div className="grid gap-4 md:grid-cols-3 text-center">
                  <div className="border-2 rounded-lg p-4">
                    <div className="text-3xl mb-2">📝</div>
                    <h5 className="font-semibold">1. User Subscribes</h5>
                    <p className="text-xs text-muted-foreground">User clicks &quot;Allow notifications&quot; and gives you their &quot;address&quot;</p>
                  </div>
                  <div className="border-2 rounded-lg p-4">
                    <div className="text-3xl mb-2">📤</div>
                    <h5 className="font-semibold">2. You Send Message</h5>
                    <p className="text-xs text-muted-foreground">Your server sends the notification to a push service</p>
                  </div>
                  <div className="border-2 rounded-lg p-4">
                    <div className="text-3xl mb-2">🔔</div>
                    <h5 className="font-semibold">3. User Gets Alert</h5>
                    <p className="text-xs text-muted-foreground">Browser shows the notification even if your site is closed</p>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-bold">1</div>
                  <h4 className="font-semibold text-xl">Install web-push</h4>
                </div>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    <code>npm install web-push</code>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-bold">2</div>
                  <h4 className="font-semibold text-xl">Generate VAPID Keys</h4>
                </div>
                <div className="ml-13 space-y-3">
                  <p className="text-muted-foreground">
                    VAPID keys are like an ID card that proves your notifications are legitimate. Run this once:
                  </p>
                  <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-zinc-400" />
                      <code>npx web-push generate-vapid-keys</code>
                    </div>
                  </div>
                  <p className="text-muted-foreground">Add the output to <code className="bg-muted px-1 rounded">.env.local</code>:</p>
                  <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                    NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJ7...<br />
                    VAPID_PRIVATE_KEY=8Gj...<br />
                    VAPID_EMAIL=your-email@example.com
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-bold">3</div>
                  <h4 className="font-semibold text-xl">Create a Service Worker</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  A service worker is code that runs in the background. Create <code className="bg-muted px-1 rounded">public/sw.js</code>:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon-192.png',  // Your app icon
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// When user clicks notification, open the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});`}</pre>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-bold">4</div>
                  <h4 className="font-semibold text-xl">Ask for Permission</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Add a button to ask users if they want notifications:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// In a component (e.g., NotificationButton.tsx)
'use client';

export function NotificationButton() {
  const subscribe = async () => {
    // 1. Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');

    // 2. Ask permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // 3. Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

    // 4. Send subscription to your server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    alert('Notifications enabled!');
  };

  return (
    <button onClick={subscribe}>
      Enable Notifications 🔔
    </button>
  );
}`}</pre>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-bold">5</div>
                  <h4 className="font-semibold text-xl">Send Notifications from Server</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Create <code className="bg-muted px-1 rounded">src/lib/notifications.ts</code>:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// src/lib/notifications.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendNotification(
  subscription: webpush.PushSubscription,
  title: string,
  body: string,
  url?: string
) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify({ title, body, url })
  );
}

// Example usage:
// await sendNotification(userSubscription, 'New Message!', 'You have a new message', '/messages');`}</pre>
                </div>
              </div>

              {/* Success */}
              <div className="bg-green-500/10 border-2 border-green-500/30 p-6 rounded-lg">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                  Push Notifications Ready!
                </h4>
                <p className="mt-2">
                  Users who enable notifications will receive alerts even when they&apos;re not on your site. Great for engagement!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Tutorial */}
        {activeTab === 'email' && (
          <Card className="border-2">
            <CardHeader className="bg-green-500/10 border-b">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Mail className="h-8 w-8 text-green-500" />
                Send Emails with Resend
              </CardTitle>
              <CardDescription className="text-base">
                Send welcome emails, password resets, and notifications. Resend makes it super easy!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* What you'll learn */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  What You&apos;ll Learn
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to set up Resend (email service)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to send your first email</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> How to create beautiful email templates</li>
                </ul>
              </div>

              {/* Why Resend? */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Why Resend?</h4>
                <p className="text-muted-foreground">
                  <strong>Resend</strong> is like a post office for your app. You give it a letter (email) and it delivers it to the inbox. It&apos;s:
                </p>
                <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                  <li><strong>Free</strong> to start (100 emails/day on free plan)</li>
                  <li><strong>Easy</strong> - just a few lines of code</li>
                  <li><strong>Reliable</strong> - emails actually arrive in inbox, not spam</li>
                </ul>
              </div>

              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">1</div>
                  <h4 className="font-semibold text-xl">Create a Resend Account</h4>
                </div>
                <div className="ml-13 space-y-3">
                  <p className="text-muted-foreground">
                    Go to <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">resend.com</a> and sign up for free.
                  </p>
                  <p className="text-muted-foreground">
                    After signing up, go to <strong>API Keys</strong> and create a new key. Copy it!
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">2</div>
                  <h4 className="font-semibold text-xl">Install Resend</h4>
                </div>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    <code>npm install resend</code>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">3</div>
                  <h4 className="font-semibold text-xl">Add Your API Key</h4>
                </div>
                <div className="ml-13 space-y-3">
                  <p className="text-muted-foreground">Add to <code className="bg-muted px-1 rounded">.env.local</code>:</p>
                  <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                    RESEND_API_KEY=re_123abc...
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">4</div>
                  <h4 className="font-semibold text-xl">Create an Email Helper</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  Create <code className="bg-muted px-1 rounded">src/lib/email.ts</code>:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send a welcome email when someone signs up
export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',  // Use your domain after verifying
    to: email,
    subject: 'Welcome to Our App! 🎉',
    html: \`
      <h1>Hello \${name}!</h1>
      <p>Thanks for joining us. We're excited to have you!</p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Explore our features</li>
        <li>Reach out if you need help</li>
      </ul>
      <p>Best,<br>The Team</p>
    \`
  });
}

// Send a password reset email
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  await resend.emails.send({
    from: 'noreply@resend.dev',
    to: email,
    subject: 'Reset Your Password',
    html: \`
      <h1>Password Reset</h1>
      <p>Click the button below to reset your password:</p>
      <a href="\${resetLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background: #3b82f6;
        color: white;
        text-decoration: none;
        border-radius: 6px;
      ">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    \`
  });
}`}</pre>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">5</div>
                  <h4 className="font-semibold text-xl">Use It When Users Register</h4>
                </div>
                <p className="ml-13 text-muted-foreground">
                  In your registration API route, add:
                </p>
                <div className="ml-13 bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`// In src/app/api/auth/register/route.ts
import { sendWelcomeEmail } from '@/lib/email';

// After creating the user...
await sendWelcomeEmail(user.email, user.firstName);`}</pre>
                </div>
              </div>

              {/* Bonus: React Email */}
              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Bonus: Beautiful Email Templates
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Want prettier emails? Use <a href="https://react.email" target="_blank" rel="noopener noreferrer" className="text-primary underline">React Email</a> to build emails with React components:
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-xs">
                  npm install @react-email/components
                </div>
              </div>

              {/* Test it */}
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Test Your Email</h4>
                <p className="text-sm text-muted-foreground">
                  On the free plan, you can only send to your own email at first. To send to anyone, verify your domain in the Resend dashboard.
                </p>
              </div>

              {/* Success */}
              <div className="bg-green-500/10 border-2 border-green-500/30 p-6 rounded-lg">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                  Email Integration Complete!
                </h4>
                <p className="mt-2">
                  Your app can now send emails for welcome messages, password resets, notifications, and more!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Next Steps */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Code className="h-6 w-6" />
            Helpful Resources
          </CardTitle>
          <CardDescription>Learn more about the technologies in this template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 rounded-lg p-4 hover:border-primary/50 transition-all hover:-translate-y-0.5"
            >
              <FileCode className="h-8 w-8 mb-2" />
              <h4 className="font-semibold">Next.js Docs</h4>
              <p className="text-sm text-muted-foreground">Official Next.js documentation</p>
            </a>
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 rounded-lg p-4 hover:border-primary/50 transition-all hover:-translate-y-0.5"
            >
              <Smartphone className="h-8 w-8 mb-2" />
              <h4 className="font-semibold">shadcn/ui</h4>
              <p className="text-sm text-muted-foreground">Add more UI components</p>
            </a>
            <a
              href="https://www.prisma.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 rounded-lg p-4 hover:border-primary/50 transition-all hover:-translate-y-0.5"
            >
              <Database className="h-8 w-8 mb-2" />
              <h4 className="font-semibold">Prisma Docs</h4>
              <p className="text-sm text-muted-foreground">Learn more about databases</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
