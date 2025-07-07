'use client';

import { Home, Hash, Bell, MessageCircle, Bookmark, User, Settings, TrendingUp, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SocialSidebarProps {
  currentUser?: {
    name: string;
    id: string;
  };
}

export function SocialSidebar({ currentUser }: SocialSidebarProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const trendingTopics = [
    { tag: '#WebDevelopment', posts: '12.5K posts' },
    { tag: '#NextJS', posts: '8.2K posts' },
    { tag: '#TypeScript', posts: '15.3K posts' },
    { tag: '#React', posts: '25.1K posts' },
    { tag: '#TailwindCSS', posts: '6.8K posts' },
  ];

  const suggestedUsers = [
    { name: 'Sarah Chen', handle: '@sarahdev', mutual: 3 },
    { name: 'Alex Rodriguez', handle: '@alexcodes', mutual: 7 },
    { name: 'Maya Patel', handle: '@mayatech', mutual: 2 },
  ];

  return (
    <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:pt-16">
      <div className="flex flex-col h-full bg-background border-r overflow-y-auto">
        <div className="flex-1 px-4 py-6 space-y-6">
          {/* User Profile Card */}
          {currentUser && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{currentUser.name}</h3>
                    <p className="text-sm text-muted-foreground">@{currentUser.name.toLowerCase().replace(' ', '')}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">127</div>
                    <div className="text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">1.2K</div>
                    <div className="text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">2.8K</div>
                    <div className="text-muted-foreground">Followers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <Button variant="default" className="w-full justify-start" size="lg">
              <Home className="mr-3 h-5 w-5" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Hash className="mr-3 h-5 w-5" />
              Explore
            </Button>
            <Button variant="ghost" className="w-full justify-start relative" size="lg">
              <Bell className="mr-3 h-5 w-5" />
              Notifications
              <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-xs bg-red-500">3</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-start relative" size="lg">
              <MessageCircle className="mr-3 h-5 w-5" />
              Messages
              <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-xs bg-blue-500">2</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Bookmark className="mr-3 h-5 w-5" />
              Bookmarks
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <User className="mr-3 h-5 w-5" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
          </nav>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex flex-col space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                  <span className="font-medium text-blue-600 hover:text-blue-700">{topic.tag}</span>
                  <span className="text-xs text-muted-foreground">{topic.posts}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggested Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5" />
                Who to follow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.handle}</div>
                      <div className="text-xs text-muted-foreground">{user.mutual} mutual connections</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Follow</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </aside>
  );
}
