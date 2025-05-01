"use client";

import { useState, useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";
import { useShortcutStore, Shortcut } from "@/store/shortcutStore";
import { Button } from "@/components/ui/button";
import { 
  X as CloseIcon, 
  Minus as MinimizeIcon, 
  Star as ShortcutIcon,
  LayoutGrid as WindowIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WindowHeaderProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

export const WindowHeader = ({ id, title, icon }: WindowHeaderProps) => {
  const { closeWindow, minimizeWindow } = useWindowStore();
  const { hasShortcut, toggleShortcut } = useShortcutStore();
  const [isShortcut, setIsShortcut] = useState(false);
  
  // Kısayol durumunu kontrol et
  useEffect(() => {
    setIsShortcut(hasShortcut(id));
  }, [hasShortcut, id]);

  const handleClose = () => {
    // Burada ileride içerik kaydetme kontrolü yapılabilir
    closeWindow(id);
  };

  const handleMinimize = () => {
    minimizeWindow(id);
  };

  const handleToggleShortcut = () => {
    // Kısayol ekle/kaldır
    const shortcut: Shortcut = {
      id,
      title
    };
    
    toggleShortcut(shortcut);
    
    // Durum güncelleme
    setIsShortcut(!isShortcut);
    
    // Bildirim göster
    if (!isShortcut) {
      toast.success("Kısayol eklendi");
    } else {
      toast.info("Kısayol kaldırıldı");
    }
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-gradient-to-b from-secondary/30 to-secondary/10 rounded-t-lg  shadow-sm select-none">
      <div className="flex items-center space-x-2 text-foreground">
        <div className="flex-shrink-0 text-primary/70">
          {icon || <WindowIcon size={16} />}
        </div>
        <h2 className="text-sm font-semibold tracking-tight truncate max-w-[260px]">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleShortcut}
          title={isShortcut ? "Kısayollardan Kaldır" : "Kısayol Ekle"}
          className={cn(
            "h-6 w-6 rounded-full hover:bg-secondary transition-all cursor-pointer", 
            isShortcut ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-primary"
          )}
        >
          <ShortcutIcon className={`h-3.5 w-3.5 ${isShortcut ? 'fill-yellow-500' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          title="Simge Durumuna Küçült"
          className="h-6 w-6 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-all cursor-pointer"
        >
          <MinimizeIcon className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          title="Kapat"
          className="h-6 w-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-all cursor-pointer"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};