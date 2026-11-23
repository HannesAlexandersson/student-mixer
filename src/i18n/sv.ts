import type { TranslationKey } from './en';

export const sv: Record<TranslationKey, string> = {
    'app.title': 'Student-Mixer',
    'app.subtitle': 'Ladda upp klasslistan, bocka av frånvarande och slumpa jämna grupper.',
    'app.clear_list': 'Rensa lista',
    'app.group_size': 'Gruppstorlek:',
    'app.mix_button': 'Mixa grupper!',
    'app.results_heading': 'Färdiga grupper ({count} st)',
    'app.group_label': 'Grupp {number}',
    'app.group_member_count': '{count} pers',

    'fileupload.dropzone.prompt': 'Dra och släpp din namnlista här, eller',
    'fileupload.dropzone.browse': 'bläddra',
    'fileupload.dropzone.formats': 'Stöder .TXT, .CSV och .JSON',
    'fileupload.sparkles.fill_test_class': 'Fyll i testklass ({count} studenter)',
    'fileupload.error.invalid_format': 'Vänligen ladda upp en .json- eller .csv-fil.',
    'fileupload.error.empty_file': 'Hittade inga namn i filen.',
    'fileupload.error.parse_failed': 'Kunde inte läsa filen.',
    'fileupload.tooltip.aria_label': 'Så formaterar du din namnlista',
    'fileupload.tooltip.title': 'Så formaterar du filen',
    'fileupload.tooltip.csv_label': 'CSV eller TXT (ett namn per rad):',
    'fileupload.tooltip.json_label': 'JSON (lista med namn):',
    'fileupload.tooltip.tip': 'Tips: Du kan också exportera en kolumn från Excel eller Google Sheets som .csv.',

    'footer.contribute_prompt': 'Vill du bidra? Kolla in projektets GitHub-',
    'footer.repository_link': 'repository',

    'mixer.blending_status': 'Mixar {count} studenter...',

    'roster.present_heading': 'Närvarande ({count})',
    'roster.present_hint': 'Klicka på ett namn för att markera frånvarande',
    'roster.remove_tooltip': 'Ta bort från dagens mix',
    'roster.removed_heading': 'Borttagna / Frånvarande ({count}) - klicka för att lägga tillbaka:',
    'roster.restore_all': 'Återställ alla',

    'parser.error.invalid_json_array': 'JSON-filen måste innehålla en lista (array) med namn.',
};