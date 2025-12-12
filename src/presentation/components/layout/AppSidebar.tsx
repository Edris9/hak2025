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
import { Home, MessageSquare, ImageIcon, Volume2, Globe, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserNav } from './UserNav';

const menuItems = [
  { title: 'Dashboard', icon: Home, href: '/dashboard' },
  { title: 'AI Chat', icon: MessageSquare, href: '/chat' },
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
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Clean App</h2>
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
