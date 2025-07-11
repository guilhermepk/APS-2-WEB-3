'use client';

import { useState } from 'react';

interface CustomSelectProps<T = any> {
    options: Array<{
        value: T,
        label: string
    }>,
    value: string,
    onChange: (newValue: T) => void
}

export default function CustomSelect({
    options, onChange, value
}: CustomSelectProps) {
    const [selected, setSelected] = useState(options[0]);
    const [open, setOpen] = useState(false);

    return (
        <div className="relative w-64">
            <button
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left shadow-sm focus:outline-none cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                {value}
            </button>

            {open && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                setSelected(option);
                                setOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selected.value === option.value ? 'bg-gray-100 font-medium' : ''
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
