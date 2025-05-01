"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Search, 
  User, 
  LogOut,
  X,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useWindowStore } from "@/store/windowStore";
import { 
  findMenuItemById, 
  searchMenuItems, 
  leftMenuItems,
  rightMenuItems,
  MenuItem 
} from "@/config/menuConfig";

interface HeaderProps {
  user: { name: string;
    email?: string;
    role?: string;
    avatar?: string;
    [key: string]: unknown; };
}

// Tekil arama sonuç öğesi
interface UniqueSearchResult {
  id: string;        // Menü ID'si
  uniqueKey: string; // Benzersiz anahtar (React için)
  title: string;     // Başlık
  icon?: React.ReactNode;
  breadcrumb: string;
}

export const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const { openWindow, hideAllWindow, closeAllWindow } = useWindowStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UniqueSearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1); // Seçili sonuç indeksi
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasNotifications = true; // Bildirim varsa true olarak ayarlayabilirsiniz
  const [sessionDuration, setSessionDuration] = useState("0 Dakika 0 Saniye");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    toast.success("Çıkış yapıldı");
    router.push("/auth/login");
  };

  // Tıklama işlemini ele al: sol tıklama gizle, sağ tıklama kapat
  const handleTitleClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Varsayılan işlemi engelle
    
    // Sağ tık kontrolü
    if (event.button === 2) {
      // Sağ tıklama: Tüm pencereleri kapat
      closeAllWindow();
      toast.info("Tüm pencereler kapatıldı");
    } else {
      // Sol tıklama: Tüm pencereleri gizle
      hideAllWindow();
      toast.info("Tüm pencereler gizlendi");
    }
  };

  // Sağ tık menüsünü devre dışı bırak ve özel işlemi etkinleştir
  useEffect(() => {
    const titleElement = document.getElementById("app-title");
    
    // Sağ tık menüsünü engelle
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    if (titleElement) {
      titleElement.addEventListener("contextmenu", disableContextMenu);
    }
    
    return () => {
      if (titleElement) {
        titleElement.removeEventListener("contextmenu", disableContextMenu);
      }
    };
  }, []);

  const calculateSessionDuration = () => {
    const loginDateStr = localStorage.getItem("loginDate");
    
    if (!loginDateStr) {
      return "Bilinmiyor";
    }
    
    try {
      const loginDate = new Date(loginDateStr);
      const now = new Date();
      const diffMs = now.getTime() - loginDate.getTime();
      
      // Saat, dakika ve saniye hesaplaması
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      // Formatlanmış süre
      let formattedDuration = "";
      
      if (hours > 0) {
        formattedDuration += `${hours} Saat ` + `${minutes} Dakika `;
      }else{
        formattedDuration += `${minutes} Dakika ${seconds} Saniye`;
      }
      
      
      
      return formattedDuration;
    } catch (error) {
      console.error("Oturum süresi hesaplanırken hata oluştu:", error);
      return "Hesaplanamadı";
    }
  };

  useEffect(() => {
    const updateSessionTime = () => {
      setSessionDuration(calculateSessionDuration());
    };
    
    // İlk hesaplama
    updateSessionTime();
    
    // Her saniye güncelle
    const interval = setInterval(updateSessionTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Menü öğesine göre pencere açma fonksiyonu
  const openMenuItemWindow = (id: string) => {
    const menuItem = findMenuItemById(id);
    
    if (menuItem) {
      // Özel durum: Çıkış yapma işlemi
      if (id === 'logout') {
        handleLogout();
        return;
      }
      
      // İçerik oluştur
      let content;
      
      if (menuItem.component) {
        // Doğrudan bileşeni kullan
        content = <menuItem.component onClose={() => useWindowStore.getState().closeWindow(id)} />;
      } else if (menuItem.componentName) {
        // componentName mevcut ama component değil - varsayılan içerik göster
        content = <div className="p-4">{menuItem.title} içeriği burada olacak</div>;
      } else {
        // Hem component hem componentName yoksa varsayılan içerik
        content = <div className="p-4">{menuItem.title} içeriği burada olacak</div>;
      }
      
      // Pencereyi aç
      openWindow({
        id,
        title: menuItem.title,
        content,
      });
      
      // Arama kutusunu temizle ve sonuçları kapat
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      setSelectedResultIndex(-1); // Seçili sonuç indeksini sıfırla
      
      return true;
    } else {
      // Menü öğesi bulunamadıysa hata göster
      toast.error(`"${id}" için geçerli bir menü öğesi bulunamadı.`, {
        icon: <AlertCircle className="h-5 w-5" />
      });
      return false;
    }
  };

  // Menü öğesinin breadcrumb yolunu bul
  const getMenuItemBreadcrumb = (targetId: string): string => {
    const findPathInMenu = (items: MenuItem[], id: string, path: string[] = []): string[] | null => {
      for (const item of items) {
        const currentPath = [...path, item.title];
        
        if (item.id === id) {
          return currentPath;
        }
        
        if (item.children?.length) {
          const foundPath = findPathInMenu(item.children, id, currentPath);
          if (foundPath) return foundPath;
        }
      }
      
      return null;
    };
    
    // Önce sol menüde ara
    let breadcrumbPath = findPathInMenu(leftMenuItems, targetId);
    
    // Bulunamadıysa sağ menüde ara
    if (!breadcrumbPath) {
      breadcrumbPath = findPathInMenu(rightMenuItems, targetId);
    }
    
    // Yol bulunduysa breadcrumb formatında döndür
    if (breadcrumbPath && breadcrumbPath.length > 1) {
      // Son öğeyi çıkar ve breadcrumb oluştur
      const lastIndex = breadcrumbPath.length - 1;
      return breadcrumbPath.slice(0, lastIndex).join(' > ');
    }
    
    return '';
  };

  // Arama sonuçlarını oluştur ve tekrarları önle
  const buildUniqueSearchResults = (query: string): UniqueSearchResult[] => {
    if (!query.trim()) return [];
    
    const results = searchMenuItems(query);
    const uniqueResults: UniqueSearchResult[] = [];
    const processedTitles = new Set<string>();
    let counter = 1; // Benzersiz key için sayaç
    
    // Hem component özelliği olan hem de olmayan tüm sonuçları işle
    for (const item of results) {
      // Eğer bu başlık zaten işlendiyse atla
      if (processedTitles.has(item.title)) continue;
      
      const breadcrumb = getMenuItemBreadcrumb(item.id);
      const uniqueKey = `result-${counter++}`; // Benzersiz key oluştur
      
      uniqueResults.push({
        id: item.id,
        uniqueKey,
        title: item.title,
        icon: item.icon,
        breadcrumb
      });
      
      // Bu başlığı işlenmiş olarak işaretle
      processedTitles.add(item.title);
    }
    
    return uniqueResults;
  };

  // Arama sonuçlarını göster/gizle
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const uniqueResults = buildUniqueSearchResults(searchQuery);
      setSearchResults(uniqueResults);
      setShowSearchResults(uniqueResults.length > 0);
      setSelectedResultIndex(-1); // Yeni sonuçlar oluşturulduğunda seçili indeksi sıfırla
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setSelectedResultIndex(-1); // Sonuçlar temizlendiğinde seçili indeksi sıfırla
    }
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Seçili sonuç değiştiğinde scroll işlemini gerçekleştir
  useEffect(() => {
    if (selectedResultIndex >= 0) {
      // Bu setTimeout, DOM'un güncellenme şansı olması için küçük bir gecikme ekler
      setTimeout(() => scrollToSelectedResult(selectedResultIndex), 10);
    }
  }, [selectedResultIndex]);

  // Arama formu gönderildiğinde
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
      // Seçili bir sonuç varsa onu aç
      openMenuItemWindow(searchResults[selectedResultIndex].id);
    } else if (searchResults.length === 1) {
      // Tek sonuç varsa ve seçili değilse onu aç
      openMenuItemWindow(searchResults[0].id);
    } else if (searchResults.length > 1) {
      // Birden fazla sonuç varsa ve hiçbiri seçili değilse, ilkini seç
      setSelectedResultIndex(0);
    } else {
      toast.info(`"${searchQuery}" için sonuç bulunamadı.`);
    }
  };

  // Sonuç listesinde seçili öğeye scroll yapma fonksiyonu
  const scrollToSelectedResult = (index: number) => {
    if (index === -1) return; // Seçili öğe yoksa işlemi atla
    
    const resultsContainer = document.querySelector('.search-results-container');
    const selectedElement = document.querySelector(`.search-result-item:nth-child(${index + 1})`);
    
    if (resultsContainer && selectedElement) {
      // Seçili öğenin konteyner içindeki konumunu hesapla
      const containerRect = resultsContainer.getBoundingClientRect();
      const elementRect = selectedElement.getBoundingClientRect();
      
      // Seçili öğenin alt veya üst sınırdan taşıp taşmadığını kontrol et
      const isBelow = elementRect.bottom > containerRect.bottom;
      const isAbove = elementRect.top < containerRect.top;
      
      if (isBelow) {
        // Eğer seçili öğe alt sınırın dışındaysa, görünür olması için scroll yap
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else if (isAbove) {
        // Eğer seçili öğe üst sınırın dışındaysa, görünür olması için scroll yap
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  // Ok tuşları ve Enter tuşu için klavye olayı işleyicisi
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Sonuçlar görünür değilse hiçbir şey yapma
    if (!showSearchResults || searchResults.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault(); // Varsayılan davranışı engelle
        setSelectedResultIndex(prevIndex => {
          // Sonraki indekse geç, en sonda ise başa dön
          const nextIndex = prevIndex + 1;
          const newIndex = nextIndex >= searchResults.length ? 0 : nextIndex;
          
          // Biraz gecikme ekleyerek, state güncellemesinden sonra scroll yap
          setTimeout(() => scrollToSelectedResult(newIndex), 0);
          
          return newIndex;
        });
        break;
        
      case "ArrowUp":
        e.preventDefault(); // Varsayılan davranışı engelle
        setSelectedResultIndex(prevIndex => {
          // Önceki indekse geç, en başta ise sona dön
          const prevIdx = prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1;
          
          // Biraz gecikme ekleyerek, state güncellemesinden sonra scroll yap
          setTimeout(() => scrollToSelectedResult(prevIdx), 0);
          
          return prevIdx;
        });
        break;
        
      case "Enter":
        // Enter tuşuna basıldığında ve bir sonuç seçiliyse
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          e.preventDefault();
          openMenuItemWindow(searchResults[selectedResultIndex].id);
        }
        break;
        
      case "Escape":
        // ESC tuşuna basıldığında sonuçları kapat
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
        setSearchQuery("");
        break;
    }
  };

  // Arama sonuçları dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ESC tuşuna basıldığında arama sonuçlarını kapat
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Arama sonuçlarını ESC ile kapat
      if (e.key === "Escape" && showSearchResults) {
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
      }
      
      // Arama kutusuna odaklanmak için F1 tuşu
      if (e.key === "F1" && !showSearchResults && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [showSearchResults]);

  const openUserSettings = () => {
    openMenuItemWindow("user-settings");
  };

  const openNotifications = () => {
    openMenuItemWindow("notifications");
  };

  // Get user name safely
  const userName = user?.name || "UĞUR IŞIK";

  return (
    <header className="bg-background px-4 py-2.5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center space-x-4">
        <h1 
          id="app-title" 
          className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent cursor-pointer select-none"
          onMouseDown={handleTitleClick} // MouseDown kullanarak hem sol hem sağ tıklamaları yakalayabiliyoruz
        >
          DEFSU
        </h1>
        
        <div className="relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative w-72">
            <div className="relative flex items-center group">
              <div className="absolute left-3 text-muted-foreground/70 group-focus-within:text-primary transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Menü ara... (F1 ile arama yapabilirsiniz)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown} // Klavye olaylarını dinle
                className="pl-9 pr-8 rounded-full bg-muted/40 focus-visible:bg-background border-muted-foreground/20 focus-visible:border-primary/30 transition-all"
                onClick={() => {
                  if (searchResults.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
              />
              {searchQuery && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-70 hover:opacity-100"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowSearchResults(false);
                    setSelectedResultIndex(-1);
                    inputRef.current?.focus();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </form>
          
          {/* Arama Sonuçları Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute mt-1.5 w-full bg-card border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto overflow-x-hidden search-results-container">
              <div className="py-1.5 px-3 text-xs font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
                {searchResults.length} sonuç bulundu
              </div>
              <div className="p-1">
                {searchResults.map((item, index) => (
                  <button
                    key={item.uniqueKey}
                    type="button"
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-start gap-2.5 group search-result-item ${
                      index === selectedResultIndex ? 'bg-muted' : 'hover:bg-muted/70'
                    }`}
                    onClick={() => openMenuItemWindow(item.id)}
                    onMouseEnter={() => setSelectedResultIndex(index)} // Fare üzerine geldiğinde seç
                  >
                    <div className="flex-shrink-0 h-5 w-5 mt-0.5 text-muted-foreground">
                      {item.icon || <ChevronRight className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      {item.breadcrumb && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.breadcrumb}
                        </div>
                      )}
                    </div>
                    <div className={`text-xs text-muted-foreground transition-opacity ml-2 mt-0.5 ${
                      index === selectedResultIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      Aç
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9 relative hover:bg-muted transition-colors" 
          title="Bildirimler" 
          onClick={openNotifications}
        >
          <Bell className="h-[18px] w-[18px]" />
          {hasNotifications && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full border border-background"></span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 ml-1 hover:bg-muted transition-colors px-3 rounded-full"
            >
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Oturum Süresi: {sessionDuration}
              <div className="font-medium text-sm text-foreground mt-0.5">{userName}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openUserSettings} className="cursor-pointer flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Kullanıcı Ayarları</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};