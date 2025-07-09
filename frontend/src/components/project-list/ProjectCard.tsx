import Link from "next/link";

interface ProjectCardProps {
    project: {
        id: number,
        name: string,
        description: string | null,
        users: Array<{
            name: string
        }>
    }
}

export default function ProjectCard({
    project
}: ProjectCardProps) {
    return (
        <div className={`
            border rounded-[10px]
            w-[500px]
            hover:bg-[var(--foreground)] hover:text-[var(--background)] cursor-pointer
        `}>
            <Link href={`/project/${project.id}`}>
                <div className={`
                    p-4
                    flex items-center justify-center flex-col gap-8
                    w-full h-full
                `}>
                    <h2 className="text-center"> {project.name} </h2>

                    <p className="line-clamp-3 text-justify h-full">
                        {project.description ?? <i className="opacity-50"> Sem descrição </i>}
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