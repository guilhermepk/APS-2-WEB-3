'use client'

import updateTask from '@/apis/backend/tasks/update-task';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Task {
    id: number;
    description: string;
    completed: boolean;
}

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [desc, setDesc] = useState(task.description);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    function handleDoubleClick() {
        if (!task.completed) setIsEditing(true);
    }

    async function handleBlur() {
        setIsEditing(false);
        if (desc !== task.description) {
            await updateTask(task.id, { description: desc.trim() });
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setDesc(task.description);
            setIsEditing(false);
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <img
                src={task.completed ? '/checkbox_signed.svg' : '/checkbox.svg'}
                alt=""
            />
            {isEditing ? (
                <input
                    ref={inputRef}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="border rounded px-1"
                />
            ) : (
                <p
                    onDoubleClick={handleDoubleClick}
                    className={`${task.completed ? 'opacity-50' : 'opacity-100'}`}
                >
                    {task.completed ? <s>{desc}</s> : desc}
                </p>
            )}
        </div>
    );
}
