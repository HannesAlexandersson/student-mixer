import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en, type TranslationKey } from './en';
import { sv } from './sv';

// Register new open-source community languages here
export const dictionaries = {
    en: { label: 'English', translations: en },
    sv: { label: 'Svenska', translations: sv },
} as const;

export type Locale = keyof typeof dictionaries;

const STORAGE_KEY_LOCALE = 'student_mixer_locale';

interface I18nContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    i18n: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectInitialLocale(): Locale {
    const saved = localStorage.getItem(STORAGE_KEY_LOCALE) as Locale | null;
    if (saved && saved in dictionaries) return saved;

    const browserLang = navigator.language.slice(0, 2).toLowerCase() as Locale;
    if (browserLang in dictionaries) return browserLang;

    return 'en';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>(detectInitialLocale);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_LOCALE, locale);
    }, [locale]);

    const i18n = useCallback(
        (key: TranslationKey, params?: Record<string, string | number>): string => {
            const dictionary = dictionaries[locale]?.translations ?? en;
            let text: string = dictionary[key] ?? en[key] ?? key;

            if (params) {
                for (const [paramKey, value] of Object.entries(params)) {
                    text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
                }
            }

            return text;
        },
        [locale]
    );

    return (
        <I18nContext.Provider value={{ locale, setLocale, i18n }}>
            {children}
        </I18nContext.Provider>
    );
};

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}