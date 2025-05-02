# DEFSU Admin Panel - Kullanım Kılavuzu

Bu belge, DEFSU Admin Panel'in nasıl kullanılacağını ve geliştirilecek yeni özelliklerin nasıl entegre edileceğini açıklamaktadır.

## İçindekiler

1. [Kurulum](#kurulum)
2. [Proje Yapısı](#proje-yapısı)
3. [Giriş Sayfası](#giriş-sayfası)
4. [Menü Sistemi](#menü-sistemi)
5. [Window Manager](#window-manager)
6. [Tab Sistemi](#tab-sistemi)
7. [Tema Ayarları](#tema-ayarları)
8. [Kısayollar](#kısayollar)
9. [Klavye Kısayolları](#klavye-kısayolları)
10. [Sağ Tık Menüsü](#sağ-tık-menüsü)
11. [Header Bileşeni](#header-bileşeni)

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev --turbopack
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Proje Yapısı

```
/app                    # Next.js App Router
  /auth                 # Kimlik doğrulama sayfaları
    /login              # Giriş sayfası
  /dashboard            # Ana dashboard sayfası
/components             # React bileşenleri
  /layout               # Layout bileşenleri (Header, MenuButton, MenuPanel)
  /theme                # Tema bileşenleri (ThemeProvider)
  /ui                   # ShadCN UI bileşenleri
  /window-manager       # Pencere yönetim bileşenleri (WindowManager, WindowHeader, TabSystem)
  /windows              # Pencere içerikleri (UserSettingsWindow vb.)
/config                 # Yapılandırma dosyaları (menuConfig)
/store                  # Zustand state yönetimi (windowStore, themeStore, shortcutStore)
/public                 # Statik dosyalar
```

## Giriş Sayfası

Giriş sayfası `/app/auth/login/page.tsx` dosyasında bulunmaktadır. Bu sayfa, kullanıcının sisteme giriş yapmasını sağlar.

### Giriş İşlemi

Giriş işlemi için DummyJSON API kullanılmaktadır:

```tsx
// Örnek giriş işlemi
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "emilys",
      password: "emilyspass"
    }),
  });

  const data = await response.json();
  
  // Token'ları sakla
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  
  // Kullanıcı bilgilerini sakla
  localStorage.setItem("user", JSON.stringify({
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    year: formData.year
  }));
  
  // Dashboard'a yönlendir
  router.push("/dashboard");
};
```

## Menü Sistemi

Menü sistemi, `components/layout/MenuPanel.tsx` ve `config/menuConfig.tsx` dosyalarında tanımlanmıştır.

### Menü Yapılandırması

Menü öğeleri `config/menuConfig.tsx` dosyasında tanımlanır:

```tsx
// Menü öğelerini tanımlayan tip
export interface MenuItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  componentName?: string;
  component?: React.ComponentType<any>;
  keywords?: string[]; // Arama için ek anahtar kelimeler
  children?: MenuItem[];
}

// Sol menü öğeleri
export const leftMenuItems: MenuItem[] = [
  {
    id: 'definitions',
    title: 'Tanımlar',
    icon: <Database className="h-5 w-5" />,
    children: [
      // Alt menü öğeleri
    ]
  }
];

// Sağ menü öğeleri
export const rightMenuItems: MenuItem[] = [
  // Sağ menü öğeleri
];
```

### Yeni Menü Öğesi Ekleme

Yeni bir menü öğesi eklemek için `config/menuConfig.tsx` dosyasında ilgili diziye ekleme yapın:

```tsx
// Sol menüye yeni bir öğe eklemek
export const leftMenuItems: MenuItem[] = [
  // Mevcut öğeler...
  {
    id: 'new-menu',
    title: 'Yeni Menü',
    icon: <Icon className="h-5 w-5" />,
    children: [
      {
        id: 'new-submenu',
        title: 'Yeni Alt Menü',
        component: YeniPencereBileşeni
      }
    ]
  }
];
```

## Window Manager

Window Manager sistemi, `components/window-manager/WindowManager.tsx` ve `store/windowStore.ts` dosyalarında tanımlanmıştır.

### Pencere Açma

Bir pencere açmak için `useWindowStore` hook'unu kullanın:

```tsx
import { useWindowStore } from "@/store/windowStore";

const { openWindow } = useWindowStore();

// Pencere açma
openWindow({
  id: "unique-id",
  title: "Pencere Başlığı",
  content: <PencereİçeriğiBileşeni />
});
```

### Yeni Pencere İçeriği Oluşturma

1. `components/windows` klasöründe yeni bir bileşen oluşturun:

```tsx
// components/windows/YeniPencere.tsx
"use client";

export const YeniPencere = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Yeni Pencere İçeriği</h2>
      {/* Pencere içeriği */}
    </div>
  );
};
```

2. Bu bileşeni menü yapılandırmasına ekleyin:

```tsx
// config/menuConfig.tsx
import { YeniPencere } from "@/components/windows/YeniPencere";

export const leftMenuItems: MenuItem[] = [
  // ...
  {
    id: 'new-menu-item',
    title: 'Yeni Menü Öğesi',
    component: YeniPencere
  }
];
```

## Tab Sistemi

Tab sistemi, `components/window-manager/TabSystem.tsx` dosyasında tanımlanmıştır. Bu sistem, açık pencereleri alt kısımda sekmeler halinde gösterir.

### Tab Özellikleri

- Aktif sekme vurgulanır
- Sekmeye tıklayarak ilgili pencereyi aktif hale getirebilirsiniz
- Aktif sekmeye tıklayarak pencereyi simge durumuna küçültebilirsiniz
- Sekme üzerinde sağ tıklayarak bir bağlam menüsü açabilirsiniz
- Orta tıklama ile sekmeyi kapatabilirsiniz
- Shift+Sağ/Sol ok tuşları ile sekmeler arasında geçiş yapabilirsiniz

```tsx
// Sekme üzerinde sağ tık menüsü
<ContextMenuContent>
  <ContextMenuItem onClick={() => setActiveWindow(window.id)}>
    Göster
  </ContextMenuItem>
  <ContextMenuItem onClick={() => closeWindow(window.id)}>
    Kapat
  </ContextMenuItem>
  <ContextMenuItem onClick={() => minimizeWindow(window.id)}>
    Simge Durumuna Küçült
  </ContextMenuItem>
</ContextMenuContent>
```

## Tema Ayarları

Tema sistemi, `components/theme/ThemeProvider.tsx` ve `store/themeStore.ts` dosyalarında tanımlanmıştır.

### Mevcut Temalar

Sistem şu anda aşağıdaki temaları desteklemektedir:

- Indigo Frost
- Zümrüt Esinti
- Yakut Zarafeti
- Amber Altın
- Mor Rüya
- Okyanus Derinliği
- Orman Gölgesi
- Gül Yaprağı

### Tema Değiştirme

Tema değiştirmek için `useTheme` hook'unu kullanın:

```tsx
import { useTheme } from "@/components/theme/ThemeProvider";

const { setPaletteById, availablePalettes } = useTheme();

// Tema değiştirme
setPaletteById("theme-id");
```

### Yeni Tema Ekleme

Yeni bir tema eklemek için `store/themeStore.ts` dosyasına ekleyin:

```tsx
// store/themeStore.ts
const themePalettes: ThemePalette[] = [
  // Mevcut temalar...
  {
    id: 'new-theme',
    name: 'Yeni Tema',
    colors: {
      primary: '#hex-color',
      primary_foreground: '#hex-color',
      // Diğer renkler...
    }
  }
];
```

## Kısayollar

Kısayol sistemi, `store/shortcutStore.ts` dosyasında tanımlanmıştır. Bu sistem, sık kullanılan pencerelere hızlı erişim sağlar.

### Kısayol Ekleme/Kaldırma

Kısayol eklemek veya kaldırmak için `useShortcutStore` hook'unu kullanın:

```tsx
import { useShortcutStore } from "@/store/shortcutStore";

const { toggleShortcut, hasShortcut } = useShortcutStore();

// Kısayol ekle/kaldır
toggleShortcut({
  id: "window-id",
  title: "Pencere Başlığı"
});

// Kısayol var mı kontrol et
const isShortcut = hasShortcut("window-id");
```

## Klavye Kısayolları

Sistem şu klavye kısayollarını destekler:

- **End**: Aktif pencereyi kapatır
- **Shift + Sağ/Sol Ok**: Sekmeler arasında geçiş yapar
- **ESC**: Pencereyi kapatır (özelleştirilebilir)

Klavye kısayolları `components/window-manager/WindowManager.tsx` ve `components/window-manager/TabSystem.tsx` dosyalarında tanımlanmıştır.

### Özel Klavye Kısayolları Ekleme

Özel klavye kısayolları eklemek için:

```tsx
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // F10 tuşu ile kaydet
    if (event.key === "F10") {
      // Kaydetme işlemi
    }
  };
  
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

## Sağ Tık Menüsü

Tab sistemi ve diğer bileşenler üzerinde sağ tık menüleri bulunmaktadır. Bu menüler, `@radix-ui/react-context-menu` bileşeni kullanılarak oluşturulmuştur.

### Özel Sağ Tık Menüsü Ekleme

Özel bir sağ tık menüsü eklemek için:

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger>
    <div>Sağ tıklanabilir öğe</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onClick={handleAction}>
      Menü Öğesi
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## Header Bileşeni

Header bileşeni, `components/layout/Header.tsx` dosyasında tanımlanmıştır. Bu bileşen, üst kısımda yer alır ve aşağıdaki özellikleri içerir:

- Uygulama başlığı
- Arama kutusu
- Bildirim ikonu
- Kullanıcı menüsü
- Oturum süresi göstergesi

### Arama Özelliği

Header'daki arama kutusu, menü öğelerini aramak için kullanılır:

```tsx
// Arama işlevi
const handleSearch = (query: string) => {
  if (query.trim() === "") {
    setSearchResults([]);
    setShowSearchResults(false);
    return;
  }
  
  // Menü öğelerini ara
  const results = searchMenuItems(query);
  
  // Sonuçları göster
  setSearchResults(results);
  setShowSearchResults(true);
};
```
