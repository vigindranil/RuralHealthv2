/* src/components/ui/SearchableSelect.tsx */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUpDown, Check, Search } from 'lucide-react';

export interface Option { id: string; name: string }

interface Props {
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
}

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = 'Select…',
    disabled,
}: Props) {
    const box = useRef<HTMLDivElement>(null);
    const search = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [hi, setHi] = useState(0);

    const filtered =
        query.trim() === ''
            ? options
            : options.filter(o => o.name.toLowerCase().includes(query.toLowerCase()));

    /* close on outside click */
    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    /* helpers */
    const openMenu = () => {
        if (disabled) return;
        setOpen(true);
        setTimeout(() => search.current?.focus(), 0);
    };

    const handleMainKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(); }
    };

    const handleListKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) return;
        e.preventDefault();
        if (e.key === 'ArrowDown') setHi(i => (i + 1) % filtered.length);
        if (e.key === 'ArrowUp') setHi(i => (i ? i - 1 : filtered.length - 1));
        if (e.key === 'Enter') {
            const pick = filtered[hi];
            if (pick) { onChange(pick.name); setOpen(false); setQuery(''); }
        }
        if (e.key === 'Escape') setOpen(false);
    };

    return (
        <div ref={box} className="relative">
            {/* MAIN INPUT */}
            <input
                readOnly
                disabled={disabled}
                value={value}
                placeholder={placeholder}
                onClick={openMenu}
                onKeyDown={handleMainKey}
                className="w-full cursor-pointer rounded-lg bg-white/50
                   px-3 py-2 text-sm shadow-inner ring-1 ring-inset
                   ring-gray-300/30 backdrop-blur-sm transition
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:cursor-not-allowed disabled:bg-gray-100"
            />
            <button
                type="button"
                disabled={disabled}
                onClick={() => (open ? setOpen(false) : openMenu())}
                className="absolute inset-y-0 right-0 flex items-center px-2"
            >
                <ChevronsUpDown className="h-4 w-4 text-gray-500/60" />
            </button>

            {/* DROPDOWN */}
            {open && (
                <div
                    className="animate-scaleFade absolute z-10 mt-1 w-full origin-top
                     rounded-xl bg-white/80 p-1 shadow-xl ring-1 ring-black/5
                     backdrop-blur-md"
                >
                    {/* search bar */}
                    <div className="flex items-center gap-2 rounded-lg bg-white/70
                          px-3 py-2 ring-1 ring-gray-200">
                        <Search className="h-4 w-4 text-gray-500/60" />
                        <input
                            ref={search}
                            value={query}
                            onChange={e => { setQuery(e.target.value); setHi(0); }}
                            onKeyDown={handleListKey}
                            placeholder="Type to filter…"
                            className="flex-1 bg-transparent text-sm focus:outline-none"
                        />
                    </div>

                    {/* option list */}
                    <ul className="scrollbar-none max-h-56 overflow-auto py-1 text-sm">
                        {filtered.length === 0 && (
                            <li className="select-none px-4 py-2 text-gray-400">Nothing found</li>
                        )}
                        {filtered.map((o, idx) => (
                            <li
                                key={o.id}
                                onMouseDown={() => { onChange(o.name); setOpen(false); setQuery(''); }}
                                onMouseEnter={() => setHi(idx)}
                                className={`flex cursor-pointer items-center justify-between
                           rounded-lg px-4 py-2 transition
                           ${idx === hi
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <span>{o.name}</span>
                                {o.name === value && (
                                    <Check className="h-4 w-4 flex-shrink-0 text-current/60" />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

