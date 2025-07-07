import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { SocialHeader } from '@/components/SocialHeader'
import { SocialSidebar } from '@/components/SocialSidebar'
import { RightSidebar } from '@/components/RightSidebar'

export const metadata: Metadata = {
  title: 'SocialConnect',
  description: 'Connect, share, and discover with your community',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased bg-background">
        <ThemeProvider defaultTheme="light" attribute="class">
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <SocialHeader />
            
            {/* Main Layout */}
            <div className="flex-1 flex">
              {/* Left Sidebar - Hidden on mobile */}
              <aside className="hidden lg:block w-64 border-r bg-card">
                <SocialSidebar />
              </aside>
              
              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>
              
              {/* Right Sidebar - Hidden on mobile and tablet */}
              <aside className="hidden xl:block w-80 border-l bg-card">
                <RightSidebar />
              </aside>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
