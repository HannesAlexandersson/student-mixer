import React, { useState } from 'react';
import { UserMinus, RotateCcw, Users } from 'lucide-react';
import { useI18n } from '../i18n';

interface StudentRosterProps {
    activeStudents: string[];
    removedStudents: string[];
    onRemove: (name: string) => void;
    onRestore: (name: string) => void;
    onRestoreAll: () => void;
    onAdd: (name: string) => boolean;
}

export const StudentRoster: React.FC<StudentRosterProps> = ({
    activeStudents,
    removedStudents,
    onRemove,
    onRestore,
    onRestoreAll,
    onAdd,
}) => {
    const { i18n } = useI18n();
    const [name, setName] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;
        if (!onAdd(trimmedName)) {
            setIsDuplicate(true);
            return;
        }
        setName('');
        setIsDuplicate(false);
    };

    return (
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <form onSubmit={handleSubmit}>
                <label htmlFor="student-name" className="mb-2 block text-sm font-medium text-slate-300">
                    {i18n('roster.student_name')}
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                        id="student-name"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            setIsDuplicate(false);
                        }}
                        aria-invalid={isDuplicate}
                        aria-describedby={isDuplicate ? 'student-name-error' : undefined}
                        className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {i18n('roster.add_student')}
                    </button>
                </div>
                {isDuplicate && (
                    <p id="student-name-error" role="alert" className="mt-2 text-sm text-rose-300">
                        {i18n('roster.duplicate_name')}
                    </p>
                )}
            </form>
            {/* Active students */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-300 uppercase">
                        <Users className="h-4 w-4 text-indigo-400" />
                        {i18n('roster.present_heading', { count: activeStudents.length })}
                    </h2>
                    <span className="text-xs text-slate-500">{i18n('roster.present_hint')}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {activeStudents.map((name) => (
                        <button
                            key={name}
                            onClick={() => onRemove(name)}
                            title={i18n('roster.remove_tooltip')}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/90 px-3.5 py-1.5 text-sm text-slate-200 transition hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-200"
                        >
                            <span>{name}</span>
                            <UserMinus className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-rose-400" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Removed / Undo list */}
            {removedStudents.length > 0 && (
                <div className="border-t border-slate-800 pt-4">
                    <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">
                            {i18n('roster.removed_heading', { count: removedStudents.length })}
                        </span>
                        <button
                            onClick={onRestoreAll}
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                        >
                            <RotateCcw className="h-3 w-3" /> {i18n('roster.restore_all')}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {removedStudents.map((name) => (
                            <button
                                key={name}
                                onClick={() => onRestore(name)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-400 line-through transition hover:border-emerald-500/50 hover:text-emerald-300 hover:no-underline"
                            >
                                <span>{name}</span>
                                <RotateCcw className="h-3 w-3" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
