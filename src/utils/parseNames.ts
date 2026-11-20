import type { TranslationKey } from '../i18n/en';

export function parseStudentFile(content: string, fileName: string): string[] {
    const trimmed = content.trim();
    if (!trimmed) return [];

    if (fileName.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(stripBom(trimmed));
        if (Array.isArray(parsed)) {
            return parsed
                .map((item) => {
                    if (typeof item === 'string') return item.trim();
                    if (typeof item === 'object' && item !== null) {
                        return String(item.name || item.namn || Object.values(item)[0] || '').trim();
                    }
                    return '';
                })
                .filter(Boolean);
        }
        throw new Error('parser.error.invalid_json_array' satisfies TranslationKey);
    }

    // CSV eller plain text
    const lines = trimmed
        .split(/\r?\n/)
        .flatMap((line) => line.split(/[;,]/))
        .map((name) => name.replace(/^["']|["']$/g, '').trim())
        .filter(Boolean);

    //filter ordinary CSV-header if it is present on the first row
    if (lines.length > 0 && /^(name|namn|student|elev)$/i.test(lines[0])) {
        return lines.slice(1);
    }

    return lines;
}

function stripBom(raw: string): string {
    // Removes BOM-chars if there is any
    return raw.replace(/^\uFEFF/, '');
}