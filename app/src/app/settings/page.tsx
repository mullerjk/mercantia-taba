"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DockNavigation } from "@/components/dock-navigation";
import { GlobalSidebar } from "@/components/global-sidebar";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "@/contexts/TranslationContext";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Palette,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Trash2,
  Info,
  HelpCircle,
  ChevronRight,
  ChevronDown
} from "lucide-react";

export type ThemeType = "light" | "dark" | "system"

export default function SettingsPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [collapsibleSections, setCollapsibleSections] = useState<Record<string, boolean>>({
    appearance: true,
    language: false,
    navigation: false,
    notifications: false,
    data: false,
    support: false
  });

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    // Handle sidebar navigation if needed
    console.log("Route change:", route);
  };

  const toggleSection = (section: string) => {
    setCollapsibleSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor }
  ];

  const languages = [
    { value: "pt", label: "Português (Brasil)" },
    { value: "en", label: "English (US)" },
    { value: "es", label: "Español" }
  ];

  const timezones = [
    { value: "America/Sao_Paulo", label: "São Paulo (UTC-3)", offset: "UTC-3" },
    { value: "America/New_York", label: "Nova York (UTC-5)", offset: "UTC-5" },
    { value: "America/Los_Angeles", label: "Los Angeles (UTC-8)", offset: "UTC-8" },
    { value: "Europe/London", label: "Londres (UTC+0)", offset: "UTC+0" },
    { value: "Europe/Paris", label: "Paris (UTC+1)", offset: "UTC+1" },
    { value: "Asia/Tokyo", label: "Tóquio (UTC+9)", offset: "UTC+9" },
    { value: "Australia/Sydney", label: "Sydney (UTC+11)", offset: "UTC+11" }
  ];

  const SettingSection = ({
    title,
    icon: Icon,
    sectionKey,
    children
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <Card className="p-6 mb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-4 group hover:bg-muted/50 p-2 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{t('settings.manageSettings')} {title.toLowerCase()}</p>
          </div>
        </div>
        {collapsibleSections[sectionKey] ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      {collapsibleSections[sectionKey] && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </Card>
  );

  const SettingItem = ({ 
    label, 
    description, 
    children 
  }: { 
    label: string; 
    description?: string; 
    children: React.ReactNode; 
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="relative w-full">
        <div className="p-8 pb-24"> {/* Bottom padding to account for dock */}
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <SettingsIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
                <p className="text-muted-foreground">{t('settings.subtitle')}</p>
              </div>
            </div>

            {/* Appearance Settings */}
            <SettingSection title={t('settings.appearance')} icon={Palette} sectionKey="appearance">
              <SettingItem
                label={t('settings.theme')}
                description={t('settings.themeDesc')}
              >
                <div className="flex gap-2">
                  {themes.map((themeOption) => {
                    const IconComponent = themeOption.icon;
                    return (
                      <Button
                        key={themeOption.value}
                        variant={theme === themeOption.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme(themeOption.value as ThemeType)}
                        className="flex items-center gap-2"
                      >
                        <IconComponent className="w-4 h-4" />
                        {themeOption.label}
                      </Button>
                    );
                  })}
                </div>
              </SettingItem>
            </SettingSection>

            {/* Language & Region Settings */}
            <SettingSection title={t('settings.languageRegion')} icon={Globe} sectionKey="language">
              <SettingItem
                label={t('settings.language')}
                description={t('settings.languageDesc')}
              >
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'pt' | 'en' | 'es')}
                  className="px-3 py-2 border border-border rounded-lg bg-background"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </SettingItem>

              <SettingItem
                label={t('settings.timezone')}
                description={t('settings.timezoneDesc')}
              >
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </SettingItem>
            </SettingSection>

            {/* Navigation Settings */}
            <SettingSection title={t('settings.navigation')} icon={ChevronRight} sectionKey="navigation">
              <SettingItem
                label={t('settings.sidebarDefault')}
                description={t('settings.sidebarDefaultDesc')}
              >
                <Button
                  variant={autoSave ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoSave(!autoSave)}
                >
                  {autoSave ? t('settings.enabled') : t('settings.disabled')}
                </Button>
              </SettingItem>

              <SettingItem
                label={t('settings.animations')}
                description={t('settings.animationsDesc')}
              >
                <Button
                  variant={autoSave ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoSave(!autoSave)}
                >
                  {autoSave ? t('settings.enabled') : t('settings.disabled')}
                </Button>
              </SettingItem>
            </SettingSection>

            {/* Notifications Settings */}
            <SettingSection title={t('settings.notifications')} icon={Bell} sectionKey="notifications">
              <SettingItem
                label={t('settings.systemNotifications')}
                description={t('settings.systemNotificationsDesc')}
              >
                <Button
                  variant={notifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications(!notifications)}
                  className="flex items-center gap-2"
                >
                  {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  {notifications ? t('settings.enabled') : t('settings.disabled')}
                </Button>
              </SettingItem>

              <SettingItem
                label={t('settings.notificationSounds')}
                description={t('settings.notificationSoundsDesc')}
              >
                <Button
                  variant={sound ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSound(!sound)}
                  className="flex items-center gap-2"
                >
                  {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {sound ? t('settings.enabled') : t('settings.disabled')}
                </Button>
              </SettingItem>
            </SettingSection>

            {/* Data & Privacy Settings */}
            <SettingSection title={t('settings.dataPrivacy')} icon={Trash2} sectionKey="data">
              <SettingItem
                label={t('settings.autosave')}
                description={t('settings.autosaveDesc')}
              >
                <Button
                  variant={autoSave ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoSave(!autoSave)}
                >
                  {autoSave ? t('settings.enabled') : t('settings.disabled')}
                </Button>
              </SettingItem>

              <SettingItem
                label={t('settings.clearCache')}
                description={t('settings.clearCacheDesc')}
              >
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  {t('settings.clearCacheBtn')}
                </Button>
              </SettingItem>
            </SettingSection>

            {/* Support Settings */}
            <SettingSection title={t('settings.support')} icon={HelpCircle} sectionKey="support">
              <SettingItem
                label={t('settings.about')}
                description={t('settings.aboutDesc')}
              >
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {t('settings.viewInfo')}
                </Button>
              </SettingItem>

              <SettingItem
                label={t('settings.help')}
                description={t('settings.helpDesc')}
              >
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  {t('settings.openHelp')}
                </Button>
              </SettingItem>
            </SettingSection>
          </div>
        </div>
      </div>

      {/* Global Sidebar Overlay */}
      <GlobalSidebar 
        isVisible={showSidebar} 
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
      />

      {/* Dock Navigation */}
      <DockNavigation 
        showSidebar={showSidebar} 
        onToggleSidebar={toggleSidebar} 
      />
    </div>
  );
}
