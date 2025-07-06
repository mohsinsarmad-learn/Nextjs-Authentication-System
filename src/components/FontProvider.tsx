// src/components/FontProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Font = "font-sans" | "font-serif" | "font-mono";

interface FontContextType {
  font: Font;
  setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState<Font>("font-sans");

  useEffect(() => {
    try {
      const savedFont = localStorage.getItem("app-font") as Font;
      if (savedFont) {
        setFont(savedFont);
      }
    } catch (error) {
      console.error("Could not read font from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const bodyClasses = document.body.classList;
    bodyClasses.remove("font-sans", "font-serif", "font-mono");
    bodyClasses.add(font);

    try {
      localStorage.setItem("app-font", font);
    } catch (error) {
      console.error("Could not save font to localStorage", error);
    }
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
