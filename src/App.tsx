import { useState, useEffect, useCallback } from 'react';
import { Shuffle, Trash2, Globe } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { StudentRoster } from './components/StudentRooster';
import { BlenderAnimation } from './components/BlenderAnimations';
import { useI18n, dictionaries, type Locale } from './i18n';

const STORAGE_KEY_ALL = 'student_mixer_all';
const STORAGE_KEY_REMOVED = 'student_mixer_removed';

function createBalancedGroups(names: string[], groupSize: number): string[][] {
  if (names.length === 0) return [];

  // Fisher-Yates shuffle
  const shuffled = [...names];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const numGroups = Math.max(1, Math.floor(shuffled.length / groupSize));
  const groups: string[][] = Array.from({ length: numGroups }, () => []);

  // Assign base group size
  let index = 0;
  for (let g = 0; g < numGroups; g++) {
    for (let k = 0; k < groupSize; k++) {
      groups[g].push(shuffled[index++]);
    }
  }

  // Distribute remaining students evenly so no one is left alone
  let g = 0;
  while (index < shuffled.length) {
    groups[g % numGroups].push(shuffled[index++]);
    g++;
  }

  return groups;
}

export function App() {
  const { locale, setLocale, i18n } = useI18n();

  const [allStudents, setAllStudents] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALL);
    return saved ? JSON.parse(saved) : [];
  });

  const [removedStudents, setRemovedStudents] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REMOVED);
    return saved ? JSON.parse(saved) : [];
  });

  const [groupSize, setGroupSize] = useState<number>(3);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isBlending, setIsBlending] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALL, JSON.stringify(allStudents));
  }, [allStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REMOVED, JSON.stringify(removedStudents));
  }, [removedStudents]);

  const activeStudents = allStudents.filter((name) => !removedStudents.includes(name));

  const handleStudentsLoaded = (names: string[]) => {
    const uniqueNames = Array.from(new Set(names));
    setAllStudents(uniqueNames);
    setRemovedStudents([]);
    setGroups([]);
  };

  const handleRemoveStudent = (name: string) => {
    setRemovedStudents((prev) => [...prev, name]);
  };

  const handleRestoreStudent = (name: string) => {
    setRemovedStudents((prev) => prev.filter((n) => n !== name));
  };

  const handleClearAll = () => {
    setAllStudents([]);
    setRemovedStudents([]);
    setGroups([]);
    localStorage.removeItem(STORAGE_KEY_ALL);
    localStorage.removeItem(STORAGE_KEY_REMOVED);
  };

  const handleMix = () => {
    setIsBlending(true);
  };

  const handleBlendComplete = useCallback(() => {
    setGroups(createBalancedGroups(activeStudents, groupSize));
    setIsBlending(false);
  }, [activeStudents, groupSize]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      {isBlending && (
        <BlenderAnimation students={activeStudents} onComplete={handleBlendComplete} />
      )}

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div><div className='flex items-start'>
            <h1 className="text-3xl font-bold tracking-tight text-white">{i18n('app.title')}</h1> </div>
            <p className="mt-1 text-sm text-slate-400">{i18n('app.subtitle')}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                aria-label="Language"
                className="bg-transparent text-slate-200 focus:outline-none"
              >
                {Object.entries(dictionaries).map(([code, { label }]) => (
                  <option key={code} value={code} className="bg-slate-900 text-slate-200">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {allStudents.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 transition hover:border-rose-500/40 hover:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" /> {i18n('app.clear_list')}
              </button>
            )}
          </div>
        </header>

        {/* Upload or Roster Controls */}
        {allStudents.length === 0 ? (
          <FileUpload onStudentsLoaded={handleStudentsLoaded} />
        ) : (
          <div className="space-y-6">
            <StudentRoster
              activeStudents={activeStudents}
              removedStudents={removedStudents}
              onRemove={handleRemoveStudent}
              onRestore={handleRestoreStudent}
              onRestoreAll={() => setRemovedStudents([])}
            />

            {/* Group size and Mix controls */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-300">{i18n('app.group_size')}</span>
                <div className="flex gap-1.5">
                  {[2, 3, 4, 5].map((size) => (
                    <button
                      key={size}
                      onClick={() => setGroupSize(size)}
                      className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${groupSize === size
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleMix}
                disabled={activeStudents.length < 2 || isBlending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                <Shuffle className="h-4 w-4" />
                {i18n('app.mix_button')}
              </button>
            </div>
          </div>
        )}

        {/* Generated Groups */}
        {groups.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {i18n('app.results_heading', { count: groups.length })}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase">
                      {i18n('app.group_label', { number: idx + 1 })}
                    </span>
                    <span className="text-xs text-slate-500">
                      {i18n('app.group_member_count', { count: group.length })}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {group.map((member) => (
                      <li key={member} className="text-sm font-medium text-slate-200">
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;