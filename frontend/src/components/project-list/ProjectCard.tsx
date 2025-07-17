'use client'

import { useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";
import deleteProject from "@/apis/backend/projects/delete-project";

interface ProjectCardProps {
    project: {
        id: number,
        name: string,
        description: string | null,
        users: { name: string }[]
    },
    onDelete: (id: number) => void
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
    const handleDeletetionTrying = useCallback(async (event: React.MouseEvent) => {
        event.stopPropagation();

        const iziToast = (await import('izitoast')).default;

        iziToast.question({
            title: `Tem certeza?`,
            message: `Excluir projeto <span style="color: red; font-weight: 800;">${project.name}</span>?`,
            position: 'center',
            timeout: false,
            overlay: true,
            close: false,
            overlayClose: true,
            buttons: [
                ['<button>Sim</button>', async (instance: any, toast: HTMLDivElement) => {
                    await deleteProject(project.id);
                    onDelete(project.id);
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, false],
                ['<button>Não</button>', (instance: any, toast: HTMLDivElement) => {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true]
            ],
        });
    }, [onDelete, project.id, project.name]);

    return (
        <div className="relative w-[500px]">
            <Image
                src={'/red_trash.svg'}
                alt="Lata de lixo vermelha"
                className="absolute right-4 top-4 cursor-pointer hover:scale-150 transition-transform duration-200"
                onClick={handleDeletetionTrying}
            />

            <Link href={`/project/${project.id}`}>
                <div className="p-4 flex items-center justify-center flex-col gap-8 w-full h-full border rounded-[10px] hover:bg-[var(--foreground)] hover:text-[var(--background)] cursor-pointer">
                    <h2 className="text-center w-[80%]">{project.name}</h2>

                    <p className="line-clamp-3 text-justify h-full">
                        {project.description && project.description !== "" ? project.description : <i className="opacity-50">Sem descrição</i>}
                    </p>

                    <div className="flex itens-center justify-center gap-4 flex-wrap">
                        {project.users.map((user, index) => (
                            <p key={index} className="px-2 py-1 border rounded-[10px]">
                                {user.name}
                            </p>
                        ))}
                    </div>
                </div>
            </Link>
        </div>
    );
}
