'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { SidebarProvider } from '@/lib/SidebarContext';
import { AuthProvider } from '@/lib/AuthProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <AuthProvider>
            <SidebarProvider>
                {!isLoginPage && <Sidebar />}
                <main
                    className={`min-h-screen relative animate-in fade-in duration-500 transition-all ${!isLoginPage ? 'md:pl-[280px] pb-[100px] md:pb-0' : ''
                        }`}
                >
                    {children}
                </main>
                {!isLoginPage && <BottomNav />}
            </SidebarProvider>
        </AuthProvider>
    );
}
