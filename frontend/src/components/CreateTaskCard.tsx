import { useState, KeyboardEvent, useRef } from "react";

interface CreateTaskCardProps {
    onSave: (description: string) => void | Promise<void>
}

export default function CreateTaskCard({
    onSave
}: CreateTaskCardProps) {
    const [description, setDescription] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleSave() {
        if (description && description != '') {
            await onSave(description);
            setDescription('');
        }
    }

    async function handleBlur() {
        await handleSave();
    }

    async function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setDescription('');
            inputRef.current?.blur();
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <img
                src={'/checkbox.svg'}
                className="cursor-pointer"
            />
            <input
                ref={inputRef}
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="border rounded px-1"
                placeholder="Nova tarefa"
            />
        </div>
    );
}