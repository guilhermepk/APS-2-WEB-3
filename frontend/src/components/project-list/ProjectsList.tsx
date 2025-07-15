'use client'

import { FindAllProjectsResponseDto } from "@/apis/backend/projects/models/dtos/find-all-projects-response.dto";
import { use, useState } from "react";
import ProjectCard from "./ProjectCard";

interface ProjectsListProps {
    projects: Promise<FindAllProjectsResponseDto>
}

export default function ProjectsList({
    projects
}: ProjectsListProps) {
    const resolvedProjects = use(projects);
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
            {allProjects.map((project, index) => (
                <ProjectCard key={index} project={project} onDelete={onProjectDelete} />
            ))}
        </div>
    );
}
