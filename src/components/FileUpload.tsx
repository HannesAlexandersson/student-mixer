import React, { useRef, useState } from 'react';
import { Upload, FileText, Info } from 'lucide-react';
import { parseStudentFile } from '../utils/parseNames';
import { useI18n } from '../i18n';
import type { TranslationKey } from '../i18n/en';

interface FileUploadProps {
    onStudentsLoaded: (names: string[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onStudentsLoaded }) => {
    const { i18n } = useI18n();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        setError(null);
        const validExt =
            file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.txt');

        if (!validExt) {
            setError(i18n('fileupload.error.invalid_format'));
            return;
        }

        try {
            const text = await file.text();
            const names = parseStudentFile(text, file.name);
            if (names.length === 0) {
                setError(i18n('fileupload.error.empty_file'));
                return;
            }
            onStudentsLoaded(names);
        } catch (err) {
            if (err instanceof Error && err.message.startsWith('parser.error.')) {
                setError(i18n(err.message as TranslationKey));
            } else {
                setError(i18n('fileupload.error.parse_failed'));
            }
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="w-full space-y-3">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.txt"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                        e.target.value = '';
                    }}
                />
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                    <Upload className="h-6 w-6" />
                </div>
                <p className="text-base font-medium text-slate-200">
                    {i18n('fileupload.dropzone.prompt')}{' '}
                    <span className="text-indigo-400 underline">{i18n('fileupload.dropzone.browse')}</span>
                </p>

                {/* Format hint with hover/focus format guide tooltip */}
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{i18n('fileupload.dropzone.formats')}</span>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="group relative inline-flex items-center"
                    >
                        <button
                            type="button"
                            aria-label={i18n('fileupload.tooltip.aria_label')}
                            className="rounded-full p-0.5 text-slate-400 transition hover:text-indigo-400 focus:text-indigo-400 focus:outline-none"
                        >
                            <Info className="h-4 w-4" />
                        </button>

                        {/* Tooltip Popover */}
                        <div
                            role="tooltip"
                            className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2.5 w-72 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-900 p-4 text-left opacity-0 shadow-2xl transition-all duration-150 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 sm:w-80"
                        >
                            <p className="mb-2.5 text-xs font-semibold text-white">
                                {i18n('fileupload.tooltip.title')}
                            </p>

                            <div className="space-y-2.5">
                                <div>
                                    <p className="mb-1 text-[11px] font-medium text-indigo-400">
                                        {i18n('fileupload.tooltip.csv_label')}
                                    </p>
                                    <pre className="rounded-lg border border-slate-800 bg-slate-950 p-2 font-mono text-[11px] leading-relaxed text-slate-300">
                                        {`Alice Lindqvist\nLiam Bergström\nMaja Sjöberg`}
                                    </pre>
                                </div>

                                <div>
                                    <p className="mb-1 text-[11px] font-medium text-emerald-400">
                                        {i18n('fileupload.tooltip.json_label')}
                                    </p>
                                    <pre className="rounded-lg border border-slate-800 bg-slate-950 p-2 font-mono text-[11px] leading-relaxed text-slate-300">
                                        {`[\n  "Alice Lindqvist",\n  "Liam Bergström"\n]`}
                                    </pre>
                                </div>

                                <p className="border-t border-slate-800 pt-2 text-[11px] leading-snug text-slate-400">
                                    {i18n('fileupload.tooltip.tip')}
                                </p>
                            </div>

                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-8 border-transparent border-t-slate-700" />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                    {error}
                </p>
            )}
        </div>
    );
};