'use client';

import { useAuth } from '@/presentation/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ImageIcon,
  Globe,
  GraduationCap,
  Cpu,
  Cloud,
  Shield,
  Palette
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Hero + Gift Side by Side */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Hero Header - Compact */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border-2 border-primary/30 dark:border-primary/20 p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Welcome back, {user?.firstName || 'Guest'}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your dashboard for AI-powered development. Explore features, test APIs, and build something amazing.
          </p>
        </div>

        {/* Gift Message - Compact */}
        <Card className="border-2 border-yellow-500/40 dark:border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-400 flex items-center justify-center">
                <Image
                  src="/infinetcodecube.png"
                  alt="InFiNet Code"
                  width={28}
                  height={28}
                  className="rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm flex items-center gap-1.5">
                  A Gift From InFiNet Code
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                </h3>
                <p className="text-xs text-muted-foreground">
                  Hey {user?.firstName || 'there'}! This template is packed with AI features & Swedish APIs. Build something amazing!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-border/60 dark:border-border hover:border-primary/40 transition-colors">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-semibold truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border/60 dark:border-border hover:border-primary/40 transition-colors">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-2">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-semibold truncate">
                  {user?.email || 'Loading...'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border/60 dark:border-border hover:border-primary/40 transition-colors">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-semibold">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'Loading...'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start - Compact Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Start</h2>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Link href="/chat" className="group">
            <Card className="h-full border-2 border-border/60 dark:border-border hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm flex items-center gap-1">
                  AI Chat
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground">Claude, GPT-4, Gemini</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/image-gen" className="group">
            <Card className="h-full border-2 border-border/60 dark:border-border hover:border-purple-500/50 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200 hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm flex items-center gap-1">
                  Image Gen
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground">DALL-E 3, Imagen</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/api-explorer" className="group">
            <Card className="h-full border-2 border-border/60 dark:border-border hover:border-green-500/50 hover:shadow-md hover:shadow-green-500/5 transition-all duration-200 hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm flex items-center gap-1">
                  API Explorer
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground">Swedish public APIs</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tutorials" className="group">
            <Card className="h-full border-2 border-border/60 dark:border-border hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-200 hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm flex items-center gap-1">
                  Tutorials
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground">DB, payments, email</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* What's Included - Compact */}
      <Card className="border-2 border-border/60 dark:border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">What&apos;s Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">AI Features</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>Multi-provider Chat</li>
                <li>Image Generation</li>
                <li>Text-to-Speech</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-green-500" />
                <span className="font-medium text-sm">Swedish APIs</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>SMHI, Polisen</li>
                <li>JobTech, SCB</li>
                <li>Trafikverket, GBG</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">Architecture</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>Clean Architecture</li>
                <li>TypeScript strict</li>
                <li>Auth & security</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-sm">UI & DX</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>shadcn/ui</li>
                <li>Dark/Light mode</li>
                <li>TanStack Query</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
