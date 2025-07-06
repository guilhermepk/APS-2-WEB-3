'use client'

import { FindAllProjectsResponseDto } from "@/apis/backend/projects/models/dtos/find-all-projects-response.dto";
import { use } from "react";
import ProjectCard from "./ProjectCard";

interface ProjectsListProps {
    projects: Promise<FindAllProjectsResponseDto>
}

export default function ProjectsList({
    projects
}: ProjectsListProps) {
    const allProjects = use(projects);

    return (
        <div
            className={`
                w-full
                flex flex-wrap items-stretch justify-center gap-[50px]
            `}
        >
            {allProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
            ))}
        </div>
    );
}