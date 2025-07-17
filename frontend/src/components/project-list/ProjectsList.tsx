'use client'

import { FindAllProjectsResponseDto } from "@/apis/backend/projects/models/dtos/find-all-projects-response.dto";
import { use, useState } from "react";
import ProjectCard from "./ProjectCard";

interface ProjectsListProps {
    projects: Promise<FindAllProjectsResponseDto> | FindAllProjectsResponseDto
}

export default function ProjectsList({
    projects
}: ProjectsListProps) {
    const resolvedProjects = projects instanceof Promise ? use(projects) : projects;
    const [allProjects, setAllProjects] = useState(resolvedProjects);

    function onProjectDelete(projectId: number) {
        setAllProjects(prev => prev.filter(project => project.id !== projectId));
    }

    return (
        <div
            className={`
                w-full
                flex flex-wrap items-stretch justify-center gap-[50px]
            `}
        >
            {allProjects?.length > 0 ? allProjects.map((project, index) => (
                <ProjectCard key={index} project={project} onDelete={onProjectDelete} />
            )) : (<p><i className="opacity-50"> Nenhum projeto encontrado </i></p>)}
        </div>
    );
}
