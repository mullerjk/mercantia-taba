"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Sun,
  Moon,
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('settings');
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
    analytics: true,
  });



  useEffect(() => {
    setMounted(true);
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('mercantia-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotifications(settings.notifications || notifications);
      setPrivacy(settings.privacy || privacy);
      // Apply saved theme if it exists
      if (settings.theme && ["dark", "light", "system"].includes(settings.theme)) {
        setTheme(settings.theme as "dark" | "light" | "system");
      }
    }
  }, [setTheme]);

  const saveSettings = (updates: Partial<any> = {}) => {
    const currentSettings = {
      notifications,
      privacy,
      theme,
      ...updates,
    };
    localStorage.setItem('mercantia-settings', JSON.stringify(currentSettings));
  };



  const handleThemeChange = (newTheme: "dark" | "light" | "system") => {
    setTheme(newTheme);
    // Save immediately
    saveSettings({ theme: newTheme });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    saveSettings({ notifications: newNotifications });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    const newPrivacy = { ...privacy, [key]: value };
    setPrivacy(newPrivacy);
    saveSettings({ privacy: newPrivacy });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('manageSettings')}
        </p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {t('appearance')}
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t('languageRegion')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('notifications')}
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('dataPrivacy')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t('appearance')}
              </CardTitle>
              <CardDescription>
                {t('themeDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">{t('theme')}</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('themeDesc')}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                        theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Sun className="h-8 w-8" />
                      <span className="font-medium">{t('themeLight')}</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Moon className="h-8 w-8" />
                      <span className="font-medium">{t('themeDark')}</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                        theme === "system"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RefreshCw className="h-8 w-8" />
                      <span className="font-medium">{t('themeSystem')}</span>
                    </button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">{t('themeColors')}</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('themeColorsDesc')}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{t('comingSoon')}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {t('comingSoonDesc')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('languageTitle')}
              </CardTitle>
              <CardDescription>
                {t('languageSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>{t('language')}</Label>
                  <div className="mt-2">
                    <LanguageSelector />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('languageApplied')}
                  </p>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">{t('timezone')}</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('timezoneAuto')}
                  </p>
                  <Badge variant="outline">{t('timezoneAutoBadge')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('notificationsTitle')}
              </CardTitle>
              <CardDescription>
                {t('notificationsSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('emailNotificationsDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('pushNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('pushNotificationsDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('marketingNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('marketingNotificationsDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('privacyTitle')}
              </CardTitle>
              <CardDescription>
                {t('privacySubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('publicProfile')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('publicProfileDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('dataSharing')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('dataSharingDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('analytics')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('analyticsDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('accountDataTitle')}
              </CardTitle>
              <CardDescription>
                {t('accountDataSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  {t('exportData')}
                </Button>
                <Button variant="destructive">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {t('deleteAccount')}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('actionsProcessing')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
