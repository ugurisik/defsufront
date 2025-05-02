"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { WindowManager } from "@/components/window-manager/WindowManager";
import { MenuButton } from "@/components/layout/MenuButton";
import { Header } from "@/components/layout/Header";
import { TabSystem } from "@/components/window-manager/TabSystem";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

// Tip tanımı - User için interface yerine tipini belirtelim
type UserData = {
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: unknown; // Bilinmeyen diğer özellikler için
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Kullanıcının oturum açıp açmadığını kontrol et
    const accessToken = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    
    if (!accessToken || !userStr) {
      toast.error("Oturum açmanız gerekiyor");
      router.push("/auth/login");
      return;
    }
    try {
      const userData = JSON.parse(userStr) as UserData;
      setUser(userData);
    } catch (error) {
      console.error("User data parsing error:", error);
      toast.error("Kullanıcı bilgileri alınamadı");
      router.push("/auth/login");
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <Toaster position="top-right" />
        
        {/* Header - fixed 75px height */}
        <header className="h-[55px] flex-shrink-0">
          <Header user={user || { name: "", email: "", role: "", avatar: "" }} />
        </header>
        
        {/* Main Content - taking remaining space with scroll */}
        <main className="flex-1 h-[calc(100vh-150px)]">
          {/* Window Manager */}
          <WindowManager />
        </main>
        
        {/* Bottom Section - fixed 75px height */}
        <div className="h-[50px] flex-shrink-0 flex border-t z-50">
          {/* Menu Button - 100px width */}
          <div className="w-[75px] border-r flex items-center justify-center z-50 bg-background">
            <MenuButton />
          </div>
          
          {/* Tab System - remaining width */}
          <div className="flex-1">
            <TabSystem />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}