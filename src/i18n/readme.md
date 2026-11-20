## Adding a New Language (i18n)

Contributions for new languages are very welcome! The app uses a lightweight, type-safe dictionary system with zero external i18n dependencies. All translation keys are inferred from the base English dictionary (`src/i18n/en.ts`), so TypeScript will automatically notify you if any keys are missing or misspelled.

### Step 1: Create a New Translation File

1. Navigate to the `src/i18n/` directory.
2. Create a new file named after the two-letter [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) (for example, `de.ts` for German, `es.ts` for Spanish, or `fr.ts` for French).
3. Copy the contents of `src/i18n/sv.ts` (or `src/i18n/en.ts`) into your new file and translate the values while keeping the keys intact:

```ts
// Example: src/i18n/de.ts
import type { TranslationKey } from './en';

export const de: Record<TranslationKey, string> = {
  'app.title': 'Student-Mixer',
  'app.subtitle': 'Klassenliste hochladen, abwesende Personen markieren und faire Gruppen auslosen.',
  // ...translate all remaining keys
};
```
Note on placeholders: Keep dynamic placeholders like {count} and {number} intact in your translated strings (e.g., 'Group {number}' → 'Gruppe {number}').

### Step 2: Register the Language

Open src/i18n/index.tsx, import your new dictionary, and add it to the dictionaries object using its native language name as the label:
```ts
import { en, type TranslationKey } from './en';
import { sv } from './sv';
import { de } from './de'; // 1. Import your file

export const dictionaries = {
  en: { label: 'English', translations: en },
  sv: { label: 'Svenska', translations: sv },
  de: { label: 'Deutsch', translations: de }, // 2. Register it here
} as const;
```

Once registered, the language will automatically appear in the header dropdown and be detected via the user's browser locale (navigator.language).

Step 3: Verify & Submit
Run npm run build (or npx tsc --noEmit) to verify there are no missing translation keys or TypeScript errors.

Start the dev server with npm run dev, select your language in the top-right switcher, and verify that all UI labels and error messages render cleanly.

Open a Pull Request with your changes!