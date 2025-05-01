"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme/ThemeProvider";
import { toast } from "sonner";

interface UserSettingsWindowProps {
  onClose: () => void;
}

export const UserSettingsWindow = ({ onClose }: UserSettingsWindowProps) => {
  const { palette, setPaletteById, availablePalettes } = useTheme();
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(palette.id);

  // Tema paletini değiştir ve önizleme göster
  const handlePaletteChange = (id: string) => {
    setSelectedPaletteId(id);
    
    // Seçilen tema paletini bul
    const selectedPalette = availablePalettes.find(p => p.id === id);
    
    if (selectedPalette) {
      // Özel CSS değişkenlerini ayarla
      document.documentElement.style.setProperty('--color-primary', selectedPalette.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', selectedPalette.colors.secondary);
      document.documentElement.style.setProperty('--color-accent', selectedPalette.colors.accent);
      document.documentElement.style.setProperty('--color-background', selectedPalette.colors.background);
      
      // Shadcn UI değişkenlerini güncelle
      document.documentElement.style.setProperty('--primary', selectedPalette.colors.primary);
      document.documentElement.style.setProperty('--primary-foreground', selectedPalette.colors.primary_foreground);
      document.documentElement.style.setProperty('--secondary', selectedPalette.colors.secondary);
      document.documentElement.style.setProperty('--secondary-foreground', selectedPalette.colors.secondary_foreground);
      document.documentElement.style.setProperty('--accent', selectedPalette.colors.accent);
      document.documentElement.style.setProperty('--accent-foreground', selectedPalette.colors.accent_foreground);
      document.documentElement.style.setProperty('--background', selectedPalette.colors.background);
      document.documentElement.style.setProperty('--foreground', selectedPalette.colors.foreground);
      
      // Kart ve diğer bileşen renklerini ayarla
      document.documentElement.style.setProperty('--card', selectedPalette.colors.card);
      document.documentElement.style.setProperty('--card-foreground', selectedPalette.colors.card_foreground);
      document.documentElement.style.setProperty('--popover', selectedPalette.colors.popover);
      document.documentElement.style.setProperty('--popover-foreground', selectedPalette.colors.popover_foreground);
      document.documentElement.style.setProperty('--muted', selectedPalette.colors.muted);
      document.documentElement.style.setProperty('--muted-foreground', selectedPalette.colors.muted_foreground);
      document.documentElement.style.setProperty('--border', selectedPalette.colors.border);
      document.documentElement.style.setProperty('--input', selectedPalette.colors.input);
      document.documentElement.style.setProperty('--ring', selectedPalette.colors.ring);
      document.documentElement.style.setProperty('--destructive', selectedPalette.colors.destructive);
      document.documentElement.style.setProperty('--destructive-foreground', selectedPalette.colors.destructive_foreground);
    }
  };

  // Ayarları kaydet
  const handleSaveSettings = () => {
    setPaletteById(selectedPaletteId);
    toast.success("Tema ayarları kaydedildi");
  };

  return (
    <div className="w-full h-full overflow-auto p-6">
      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="theme">Tema Ayarları</TabsTrigger>
          <TabsTrigger value="notifications">Bildirim Ayarları</TabsTrigger>
          <TabsTrigger value="account">Hesap Ayarları</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>Renk Paleti</CardTitle>
              <CardDescription>
                Uygulamanın renk paletini değiştirin. \n asd asd a
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availablePalettes.map((themePalette) => (
                  <div 
                    key={themePalette.id}
                    className={`cursor-pointer hover:cursor-pointer rounded-lg p-1 transition-all hover:shadow-md ${
                      selectedPaletteId === themePalette.id ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/50'
                    }`}
                    onClick={() => handlePaletteChange(themePalette.id)}
                  >
                    <div className="rounded-md overflow-hidden">
                      <div 
                        className="h-8 lg:h-12" 
                        style={{ backgroundColor: themePalette.colors.primary }}
                      />
                      <div 
                        className="h-8 lg:h-12" 
                        style={{ backgroundColor: themePalette.colors.secondary }}
                      />
                      <div 
                        className="h-8 lg:h-12" 
                        style={{ backgroundColor: themePalette.colors.accent }}
                      />
                      <div 
                        className="h-8 lg:h-12" 
                        style={{ backgroundColor: themePalette.colors.background }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1 font-medium">{themePalette.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>İptal</Button>
            <Button onClick={handleSaveSettings}>Kaydet</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>
                Bildirim tercihlerinizi yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bildirim ayarları yakında eklenecek.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Hesap Ayarları</CardTitle>
              <CardDescription>
                Hesap bilgilerinizi yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Hesap ayarları yakında eklenecek.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};