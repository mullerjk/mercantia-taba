"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // Use defaultTheme initially to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Only run after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      if (storedTheme && ["dark", "light", "system"].includes(storedTheme)) {
        setTheme(storedTheme);
      }
    } catch (error) {
      // localStorage might not be available
      console.warn("Unable to access localStorage:", error);
    }
  }, [storageKey]);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // Remove both light and dark classes
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      // Only add 'dark' class for dark themes
      if (systemTheme === "dark") {
        root.classList.add("dark");
      }
      return;
    }

    // For explicit themes, only add 'dark' class for dark theme
    if (theme === "dark") {
      root.classList.add("dark");
    }
    // For light theme, don't add any class (default state)
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn("Unable to save theme to localStorage:", error);
      }
      setTheme(theme);
    },
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider value={value}>
        {children}
      </ThemeProviderContext.Provider>
    );
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
