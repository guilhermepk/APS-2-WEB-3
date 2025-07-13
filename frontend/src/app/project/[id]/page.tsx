'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import findProjectById from "@/apis/backend/projects/find-project-by-id";
import { FindProjectByIdResponseDto } from "@/apis/backend/projects/models/dtos/find-project-by-id-response.dto";
import TaskCard from "@/components/TaskCard";
import EditButton from "@/components/EditButton";
import updateProject from "@/apis/backend/projects/update-project";

export default function ProjectPage() {
    const { id } = useParams();
    const numberId = Number(id);
    const [project, setProject] = useState<FindProjectByIdResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (!Number.isNaN(numberId)) {
            findProjectById(numberId).then((data) => {
                setProject(data);
                setTitle(data.name);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [numberId]);

    async function handleTitleBlur() {
        setIsEditingTitle(false);

        await updateProject(numberId, {
            name: title
        });
    };

    if (loading) return <p>Carregando...</p>;

    if (!project) return <p>Projeto inválido</p>;

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="relative text-center my-[50px] w-fit">
                {isEditingTitle ? (
                    <input
                        className="text-3xl font-bold text-center border rounded px-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        <h1 className="text-center font-bold">{title}</h1>

                        <EditButton
                            className="absolute right-[-50px] top-1/2 -translate-y-1/2"
                            onClick={() => setIsEditingTitle(true)}
                        />
                    </>
                )}
            </div>


            <p className="text-center">
                {project.description && project.description != "" ? (
                    project.description
                ) : (
                    <i className="opacity-50">Sem descrição</i>
                )}
            </p>

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
                    project.tasks.map((task, index) => (
                        <TaskCard key={index} task={task} />
                    ))
                ) : (
                    <p className="text-center opacity-50"><i>Nenhuma tarefa</i></p>
                )}
            </div>
        </div>
    );
}
