'use client'

import findAllProjects from "@/apis/backend/projects/find-all-projects";
import AddButton from "@/components/AddButton";
import ProjectsList from "@/components/project-list/ProjectsList";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  const projects = findAllProjects();

  return (
    <div className={`
      flex items-center justify-center flex-col
    `}>
      <h1 className="mt-[50px] mb-[100px]"> Projetos </h1>

      <AddButton className="mb-16" onClick={() => redirect('project/create')} text="Novo projeto" />

      <Suspense fallback={<p> Carregando... </p>}>
        <ProjectsList projects={projects} />
      </Suspense>
    </div>
  );
}
