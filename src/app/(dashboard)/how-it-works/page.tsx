'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Server,
  Globe,
  Database,
  Shield,
  Palette,
  Zap,
  ArrowRight,
  ArrowDown,
  Box,
  FolderTree,
  RefreshCw,
  Lock,
  User,
  Key,
  Cookie,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';

type TabValue = 'nextjs' | 'architecture' | 'auth' | 'stack';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('nextjs');

  const tabs: { value: TabValue; label: string; icon: React.ReactNode }[] = [
    { value: 'nextjs', label: 'What is Next.js?', icon: <Globe className="h-5 w-5" /> },
    { value: 'architecture', label: 'How Code is Organized', icon: <Layers className="h-5 w-5" /> },
    { value: 'auth', label: 'How Login Works', icon: <Lock className="h-5 w-5" /> },
    { value: 'stack', label: 'Tools We Use', icon: <Box className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">How It Works</h1>
        <p className="text-muted-foreground mt-2">
          New to web development? No problem! We&apos;ll explain everything step by step.
        </p>
      </div>

      {/* Custom Prominent Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
              activeTab === tab.value
                ? 'border-primary bg-primary/10 shadow-lg scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-md hover:-translate-y-1'
            }`}
          >
            <div className={`mb-2 ${activeTab === tab.value ? 'text-primary' : 'text-muted-foreground'}`}>
              {tab.icon}
            </div>
            <span className={`text-sm font-semibold ${activeTab === tab.value ? 'text-primary' : ''}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Next.js Tab */}
      {activeTab === 'nextjs' && (
        <div className="space-y-6">
          {/* Simple Explanation */}
          <Card className="border-2 border-blue-500/50 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-6 w-6 text-blue-500" />
                Think of Next.js Like a Restaurant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-base space-y-4">
                <p>
                  <strong>Imagine you&apos;re running a restaurant:</strong>
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">👨‍🍳</span>
                    <span><strong>The Kitchen (Server)</strong> - Where food is prepared. In Next.js, this is where pages are built before sending to customers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🍽️</span>
                    <span><strong>The Dining Room (Browser)</strong> - Where customers eat. This is what users see on their screen.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📋</span>
                    <span><strong>The Menu (Routes)</strong> - Different pages like /dashboard, /chat. Each folder in your code = a page on the menu.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🚚</span>
                    <span><strong>The Delivery System (API)</strong> - How data moves between kitchen and dining room.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Visual Flow - Super Simple */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens When You Visit a Page?</CardTitle>
              <CardDescription>Let&apos;s follow the journey step by step</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">1</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">You Type a URL</p>
                    <p className="text-muted-foreground">Like typing &quot;yoursite.com/dashboard&quot; in your browser</p>
                  </div>
                  <Globe className="h-10 w-10 text-blue-500" />
                </div>

                <ArrowDown className="h-8 w-8 mx-auto text-muted-foreground" />

                {/* Step 2 */}
                <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-xl border-2 border-purple-500/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-xl font-bold">2</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">Security Check</p>
                    <p className="text-muted-foreground">Are you logged in? Are you allowed to see this page?</p>
                  </div>
                  <Shield className="h-10 w-10 text-purple-500" />
                </div>

                <ArrowDown className="h-8 w-8 mx-auto text-muted-foreground" />

                {/* Step 3 */}
                <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl border-2 border-green-500/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">3</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">Server Builds the Page</p>
                    <p className="text-muted-foreground">Gets your data, creates the HTML, prepares everything</p>
                  </div>
                  <Server className="h-10 w-10 text-green-500" />
                </div>

                <ArrowDown className="h-8 w-8 mx-auto text-muted-foreground" />

                {/* Step 4 */}
                <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-xl border-2 border-orange-500/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">4</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">You See the Page!</p>
                    <p className="text-muted-foreground">The finished page appears in your browser</p>
                  </div>
                  <Eye className="h-10 w-10 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File = Page */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                One Folder = One Page
              </CardTitle>
              <CardDescription>The simplest rule in Next.js</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-base">
                  <strong>It&apos;s like organizing files on your computer:</strong>
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-4 border-2 rounded-lg bg-muted/50">
                    <p className="font-mono text-sm">app/dashboard/page.tsx</p>
                    <ArrowRight className="h-4 w-4 my-2 text-muted-foreground" />
                    <p className="font-bold text-green-600">yoursite.com/dashboard</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg bg-muted/50">
                    <p className="font-mono text-sm">app/chat/page.tsx</p>
                    <ArrowRight className="h-4 w-4 my-2 text-muted-foreground" />
                    <p className="font-bold text-green-600">yoursite.com/chat</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg bg-muted/50">
                    <p className="font-mono text-sm">app/settings/page.tsx</p>
                    <ArrowRight className="h-4 w-4 my-2 text-muted-foreground" />
                    <p className="font-bold text-green-600">yoursite.com/settings</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg bg-muted/50">
                    <p className="font-mono text-sm">app/api/auth/login/route.ts</p>
                    <ArrowRight className="h-4 w-4 my-2 text-muted-foreground" />
                    <p className="font-bold text-blue-600">API endpoint for login</p>
                  </div>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm">
                    <strong>That&apos;s it!</strong> Create a folder, add a page.tsx file, and you have a new page. No complicated configuration needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Architecture Tab */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Simple Explanation */}
          <Card className="border-2 border-green-500/50 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Layers className="h-6 w-6 text-green-500" />
                Think of It Like a Company
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base">
                <strong>A well-organized company has different departments. Our code is organized the same way:</strong>
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-500/10 rounded-lg border-l-4 border-blue-500">
                  <span className="text-3xl">🏛️</span>
                  <div>
                    <p className="font-bold text-blue-600 dark:text-blue-400">Domain = The Rules</p>
                    <p className="text-sm text-muted-foreground">What is a &quot;User&quot;? What data do they have? These are the basic rules everyone follows.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                  <span className="text-3xl">📝</span>
                  <div>
                    <p className="font-bold text-green-600 dark:text-green-400">Application = The Processes</p>
                    <p className="text-sm text-muted-foreground">How do we log someone in? How do we save data? The step-by-step processes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-orange-500/10 rounded-lg border-l-4 border-orange-500">
                  <span className="text-3xl">🔌</span>
                  <div>
                    <p className="font-bold text-orange-600 dark:text-orange-400">Infrastructure = The Tools</p>
                    <p className="text-sm text-muted-foreground">Connections to databases, AI services, external APIs. The actual tools we use.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
                  <span className="text-3xl">🎨</span>
                  <div>
                    <p className="font-bold text-purple-600 dark:text-purple-400">Presentation = What Users See</p>
                    <p className="text-sm text-muted-foreground">Buttons, forms, pages - everything the user interacts with.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why This Matters */}
          <Card>
            <CardHeader>
              <CardTitle>Why Organize Code This Way?</CardTitle>
              <CardDescription>It makes everything easier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border-2 rounded-lg text-center">
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="font-bold">Easy to Find</p>
                  <p className="text-sm text-muted-foreground">Need to change how a button looks? Go to presentation. Need to fix login? Go to infrastructure.</p>
                </div>
                <div className="p-4 border-2 rounded-lg text-center">
                  <span className="text-4xl block mb-2">🔧</span>
                  <p className="font-bold">Easy to Change</p>
                  <p className="text-sm text-muted-foreground">Want to switch from one AI to another? Only change the infrastructure folder. Nothing else breaks.</p>
                </div>
                <div className="p-4 border-2 rounded-lg text-center">
                  <span className="text-4xl block mb-2">👥</span>
                  <p className="font-bold">Easy to Collaborate</p>
                  <p className="text-sm text-muted-foreground">One person works on UI, another on APIs. They won&apos;t step on each other&apos;s toes.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Folder Structure Visual */}
          <Card>
            <CardHeader>
              <CardTitle>The Folder Structure</CardTitle>
              <CardDescription>Where to find things</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="font-mono text-sm bg-muted p-4 rounded-lg">
                  <pre>{`src/
├── domain/        🏛️ Rules
├── application/   📝 Processes
├── infrastructure/🔌 Tools
├── presentation/  🎨 UI
└── app/          📄 Pages`}</pre>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Quick guide:</strong></p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Want to add a new page? → <code className="bg-muted px-1 rounded">app/</code></li>
                    <li>• Want to change how something looks? → <code className="bg-muted px-1 rounded">presentation/</code></li>
                    <li>• Want to connect to a new API? → <code className="bg-muted px-1 rounded">infrastructure/</code></li>
                    <li>• Want to define new data types? → <code className="bg-muted px-1 rounded">domain/</code></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Auth Flow Tab */}
      {activeTab === 'auth' && (
        <div className="space-y-6">
          {/* Simple Explanation */}
          <Card className="border-2 border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lock className="h-6 w-6 text-yellow-500" />
                Think of It Like a Hotel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base">
                <strong>When you check into a hotel:</strong>
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-500/10 rounded-lg">
                  <span className="text-3xl">🪪</span>
                  <div>
                    <p className="font-bold">You show your ID (Email + Password)</p>
                    <p className="text-sm text-muted-foreground">The front desk checks if you have a reservation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg">
                  <span className="text-3xl">🔑</span>
                  <div>
                    <p className="font-bold">You get a room key (Access Token)</p>
                    <p className="text-sm text-muted-foreground">This lets you into your room, the gym, the pool... but it expires at checkout</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-lg">
                  <span className="text-3xl">📋</span>
                  <div>
                    <p className="font-bold">Your reservation stays in the system (Refresh Token)</p>
                    <p className="text-sm text-muted-foreground">Even if you lose your key, you can get a new one because your reservation is saved</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two Types of Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Two Types of &quot;Keys&quot;</CardTitle>
              <CardDescription>We use two tokens for security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 border-2 border-yellow-500 rounded-xl bg-yellow-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="h-8 w-8 text-yellow-500" />
                    <h3 className="text-lg font-bold">Access Token</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Like a day pass</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Expires quickly (15 min)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Kept in the app&apos;s memory</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Used for every action you take</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 border-2 border-green-500 rounded-xl bg-green-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Cookie className="h-8 w-8 text-green-500" />
                    <h3 className="text-lg font-bold">Refresh Token</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Like your reservation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Lasts longer (7 days)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Stored securely in a cookie</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Used to get new access tokens</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Step by Step */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens When You Login</CardTitle>
              <CardDescription>Step by step, super simple</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                  <div className="flex-1">
                    <p className="font-medium">You type your email and password</p>
                  </div>
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">2</div>
                  <div className="flex-1">
                    <p className="font-medium">Server checks: &quot;Is this correct?&quot;</p>
                  </div>
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">3</div>
                  <div className="flex-1">
                    <p className="font-medium">Server gives you both tokens</p>
                  </div>
                  <Key className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">4</div>
                  <div className="flex-1">
                    <p className="font-medium">You&apos;re in! Access token lets you do things</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Two Tokens */}
          <Card className="border-2 border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Why Is This Secure?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <EyeOff className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">The refresh token is INVISIBLE to hackers</p>
                    <p className="text-sm text-muted-foreground">
                      It&apos;s stored in a special cookie that JavaScript can&apos;t read. Even if someone hacks the page, they can&apos;t steal it.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Access tokens expire fast</p>
                    <p className="text-sm text-muted-foreground">
                      Even if someone steals your access token, it only works for 15 minutes. Then they&apos;d need the refresh token (which they can&apos;t get).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tech Stack Tab */}
      {activeTab === 'stack' && (
        <div className="space-y-6">
          {/* Simple Explanation */}
          <Card className="border-2 border-purple-500/50 bg-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Box className="h-6 w-6 text-purple-500" />
                Our Toolbox
              </CardTitle>
              <CardDescription>
                Think of these like tools in a workshop. Each one does a specific job.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Building the App */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🏗️</span>
                  Building the App
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">Next.js</p>
                    <p className="text-xs text-muted-foreground">The main framework</p>
                  </div>
                  <Badge>Core</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">React</p>
                    <p className="text-xs text-muted-foreground">Makes buttons, forms, etc.</p>
                  </div>
                  <Badge>UI</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">TypeScript</p>
                    <p className="text-xs text-muted-foreground">Catches errors before they happen</p>
                  </div>
                  <Badge>Safety</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Making it Pretty */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Making it Pretty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">Tailwind CSS</p>
                    <p className="text-xs text-muted-foreground">Easy styling with class names</p>
                  </div>
                  <Badge>Styling</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">shadcn/ui</p>
                    <p className="text-xs text-muted-foreground">Pre-made beautiful components</p>
                  </div>
                  <Badge>Components</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">Lucide</p>
                    <p className="text-xs text-muted-foreground">All the icons you see</p>
                  </div>
                  <Badge>Icons</Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">Claude / GPT-4</p>
                    <p className="text-xs text-muted-foreground">Powers the AI chat</p>
                  </div>
                  <Badge>Chat</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">DALL-E / Imagen</p>
                    <p className="text-xs text-muted-foreground">Creates images from text</p>
                  </div>
                  <Badge>Images</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">OpenAI TTS</p>
                    <p className="text-xs text-muted-foreground">Turns text into speech</p>
                  </div>
                  <Badge>Audio</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Data Handling */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  Handling Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">TanStack Query</p>
                    <p className="text-xs text-muted-foreground">Fetches and caches data</p>
                  </div>
                  <Badge>Data</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">Axios</p>
                    <p className="text-xs text-muted-foreground">Makes HTTP requests</p>
                  </div>
                  <Badge>HTTP</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">Zod</p>
                    <p className="text-xs text-muted-foreground">Validates form inputs</p>
                  </div>
                  <Badge>Validation</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Swedish APIs */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🇸🇪</span>
                  Swedish Public APIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="font-medium">SMHI</p>
                    <p className="text-xs text-muted-foreground">Weather data</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="font-medium">Polisen</p>
                    <p className="text-xs text-muted-foreground">Police events</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="font-medium">JobTech</p>
                    <p className="text-xs text-muted-foreground">Job listings</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="font-medium">SCB</p>
                    <p className="text-xs text-muted-foreground">Statistics</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="font-medium">Trafikverket</p>
                    <p className="text-xs text-muted-foreground">Traffic info</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="font-medium">Göteborg</p>
                    <p className="text-xs text-muted-foreground">City services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
