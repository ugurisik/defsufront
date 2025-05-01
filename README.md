# DEFSU Admin Panel - Kullanım Kılavuzu

Bu belge, DEFSU Admin Panel'in nasıl kullanılacağını ve geliştirilecek yeni özelliklerin nasıl entegre edileceğini açıklamaktadır.

## İçindekiler

1. [Kurulum](#kurulum)
2. [Proje Yapısı](#proje-yapısı)
3. [Menü Sistemi](#menü-sistemi)
4. [Window Manager](#window-manager)
5. [Tema Ayarları](#tema-ayarları)
6. [Klavye Kısayolları](#klavye-kısayolları)
7. [Özel Pencere Tipleri](#özel-pencere-tipleri)
8. [Pencereler Arası Etkileşim](#pencereler-arası-etkileşim)

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Proje Yapısı

```
/app                  # Next.js App Router
  /auth               # Kimlik doğrulama sayfaları
    /login            # Giriş sayfası
  /dashboard          # Ana dashboard sayfası
/components           # React bileşenleri
  /layout             # Layout bileşenleri
  /ui                 # UI bileşenleri
  /windows            # Pencere içerikleri
/hooks                # Custom React hooks
/lib                  # Yardımcı fonksiyonlar
/store                # Zustand state yönetimi
/public               # Statik dosyalar
```

## Menü Sistemi

### Menü Öğesi Ekleme

Menü öğeleri `components/layout/MenuPanel.tsx` dosyasında tanımlanmıştır. Yeni bir menü öğesi eklemek için:

1. `leftMenuItems` veya `rightMenuItems` dizisine yeni bir öğe ekleyin:

```tsx
const leftMenuItems: MenuItem[] = [
  {
    id: "definitions",
    title: "Tanımlar",
    icon: <Database className="h-5 w-5" />,
    children: [
      {
        id: "system-definitions",
        title: "Sistem",
        onClick: () => handleOpenWindow("system-definitions", "Sistem Tanımları"),
        children: [
          {
            id: "business-settings",
            title: "İşletme Ayarları",
            onClick: () => handleOpenWindow("business-settings", "İşletme Ayarları"),
          },
          // Yeni alt menü öğesi buraya eklenebilir
        ],
      },
      // Yeni menü öğesi buraya eklenebilir
    ],
  },
  // Yeni ana menü öğesi buraya eklenebilir
];
```

### Menü Öğesine Tıklama İşlemi

Menü öğesine tıklandığında bir pencere açmak için:

```tsx
{
  id: "my-new-menu",
  title: "Yeni Menü",
  onClick: () => handleOpenWindow("my-new-menu-id", "Yeni Menü Başlığı"),
}
```

## Window Manager

### Yeni Pencere İçeriği Oluşturma

1. `components/windows` klasöründe yeni bir bileşen oluşturun:

```tsx
// components/windows/MyNewWindow.tsx
"use client";

export const MyNewWindow = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Yeni Pencere İçeriği</h2>
      {/* Pencere içeriği buraya */}
    </div>
  );
};
```

2. Bu pencereyi `store/windowStore.ts` içinde tanımlayın:

```tsx
import { MyNewWindow } from "@/components/windows/MyNewWindow";

// windowContents nesnesine ekleyin
const windowContents = {
  "my-new-menu-id": <MyNewWindow />,
  // Diğer pencereler...
};
```

### Pencere Olaylarını Dinleme

Pencere kapanmadan önce bir işlem yapmak için:

```tsx
// components/windows/MyNewWindow.tsx
"use client";

import { useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";

export const MyNewWindow = () => {
  const { registerWindowEvent } = useWindowStore();
  
  useEffect(() => {
    // Pencere kapanmadan önce çalışacak fonksiyon
    const handleBeforeClose = () => {
      // Kaydetme işlemi veya kontrol
      const hasUnsavedChanges = true;
      
      if (hasUnsavedChanges) {
        // Kapatmayı engelle ve kullanıcıya sor
        return false;
      }
      
      // Kapatmaya izin ver
      return true;
    };
    
    // Olayı kaydet
    registerWindowEvent("my-new-menu-id", "beforeClose", handleBeforeClose);
    
    return () => {
      // Component unmount olduğunda olayı temizle
      unregisterWindowEvent("my-new-menu-id", "beforeClose");
    };
  }, []);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Yeni Pencere İçeriği</h2>
      {/* Pencere içeriği buraya */}
    </div>
  );
};
```

## Tema Ayarları

Tema ayarlarını `components/layout/ThemeSettings.tsx` dosyasında bulabilirsiniz. Yeni bir tema eklemek için:

```tsx
// components/layout/ThemeSettings.tsx
const themes = [
  { name: "light", label: "Açık" },
  { name: "dark", label: "Koyu" },
  { name: "corporate", label: "Kurumsal" },
  // Yeni tema buraya eklenebilir
  { name: "my-new-theme", label: "Yeni Tema" },
];
```

## Klavye Kısayolları

Klavye kısayolları `hooks/useKeyboardShortcuts.ts` dosyasında tanımlanmıştır. Yeni bir kısayol eklemek için:

```tsx
// hooks/useKeyboardShortcuts.ts
const useKeyboardShortcuts = (windowId: string) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC tuşu ile pencereyi kapat
      if (e.key === "Escape") {
        closeWindow(windowId);
      }
      
      // F10 tuşu ile kaydet
      if (e.key === "F10") {
        // Kaydetme işlemi
        console.log("Kaydet");
      }
      
      // Yeni kısayol buraya eklenebilir
      if (e.key === "F5") {
        // Yenileme işlemi
        console.log("Yenile");
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [windowId]);
};
```

## Özel Pencere Tipleri

### Alert Penceresi

Alert penceresi oluşturmak için:

```tsx
import { showAlert } from "@/lib/alert";

showAlert({
  title: "Dikkat",
  message: "Kaydedilirken bir sorun oluştu. Tekrar denemek ister misiniz?",
  buttons: [
    { label: "Evet", onClick: () => saveData() },
    { label: "Hayır", onClick: () => closeWindow() },
  ],
});
```

### Input Penceresi

Input penceresi oluşturmak için:

```tsx
import { showInputDialog } from "@/lib/dialog";

showInputDialog({
  title: "Fatura No Değiştir",
  fields: [
    { name: "invoiceNumber", label: "Yeni Fatura No", type: "text", defaultValue: "" },
    { name: "invoiceDate", label: "Fatura Tarihi", type: "date", defaultValue: "" },
  ],
  onSubmit: (values) => {
    console.log("Yeni değerler:", values);
    // İşlem yap
  },
});
```

### Sürüklenebilir Küçük Pencere

Sürüklenebilir küçük pencere oluşturmak için:

```tsx
import { openDraggableWindow } from "@/lib/draggableWindow";

openDraggableWindow({
  id: "invoice-list",
  title: "Fatura Listesi",
  content: <InvoiceList onSelect={handleInvoiceSelect} />,
  width: 600,
  height: 400,
});
```

## Pencereler Arası Etkileşim

Pencereler arası veri aktarımı için event sistemi kullanılır:

```tsx
// Veri gönderen pencere
import { windowEventBus } from "@/lib/windowEventBus";

const handleInvoiceSelect = (invoice) => {
  windowEventBus.emit("invoice-selected", invoice);
  closeDraggableWindow("invoice-list");
};

// Veri alan pencere
useEffect(() => {
  const handleInvoiceSelected = (invoice) => {
    console.log("Seçilen fatura:", invoice);
    // Fatura verilerini işle
  };
  
  windowEventBus.on("invoice-selected", handleInvoiceSelected);
  return () => windowEventBus.off("invoice-selected", handleInvoiceSelected);
}, []);
```

---

Daha detaylı bilgi için ilgili dosyaları inceleyebilir veya geliştirici ekibiyle iletişime geçebilirsiniz.
