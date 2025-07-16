import deleteProject from "@/apis/backend/projects/delete-project";
import iziToast, { IziToast } from "izitoast";
import Link from "next/link";

interface ProjectCardProps {
    project: {
        id: number,
        name: string,
        description: string | null,
        users: Array<{
            name: string
        }>
    },
    onDelete: (id: number) => void
}

export default function ProjectCard({
    project, onDelete
}: ProjectCardProps) {
    async function handleDeletionConfirmed(instance: IziToast, toast: HTMLDivElement) {
        await deleteProject(project.id);
        onDelete(project.id);
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        iziToast.success({
            title: 'Sucesso!',
            message: `Projeto deletado`,
            position: "topRight"
        });
    }

    async function handleDeletetionTrying(event: { stopPropagation: () => void }) {
        event.stopPropagation();

        // const iziToast = (await import('izitoast')).default;

        iziToast.question({
            title: `Tem certeza?`,
            message: `Excluir projeto <span style="color: red; font-weight: 800;">${project.name}</span>?`,
            position: 'center',
            timeout: false,
            overlay: true,
            close: false,
            overlayClose: true,
            buttons: [
                ['<button>Sim</button>', async (instance, toast, button, event, inputs) => {
                    await handleDeletionConfirmed(instance, toast);
                }, false],
                ['<button>Não</button>', (instance, toast, button, event, inputs) => {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true]
            ],
        });
    }

    return (
        <div className={`
            relative
            w-[500px]
        `}>
            <img
                src={'/red_trash.svg'}
                alt="Lata de lixo vermelha"
                className="absolute right-4 top-4 cursor-pointer hover:scale-150 transition-transform duration-200"
                onClick={handleDeletetionTrying}
            />

            <Link href={`/project/${project.id}`}>
                <div className={`
                    p-4
                    flex items-center justify-center flex-col gap-8
                    w-full h-full
                    border rounded-[10px]
                    hover:bg-[var(--foreground)] hover:text-[var(--background)] cursor-pointer                    
                `}>
                    <h2 className="text-center w-[80%]"> {project.name} </h2>

                    <p className="line-clamp-3 text-justify h-full">
                        {project.description && project.description != "" ? project.description : <i className="opacity-50"> Sem descrição </i>}
                    </p>

                    <div className={`
                        flex itens-center justify-center gap-4 flex-wrap
                    `}>
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