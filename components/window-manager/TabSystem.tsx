"use client";

import { useState, useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TabSystem = () => {
  const { windows, activeWindowId, setActiveWindow, closeWindow, minimizeWindow } = useWindowStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyNavigation = (event: KeyboardEvent) => {
      if (event.shiftKey && (event.key === "ArrowRight" || event.key === "ArrowLeft") && windows.length > 1) {
        const currentIndex = windows.findIndex(window => window.id === activeWindowId);
        if (currentIndex === -1) return; 
        let nextIndex;
        if (event.key === "ArrowRight") {
          nextIndex = currentIndex + 1;
          if (nextIndex >= windows.length) return; 
        } else {
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) return; 
        }
        setActiveWindow(windows[nextIndex].id);
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyNavigation);
    return () => {
      window.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [windows, activeWindowId, setActiveWindow]);

  if (!mounted || windows.length === 0) return null;

  const toggleActiveWindow = (windowId: string, active: boolean)=>{
    if(active){
      minimizeWindow(windowId);
    }else{
      setActiveWindow(windowId);
    }
  }

  let lastMiddleClickTime = 0;
  const middleClick = (event: React.MouseEvent, windowId: string)=>{
    const currentTime = Date.now();
    if(event.button === 1 && currentTime - lastMiddleClickTime < 400){
      closeWindow(windowId);
    }
    lastMiddleClickTime = currentTime;
  }

  return (
    <div className="bg-background p-1">
      <ScrollArea className="w-full" >
        <div className="flex space-x-1">
          {windows.map((window) => (
            <ContextMenu key={window.id}>
              <ContextMenuTrigger>
                <div
                  className={`px-4 py-2 rounded-md cursor-pointer transition-colors flex items-center max-w-[200px] truncate ${
                    window.id === activeWindowId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary/80"
                  }`}
                  onClick={() => toggleActiveWindow(window.id, window.id === activeWindowId)}
                  onMouseDown={(event) => middleClick(event, window.id)}
                >
                  <span className="truncate">{window.title}</span>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem className="cursor-pointer" onClick={() => setActiveWindow(window.id)}>
                  Göster
                </ContextMenuItem>
                <ContextMenuItem className="cursor-pointer" onClick={() => closeWindow(window.id)}>
                  Kapat
                </ContextMenuItem>
                <ContextMenuItem className="cursor-pointer" onClick={() => minimizeWindow(window.id)}>
                  Simge Durumuna Küçült
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};