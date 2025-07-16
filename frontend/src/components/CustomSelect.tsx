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
    required?: boolean;
    messageWhenNoOptions?: string;
    placeholder?: string
}

export default function CustomSelect<T>({
    options,
    onChange,
    value,
    multiSelect = false,
    required = false,
    messageWhenNoOptions = 'Nenhuma opção disponível',
    placeholder = 'Selecione...'
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
            let newValue = alreadySelected
                ? value.filter(v => v.value !== option.value)
                : [...value, option];

            if (required && newValue.length === 0) return; // não deixa limpar tudo se required
            onChange(newValue);
        } else {
            if (required && (!option || option.value === null || option.value === undefined)) return; // bloqueia se required e opção inválida
            onChange(option);
            setOpen(false);
        }
    };

    const getDisplayValue = () => {
        if (multiSelect && Array.isArray(value)) {
            return value.map(v => v.label).join(', ') || placeholder;
        } else if (!multiSelect && !Array.isArray(value)) {
            return value?.label || placeholder;
        }
        return placeholder;
    };

    const isError = required && (
        (!value) ||
        (multiSelect && Array.isArray(value) && value.length === 0)
    );

    return (
        <div ref={ref} className="relative w-64">
            <button
                type="button"
                className={`w-full border rounded px-4 py-2 text-center focus:outline-none cursor-pointer
                    ${isError ? 'border-red-500' : ''}`}
                onClick={() => setOpen(!open)}
            >
                {getDisplayValue()}
            </button>

            {open && (
                <>{options?.length > 0 ? (
                    <ul className="absolute z-10 mt-1 w-full border rounded max-h-60 bg-[var(--background)] overflow-auto">
                        {options.map(option => (
                            <li
                                key={String(option.value)}
                                onClick={() => handleSelect(option)}
                                className={`px-4 py-2 cursor-pointer text-center ${isSelected(option)
                                    ? 'bg-[var(--foreground)] text-[var(--background)]'
                                    : 'hover:bg-[var(--foreground)] hover:text-[var(--background)]'
                                    }`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="absolute z-10 mt-1 w-full border rounded max-h-60 bg-[var(--background)] overflow-auto">
                        <p className='px-4 py-2 opacity-50 text-center'><i> {messageWhenNoOptions} </i></p>
                    </div>
                )}</>
            )}

            {isError && (
                <p className="text-red-500 text-sm mt-1">Este campo é obrigatório.</p>
            )}
        </div>
    );
}
