import React, { useRef, useState } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { parseStudentFile } from '../utils/parseNames';

interface FileUploadProps {
    onStudentsLoaded: (names: string[]) => void;
}

const SAMPLE_STUDENTS = [
    'Alice Lindqvist', 'Liam Bergström', 'Maja Sjöberg', 'Noah Ekström',
    'Ella Nyström', 'William Holm', 'Alma Lundgren', 'Lucas Forsberg',
    'Selma Engström', 'Oscar Viklund', 'Astrid Sandberg'
];

export const FileUpload: React.FC<FileUploadProps> = ({ onStudentsLoaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        setError(null);
        const validExt = file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.txt');
        if (!validExt) {
            setError('Vänligen ladda upp en .json- eller .csv-fil.');
            return;
        }

        try {
            const text = await file.text();
            const names = parseStudentFile(text, file.name);
            if (names.length === 0) {
                setError('Hittade inga namn i filen.');
                return;
            }
            onStudentsLoaded(names);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Kunde inte läsa filen.');
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
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
                    Dra och släpp din namnlista här, eller <span className="text-indigo-400 underline">bläddra</span>
                </p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <FileText className="h-3.5 w-3.5" /> Stöder .CSV och .JSON
                </p>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => onStudentsLoaded(SAMPLE_STUDENTS)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-indigo-400"
                >
                    <Sparkles className="h-3.5 w-3.5" /> Fyll i testklass (11 studenter)
                </button>
            </div>

            {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                    {error}
                </p>
            )}
        </div>
    );
};