export const en = {
    'app.title': 'Student Mixer',
    'app.subtitle': 'Upload your class roster, mark absent students, and randomize balanced groups.',
    'app.clear_list': 'Clear list',
    'app.group_size': 'Group size:',
    'app.mix_button': 'Mix groups!',
    'app.results_heading': 'Generated groups ({count})',
    'app.group_label': 'Group {number}',
    'app.group_member_count': '{count} members',

    'fileupload.dropzone.prompt': 'Drag and drop your name list here, or',
    'fileupload.dropzone.browse': 'browse',
    'fileupload.dropzone.formats': 'Supports  .TXT, .CSV and .JSON',
    'fileupload.sparkles.fill_test_class': 'Fill test class ({count} students)',
    'fileupload.error.invalid_format': 'Please upload a .json or .csv file.',
    'fileupload.error.empty_file': 'No names were found in the file.',
    'fileupload.error.parse_failed': 'Could not read the file.',
    'fileupload.tooltip.aria_label': 'How to format your name list',
    'fileupload.tooltip.title': 'How to format your file',
    'fileupload.tooltip.csv_label': 'CSV or TXT (one name per line):',
    'fileupload.tooltip.json_label': 'JSON (array of names):',
    'fileupload.tooltip.tip': 'Tip: You can also export a single column from Excel or Google Sheets as .csv.',

    'footer.contribute_prompt': 'Want to contribute? Check out the GitHub',
    'footer.repository_link': 'repository',

    'mixer.blending_status': 'Blending {count} students...',

    'roster.present_heading': 'Present ({count})',
    'roster.present_hint': 'Click a name to mark as absent',
    'roster.remove_tooltip': 'Remove from today’s mix',
    'roster.removed_heading': 'Removed / Absent ({count}) – click to restore:',
    'roster.restore_all': 'Restore all',

    'parser.error.invalid_json_array': 'The JSON file must contain an array of names.',
} as const;

export type TranslationKey = keyof typeof en;