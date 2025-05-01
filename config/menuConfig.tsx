import React from 'react';
import { 
  User, 
  Bell, 
  LogOut, 
  Settings, 
  FileText, 
  Database, 
  Printer 
} from "lucide-react";
import { UserSettingsWindow } from '@/components/windows/UserSettingsWindow';

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

// Sol menü öğelerini tanımlıyoruz
export const leftMenuItems: MenuItem[] = [
  {
    id: 'definitions',
    title: 'Tanımlar',
    icon: <Database className="h-5 w-5" />,
    keywords: ['veri', 'kayıt', 'tanımlama', 'parametre'],
    children: [
      {
        id: 'system',
        title: 'Sistem',
        keywords: ['sistem ayarları', 'yapılandırma', 'konfigürasyon'],
        children: [
          {
            id: 'system-settings',
            title: 'Sistem Tanımları',
            keywords: ['sistem ayarları', 'çalışma parametreleri', 'yapılandırma', 'global ayarlar', 'sistem yapılandırması'],
            component: (props: any) => <div className="p-4">Sistem Tanımları içeriği burada olacak</div>
          },
          {
            id: 'print-settings',
            title: 'Baskı Ayarları',
            keywords: ['yazıcı', 'basım', 'çıktı', 'yazdırma', 'yazıcı ayarları', 'kağıt boyutu', 'yazdırma tercihleri'],
            component: (props: any) => <div className="p-4">Baskı Ayarları içeriği burada olacak</div>
          },
          {
            id: 'company-settings',
            title: 'İşletme Ayarları',
            keywords: ['şirket', 'firma', 'kurum', 'işyeri', 'kurumsal bilgiler', 'şirket bilgileri', 'firma parametreleri'],
            component: (props: any) => <div className="p-4">İşletme Ayarları içeriği burada olacak</div>
          }
        ]
      },
      {
        id: 'users',
        title: 'Kullanıcılar',
        keywords: ['personel', 'çalışan', 'kullanıcı listesi', 'üyeler'],
        children: [
          {
            id: 'user-management',
            title: 'Kullanıcı Yönetimi',
            keywords: ['kullanıcı listesi', 'üye yönetimi', 'personel', 'hesap yönetimi', 'hesaplar', 'kullanıcı ekleme', 'kullanıcı silme'],
            component: (props: any) => <div className="p-4">Kullanıcı Yönetimi içeriği burada olacak</div>
          }
        ]
      }
    ]
  },
  {
    id: 'reports',
    title: 'Raporlar',
    icon: <FileText className="h-5 w-5" />,
    keywords: ['analiz', 'istatistik', 'özet bilgiler', 'raporlama', 'çıktılar'],
    children: [
      {
        id: 'financial-reports',
        title: 'Mali Raporlar',
        keywords: ['finans', 'muhasebe', 'gelir gider', 'ciro', 'finansal analiz', 'bütçe', 'ödeme', 'tahsilat'],
        component: (props: any) => <div className="p-4">Mali Raporlar içeriği burada olacak</div>
      },
      {
        id: 'stock-reports',
        title: 'Stok Raporları',
        keywords: ['envanter', 'depo', 'ürün', 'mal', 'stok durumu', 'stok hareketleri', 'ürün listesi', 'mal durumu'],
        component: (props: any) => <div className="p-4">Stok Raporları içeriği burada olacak</div>
      }
    ]
  }
];

// Sağ menü öğelerini tanımlıyoruz
export const rightMenuItems: MenuItem[] = [
  {
    id: 'user',
    title: 'Kullanıcı',
    icon: <User className="h-5 w-5" />,
    keywords: ['profil', 'kişisel', 'kullanıcı hesabı'],
    children: [
      {
        id: 'user-settings',
        title: 'Kullanıcı Ayarları',
        keywords: ['profil', 'hesap', 'şifre değiştirme', 'kişisel bilgiler', 'tema ayarları', 'dil ayarları', 'görünüm tercihleri', 'bildirim tercihleri'],
        component: UserSettingsWindow
      },
      {
        id: 'logout',
        title: 'Çıkış Yap',
        keywords: ['oturumu kapat', 'güvenli çıkış', 'hesaptan çık']
        // Özel durum: Çıkış yapma işlemi için component yok
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Bildirimler',
    icon: <Bell className="h-5 w-5" />,
    keywords: ['mesajlar', 'uyarılar', 'duyurular', 'bilgilendirmeler', 'sistem mesajları', 'hatırlatıcılar'],
    component: (props: any) => <div className="p-4">Bildirimler içeriği burada olacak</div>
  },
  {
    id: 'system-settings',
    title: 'Sistem Ayarları',
    icon: <Settings className="h-5 w-5" />,
    keywords: ['yapılandırma', 'konfigürasyon', 'sistem parametreleri', 'global ayarlar', 'program ayarları'],
    component: (props: any) => <div className="p-4">Sistem Ayarları içeriği burada olacak</div>
  }
];

// Menü öğelerini ve alt öğelerini ID'ye göre bulan yardımcı fonksiyon
export const findMenuItemById = (id: string): MenuItem | undefined => {
  // Sol menüde ara
  let result = findItemInMenuArray(leftMenuItems, id);
  if (result) return result;
  
  // Sağ menüde ara
  return findItemInMenuArray(rightMenuItems, id);
};

// Menü dizisinde öğe ara (recursive)
const findItemInMenuArray = (items: MenuItem[], id: string): MenuItem | undefined => {
  for (const item of items) {
    if (item.id === id) return item;
    
    if (item.children?.length) {
      const found = findItemInMenuArray(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

// Arama sorgusuna göre menü öğelerini bulan yardımcı fonksiyon
export const searchMenuItems = (query: string): MenuItem[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const results: MenuItem[] = [];
  
  // Sol ve sağ menülerde arama yap
  searchInMenuItems(leftMenuItems, lowerQuery, results);
  searchInMenuItems(rightMenuItems, lowerQuery, results);
  
  return results;
};

// Menü öğeleri içinde arama yap (recursive)
const searchInMenuItems = (items: MenuItem[], query: string, results: MenuItem[]): void => {
  for (const item of items) {
    // Başlıkta arama
    if (item.title.toLowerCase().includes(query)) {
      results.push(item);
    }
    // Anahtar kelimelerde arama
    else if (item.keywords?.some(keyword => keyword.toLowerCase().includes(query))) {
      results.push(item);
    }
    
    // Alt öğelerde arama
    if (item.children?.length) {
      searchInMenuItems(item.children, query, results);
    }
  }
};

// Menü öğelerini düzleştirilmiş şekilde getiren fonksiyon (tüm alt öğeler dahil)
export const getAllMenuItems = (): MenuItem[] => {
  const allItems: MenuItem[] = [];
  
  // Sol ve sağ menülerdeki tüm öğeleri ekle
  flattenMenuItems(leftMenuItems, allItems);
  flattenMenuItems(rightMenuItems, allItems);
  
  return allItems;
};

// Menü öğelerini düzleştir (recursive)
const flattenMenuItems = (items: MenuItem[], results: MenuItem[]): void => {
  for (const item of items) {
    results.push(item);
    
    if (item.children?.length) {
      flattenMenuItems(item.children, results);
    }
  }
};