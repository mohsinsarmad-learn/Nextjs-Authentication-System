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
    document.body.classList.remove(
      "font-sans",
      "font-serif",
      "font-mono",
      "font-display",
      "font-handwriting"
    );
    document.body.classList.add(font);
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
