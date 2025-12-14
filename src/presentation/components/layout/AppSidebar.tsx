'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Home, MessageSquare, ImageIcon, Volume2, Globe, BookOpen, GraduationCap, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserNav } from './UserNav';

const menuItems = [
  { title: 'Dashboard', icon: Home, href: '/dashboard' },
  { title: 'AI Chat', icon: MessageSquare, href: '/chat' },
  { title: 'LEMO Work', icon: ClipboardList, href: '/mypage' },
  { title: 'Image Gen', icon: ImageIcon, href: '/image-gen' },
  { title: 'Text to Speech', icon: Volume2, href: '/text-to-speech' },
  { title: 'API Explorer', icon: Globe, href: '/api-explorer' },
  { title: 'How It Works', icon: BookOpen, href: '/how-it-works' },
  { title: 'Tutorials', icon: GraduationCap, href: '/tutorials' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* Replace /logo.svg with your own logo */}
          <Image
            src="/infinetcodecube.png"
            alt="InFiNet Code"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">InFiNet Code</span>
            <span className="text-xs text-muted-foreground">Crafting the future</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
