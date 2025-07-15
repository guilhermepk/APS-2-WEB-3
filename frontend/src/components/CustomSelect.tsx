import { useEffect, useRef, useState } from 'react';

export interface Option<T> {
    value: T;
    label: string;
}

interface CustomSelectProps<T = any> {
    options: Option<T>[];
    value: Option<T> | Option<T>[];
    onChange: (newValue: Option<T> | Option<T>[]) => void;
    multiSelect?: boolean;
}

export default function CustomSelect<T>({
    options,
    onChange,
    value,
    multiSelect = false,
}: CustomSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isSelected = (option: Option<T>) => {
        if (multiSelect) {
            return Array.isArray(value) && value.some(v => v.value === option.value);
        } else {
            return !Array.isArray(value) && value?.value === option.value;
        }
    };

    const handleSelect = (option: Option<T>) => {
        if (multiSelect) {
            if (!Array.isArray(value)) return;

            const alreadySelected = value.find(v => v.value === option.value);
            let newValue;
            if (alreadySelected) {
                newValue = value.filter(v => v.value !== option.value);
            } else {
                newValue = [...value, option];
            }
            onChange(newValue);
        } else {
            onChange(option);
            setOpen(false);
        }
    };

    const getDisplayValue = () => {
        if (multiSelect && Array.isArray(value)) {
            return value.map(v => v.label).join(', ') || 'Selecione...';
        } else if (!multiSelect && !Array.isArray(value)) {
            return value?.label || 'Selecione...';
        }
        return 'Selecione...';
    };

    return (
        <div ref={ref} className="relative w-64">
            <button
                type='button'
                className="w-full border rounded px-4 py-2 text-left focus:outline-none cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                {getDisplayValue()}
            </button>

            {open && (
                <ul className="absolute z-10 mt-1 w-full border rounded max-h-60 bg-[var(--background)]">
                    {options.map(option => (
                        <li
                            key={String(option.value)}
                            onClick={() => handleSelect(option)}
                            className={`px-4 py-2 cursor-pointer ${isSelected(option)
                                ? 'bg-[var(--foreground)] text-[var(--background)]'
                                : 'hover:bg-[var(--foreground)] hover:text-[var(--background)]'
                                }`}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
