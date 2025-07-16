'use client'

import deleteTask from '@/apis/backend/tasks/delete-task'
import updateTask from '@/apis/backend/tasks/update-task'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'

export interface Task {
    id: number
    description: string
    completed: boolean
}

interface TaskCardProps {
    task: Task,
    onDelete?: (task: Task) => void | Promise<void>
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [desc, setDesc] = useState(task.description)
    const [completed, setCompleted] = useState(task.completed)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    function handleDoubleClick() {
        setIsEditing(true);
    }

    async function handleBlur() {
        setIsEditing(false)
        if (desc !== task.description) {
            await updateTask(task.id, { description: desc.trim() })
        }
    }

    async function toggleCompleted() {
        const newCompleted = !completed
        setCompleted(newCompleted)

        await updateTask(task.id, { completed: !completed });
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            inputRef.current?.blur()
        } else if (e.key === 'Escape') {
            setDesc(task.description)
            setIsEditing(false)
        }
    }

    async function handleDelete(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        await deleteTask(task.id);
        if (onDelete) await onDelete(task);
    }

    return (
        <div className="flex gap-2 items-center">
            <img
                src={completed ? '/checkbox_signed.svg' : '/checkbox.svg'}
                alt=""
                className="cursor-pointer"
                onClick={toggleCompleted}
            />
            {isEditing ? (
                <div className='flex items-center justify-center gap-4 w-fit h-fit'>
                    <input
                        ref={inputRef}
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="border rounded px-1"
                    />

                    <img
                        src={'/red_trash.svg'}
                        alt="Lata de lixo vermelha"
                        className="cursor-pointer hover:scale-150 transition-transform duration-200"
                        onMouseDown={handleDelete}
                    />
                </div>
            ) : (
                <p
                    onDoubleClick={handleDoubleClick}
                    className={`${completed ? 'opacity-50' : 'opacity-100'}`}
                >
                    {completed ? <s>{desc}</s> : desc}
                </p>
            )}
        </div>
    )
}
