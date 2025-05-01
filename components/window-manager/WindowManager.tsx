"use client";

import { useState, useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";
import { WindowHeader } from "./WindowHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

export type WindowType = {
  id: string;
  title: string;
  content: React.ReactNode;
  isActive: boolean;
  isMinimized: boolean;
};

export const WindowManager = () => {
  const { windows, activeWindowId, closeWindow } = useWindowStore();
  const [mounted, setMounted] = useState(false);

  // Hydration için
  useEffect(() => {
    setMounted(true);
  }, []);

  


  useEffect(() => {
    const activeWindow = windows.find((window) => window.id === activeWindowId);
    if(activeWindow !== undefined) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "End" || event.keyCode === 35) {
          closeWindow(activeWindow.id);
        }
      };
      
      window.addEventListener("keydown", handleKeyDown);
      
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [windows, activeWindowId, closeWindow]);
 

  if (!mounted) return null;

  // Aktif pencereyi bul
  const activeWindow = windows.find((window) => window.id === activeWindowId);

 

 

  // Eğer aktif pencere yoksa boş div döndür
  if (!activeWindow || activeWindow.isMinimized) {
    return <div className="flex-1 p-4"></div>;
  }

  return (
    <div className="flex flex-col">
      {/* Pencere Başlığı */}
      <WindowHeader id={activeWindow.id} title={activeWindow.title} />

      {/* Pencere İçeriği - Scrollable */}

      <div className="min-h-full h-[calc(100vh-150px)]  overflow-auto">
        <ScrollArea className="flex-1 p-4">{activeWindow.content}</ScrollArea>
      </div>
    </div>
  );
};
