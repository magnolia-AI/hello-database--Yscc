'use client';

import { Search, Bell, MessageCircle, Home, User, Hash, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SocialHeaderProps {
  currentUser?: {
    name: string;
    id: string;
  };
}

export function SocialHeader({ currentUser }: SocialHeaderProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Social
            </span>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts, people, topics..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Navigation & User Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Navigation Icons */}
          <Button variant="ghost" size="icon" className="relative">
            <Home className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Hash className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <MessageCircle className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-500">
              2
            </Badge>
          </Button>

          {/* User Avatar */}
          {currentUser && (
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
