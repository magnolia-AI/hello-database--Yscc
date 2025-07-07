'use client';

import { TrendingUp, Users, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function RightSidebar() {
  const trendingTopics = [
    { 
      category: 'Technology', 
      tag: '#WebDevelopment', 
      posts: '12.5K posts',
      trend: '+15%'
    },
    { 
      category: 'Programming', 
      tag: '#NextJS', 
      posts: '8.2K posts',
      trend: '+8%'
    },
    { 
      category: 'Development', 
      tag: '#TypeScript', 
      posts: '15.3K posts',
      trend: '+22%'
    },
    { 
      category: 'Frontend', 
      tag: '#React', 
      posts: '25.1K posts',
      trend: '+5%'
    },
    { 
      category: 'CSS', 
      tag: '#TailwindCSS', 
      posts: '6.8K posts',
      trend: '+12%'
    },
  ];

  const suggestedUsers = [
    { 
      name: 'Sarah Chen', 
      handle: '@sarahdev', 
      bio: 'Full-stack developer at @vercel',
      followers: '12.5K',
      verified: true
    },
    { 
      name: 'Alex Rodriguez', 
      handle: '@alexcodes', 
      bio: 'React enthusiast & open source contributor',
      followers: '8.2K',
      verified: false
    },
    { 
      name: 'Maya Patel', 
      handle: '@mayatech', 
      bio: 'UI/UX Designer & Frontend Developer',
      followers: '15.3K',
      verified: true
    },
  ];

  const upcomingEvents = [
    {
      title: 'React Conference 2024',
      date: 'Dec 15, 2024',
      attendees: '2.5K',
      type: 'Virtual'
    },
    {
      title: 'Next.js Meetup',
      date: 'Dec 20, 2024',
      attendees: '150',
      type: 'In-person'
    },
    {
      title: 'TypeScript Workshop',
      date: 'Dec 22, 2024',
      attendees: '500',
      type: 'Virtual'
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <aside className="hidden xl:flex xl:w-80 xl:flex-col xl:fixed xl:inset-y-0 xl:right-0 xl:z-40 xl:pt-16">
      <div className="flex flex-col h-full bg-background border-l overflow-y-auto">
        <div className="flex-1 px-4 py-6 space-y-6">
          
          {/* Trending Topics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-xl font-bold">
                <TrendingUp className="mr-2 h-5 w-5 text-orange-500" />
                What's happening
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex flex-col space-y-1 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {topic.category} · Trending
                    </span>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {topic.trend}
                    </Badge>
                  </div>
                  <span className="font-bold text-foreground group-hover:text-blue-600 transition-colors">
                    {topic.tag}
                  </span>
                  <span className="text-sm text-muted-foreground">{topic.posts}</span>
                </div>
              ))}
              <Button variant="ghost" className="w-full justify-start text-blue-500 hover:text-blue-600">
                Show more
              </Button>
            </CardContent>
          </Card>

          {/* Who to Follow */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-xl font-bold">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                Who to follow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedUsers.map((user, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-sm hover:underline cursor-pointer">
                            {user.name}
                          </span>
                          {user.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.handle}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {user.bio}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {user.followers} followers
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-black text-white hover:bg-gray-800 rounded-full px-4 ml-2">
                      Follow
                    </Button>
                  </div>
                  {index < suggestedUsers.length - 1 && <Separator />}
                </div>
              ))}
              <Button variant="ghost" className="w-full justify-start text-blue-500 hover:text-blue-600">
                Show more
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-xl font-bold">
                <Calendar className="mr-2 h-5 w-5 text-green-500" />
                Upcoming events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="space-y-2 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.attendees} attending
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full justify-start text-blue-500 hover:text-blue-600">
                Show more
              </Button>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-xs text-muted-foreground space-y-2 px-4">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Cookie Policy</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Ads info</a>
              <a href="#" className="hover:underline">More</a>
            </div>
            <div className="pt-2">
              © 2024 Social, Inc.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
