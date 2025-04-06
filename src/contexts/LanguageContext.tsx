import React, { createContext, useContext, useState, useCallback } from 'react';
import { translateText } from '../lib/translation';

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'or', name: 'Odia' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'ur', name: 'Urdu' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'doi', name: 'Dogri' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'mai', name: 'Maithili' },
  { code: 'ne', name: 'Nepali' },
  { code: 'brx', name: 'Bodo' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'sat', name: 'Santali' },
  { code: 'kok', name: 'Konkani' },
];

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>({});

  const translate = useCallback(async (text: string) => {
    if (currentLanguage === 'en') return text;
    
    // Check cache first
    if (translationCache[currentLanguage]?.[text]) {
      return translationCache[currentLanguage][text];
    }
    
    setIsLoading(true);
    try {
      const result = await translateText(text, {
        sourceLanguage: 'en',
        targetLanguage: currentLanguage
      });
      
      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        [currentLanguage]: {
          ...(prev[currentLanguage] || {}),
          [text]: result
        }
      }));
      
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, translationCache]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: setCurrentLanguage,
        translate,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}