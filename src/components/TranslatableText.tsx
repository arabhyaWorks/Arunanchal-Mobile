import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TranslatableTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function TranslatableText({
  text,
  className = '',
  as = 'span',
}: TranslatableTextProps) {
  const { translate, currentLanguage, isLoading } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const translateContent = async () => {
      if (currentLanguage === 'en') {
        setTranslatedText(text);
        return;
      }
      
      setIsTranslating(true);
      setError(null);
      
      try {
        const result = await translate(text);
        if (isMounted) {
          setTranslatedText(result);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Translation failed:', err);
          setError('Translation failed');
          setTranslatedText(text);
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false);
        }
      }
    };

    translateContent();
    return () => {
      isMounted = false;
    };
  }, [text, currentLanguage, translate]);

  const Component = as;

  if (isLoading) {
    return (
      <Component className={`${className} animate-pulse bg-gray-200 rounded`}>
        {text}
      </Component>
    );
  }

  return (
    <Component 
      className={`${className} transition-opacity duration-300 ${
        isTranslating ? 'opacity-50' : 'opacity-100'
      } ${error ? 'text-red-600' : ''}`}
      title={error || undefined}
    >
      {translatedText}
    </Component>
  );
}