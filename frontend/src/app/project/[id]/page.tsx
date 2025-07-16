'use client';

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import findProjectById from "@/apis/backend/projects/find-project-by-id";
import { FindProjectByIdResponseDto } from "@/apis/backend/projects/models/dtos/find-project-by-id-response.dto";
import TaskCard, { Task } from "@/components/TaskCard";
import EditButton from "@/components/EditButton";
import updateProject from "@/apis/backend/projects/update-project";

export default function ProjectPage() {
    const { id } = useParams();
    const numberId = Number(id);
    const [project, setProject] = useState<FindProjectByIdResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [name, setName] = useState("");

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!Number.isNaN(numberId)) {
            findProjectById(numberId).then((data) => {
                setProject(data);
                setName(data.name);
                setDescription(data.description ?? "");
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [numberId]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // reset
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (isEditingDescription && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [isEditingDescription]);


    async function handleTitleBlur() {
        setIsEditingTitle(false);
        await updateProject(numberId, { name });
    }

    async function handleDescriptionBlur() {
        setIsEditingDescription(false);
        await updateProject(numberId, { description });
    }

    function handleTaskDeletion(task: Task) {
        setProject(prev => {
            if (!prev) return null;

            const newTasks = prev.tasks?.filter(projectTask => projectTask.id !== task.id);

            return {
                ...prev,
                tasks: newTasks,
            };
        });
    }

    if (loading) return <p>Carregando...</p>;
    if (!project) return <p>Projeto inválido</p>;

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="relative text-center my-[50px] w-fit">
                {isEditingTitle ? (
                    <input
                        className="text-3xl font-bold text-center border rounded px-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleTitleBlur}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                        autoFocus
                    />
                ) : (
                    <>
                        <h1 className="text-center font-bold">{name}</h1>
                        <EditButton
                            className="absolute right-[-50px] top-1/2 -translate-y-1/2"
                            onClick={() => setIsEditingTitle(true)}
                        />
                    </>
                )}
            </div>

            <div className="relative text-center mb-[30px] w-full max-w-[600px]">
                {isEditingDescription ? (
                    <textarea
                        ref={textareaRef}
                        className="text-center border rounded px-2 py-2 w-full h-auto overflow-hidden resize-none"
                        value={description}
                        onChange={handleChange}
                        onBlur={handleDescriptionBlur}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                (e.target as HTMLTextAreaElement).blur();
                            }
                        }}
                        autoFocus
                    />
                ) : (
                    <>
                        <p className="text-center whitespace-pre-line break-words">
                            {description.trim() !== "" ? (
                                description
                            ) : (
                                <i className="opacity-50">Sem descrição</i>
                            )}
                        </p>
                        <EditButton
                            className="absolute right-[-50px] top-1/2 -translate-y-1/2"
                            onClick={() => setIsEditingDescription(true)}
                        />
                    </>
                )}
            </div>

            <div className="mt-[50px] flex flex-row items-center justify-center gap-[25px] flex-wrap">
                {project.users.map((user, index) => (
                    <p key={index} className="rounded-[10px] border py-1 px-2 text-center flex items-center justify-center">
                        {user.name}
                    </p>
                ))}
            </div>

            <h2 className="text-center mt-[100px] mb-[50px]">Tarefas deste projeto</h2>

            <div className="flex items-center justify-center flex-wrap gap-[25px]">
                {project.tasks?.length > 0 ? (
                    project.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onDelete={handleTaskDeletion} />
                    ))
                ) : (
                    <p className="text-center opacity-50"><i>Nenhuma tarefa</i></p>
                )}
            </div>
        </div>
    );
}
