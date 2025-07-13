'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import findProjectById from "@/apis/backend/projects/find-project-by-id";
import { FindProjectByIdResponseDto } from "@/apis/backend/projects/models/dtos/find-project-by-id-response.dto";
import TaskCard from "@/components/TaskCard";

export default function ProjectPage() {
    const { id } = useParams();
    const numberId = Number(id);
    const [project, setProject] = useState<FindProjectByIdResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!Number.isNaN(numberId)) {
            findProjectById(numberId).then((data) => {
                setProject(data);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [numberId]);

    if (loading) return <p>Carregando...</p>;

    if (!project) return <p>Projeto inválido</p>;

    return (
        <div>
            <h1 className="text-center my-[50px]"> {project.name} </h1>

            <p className="text-center"> {project.description && project.description != "" ? project.description : <i className="opacity-50">Sem descrição</i>} </p>

            <div className="mt-[50px] flex flex-row items-center justify-center gap-[25px] flex-wrap">
                {project.users.map((user, index) => (
                    <p key={index} className="rounded-[10px] border py-1 px-2 text-center flex items-center justify-center">
                        {user.name}
                    </p>
                ))}
            </div>

            <h2 className="text-center mt-[100px] mb-[50px]"> Tarefas deste projeto </h2>

            <div className="flex itens-center justify-center flex-wrap gap-[25px]">
                {project.tasks?.length > 0 ? project.tasks.map((task, index) => (
                    <TaskCard key={index} task={task} />
                )) : (
                    <p className="text-center opacity-50"><i> Nenhuma tarefa </i></p>
                )}
            </div>
        </div>
    );
}
