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